from flask import Blueprint, request, session, jsonify
from spotipy import Spotify
from spotipy.exceptions import SpotifyException
from routes.auth_helpers import get_spotify_client
from collections import Counter 
import random

me_bp = Blueprint("me", __name__, url_prefix="/me")

# --- Helper functions ---
def get_top_tracks(sp, limit=20):
    """Get user's top tracks with error handling"""
    try:
        result = sp.current_user_top_tracks(limit=limit, time_range="medium_term")
        songs = []
        for t in result["items"]:
           songs.append({
                "name": t["name"],
                "artist": t["artists"][0]["name"],
                "preview": t["preview_url"],
                "album_art": t["album"]["images"][0]["url"] if t["album"]["images"] else None
            })
        return songs
    except Exception as e:
        print(f"❌ Error getting top tracks: {e}")
        return []

def get_valid_seeds(sp):
    """Dynamically fetch valid genre seeds from Spotify"""
    try:
        return sp.recommendation_genre_seeds()['genres']
    except Exception as e:
        print(f"⚠️ Could not fetch dynamic genres: {e}")
        # Fallback to a minimal safe list if API fails
        return ["pop", "rock", "hip-hop", "electronic", "indie"]

def normalize_genre(genre, valid_genres):
    """Converts artist genres to Spotify recommendation genres"""
    genre_lower = genre.lower().strip()
    
    # Direct match
    if genre_lower in valid_genres:
        return genre_lower
    
    # Extended genre mappings
    GENRE_MAPPINGS = {
        "dance pop": "dance", "pop dance": "dance", "indie pop": "indie-pop",
        "synth pop": "synth-pop", "country pop": "country", "pop rock": "pop",
        "electro pop": "electro", "dream pop": "indie-pop", "bedroom pop": "indie-pop",
        "art pop": "indie-pop", "power pop": "power-pop", "latin pop": "latin",
        "taiwanese pop": "mandopop", "c-pop": "mandopop", "cpop": "mandopop",
        "indie rock": "indie-pop", "alt rock": "alt-rock", "alternative rock": "alternative",
        "hard rock": "hard-rock", "punk rock": "punk-rock", "j rock": "j-rock",
        "psychedelic rock": "psych-rock", "garage rock": "garage",
        "hip hop": "hip-hop", "rap": "hip-hop", "trap": "hip-hop",
        "k-rap": "k-pop", "chinese hip hop": "hip-hop", "mandarin hip hop": "hip-hop",
        "cantonese hip hop": "hip-hop", "taiwanese hip hop": "hip-hop",
        "r&b": "r-n-b", "rnb": "r-n-b", "rhythm and blues": "r-n-b",
        "chinese r&b": "r-n-b", "mandarin r&b": "r-n-b", "taiwanese r&b": "r-n-b",
        "k-r&b": "r-n-b", "kr&b": "r-n-b",
        "indie": "indie-pop", "indie folk": "folk", "chinese indie": "indie-pop",
        "taiwanese indie": "indie-pop", "mandarin indie": "indie-pop",
        "k-pop": "k-pop", "kpop": "k-pop", "korean pop": "k-pop",
        "j-pop": "j-pop", "jpop": "j-pop", "japanese pop": "j-pop",
        "j-rock": "j-rock", "jrock": "j-rock",
        "mandopop": "mandopop", "mando-pop": "mandopop",
        "cantopop": "cantopop", "canto-pop": "cantopop",
        "electronic dance music": "edm", "electronic": "electronic",
        "edm": "edm", "house music": "house", "deep house": "deep-house",
        "heavy metal": "heavy-metal", "death metal": "death-metal",
        "singer songwriter": "singer-songwriter", "acoustic pop": "acoustic",
        "soul music": "soul", "disco music": "disco"
    }
    
    # Check mappings
    if genre_lower in GENRE_MAPPINGS:
        target = GENRE_MAPPINGS[genre_lower]
        if target in valid_genres:
            return target
            
    # Partial matching against valid list
    for valid in valid_genres:
        if valid in genre_lower or genre_lower in valid:
            return valid
            
    return None

def match_genres_to_spotify(sp, user_genres):
    """Matches user's genres to Spotify's valid genres using dynamic list"""
    valid_spotify_genres = get_valid_seeds(sp)
    matched_genres = []
    
    print("\n🔍 Matching genres:")
    for genre in user_genres:
        matched = normalize_genre(genre, valid_spotify_genres)
        if matched:
            matched_genres.append(matched)
            print(f"  ✅ '{genre}' -> '{matched}'")
        else:
            print(f"  ⚠️  '{genre}' -> No match")
    
    # Remove duplicates while preserving order
    unique_genres = list(dict.fromkeys(matched_genres))[:5]
    print(f"\n🎵 Using: {unique_genres}\n")
    
    return unique_genres

def get_top_genres(sp, limit=5):
    """Get user's top genres from their favorite artists"""
    try:
        top_artists = sp.current_user_top_artists(limit=10, time_range="medium_term")
        if not top_artists["items"]:
            print("⚠️  No top artists found")
            return []
        all_genres = []
        print("\n" + "="*50)
        print("🎤 Your Top Artists & Genres:")
        print("="*50)
        for artist in top_artists["items"][:5]:
            genres = artist["genres"]
            all_genres.extend(genres)
            print(f"• {artist['name']}: {', '.join(genres) if genres else 'No genres'}")
        
        # Get most common genres
        genre_counts = Counter(all_genres)
        top_genres = [genre for genre, count in genre_counts.most_common(10)]
        print(f"\n📊 Most common: {', '.join(top_genres[:5])}")
        print("="*50 + "\n")
        
        return top_genres
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def get_recommendation_by_genres(sp, user_genres, limit=20):
    """
    Generates recommendations using the Search API (bypass for deprecated Recommendations API).
    """
    print(f"🔍 Getting {limit} recommendations via Search API for: {user_genres}...")
    
    songs = []
    res = {}
    target_per_genre = (limit // len(user_genres)) + 1
    
    for genre in user_genres:
        # 1. Construct a search query for the genre
        #    "genre:pop" is a valid Spotify search filter
        query = f"genre:{genre}"
        
        try:
            # 2. randomize 'offset' to get different songs each time
            #    Spotify allows offset up to 1000 for search
            random_offset = random.randint(0, 950)
            
            results = sp.search(
                q=query, 
                limit=target_per_genre, 
                type="track", 
                offset=random_offset
            )
            
            for track in results['tracks']['items']:
                # Filter out duplicates if necessary
                songs.append({
                    "name": track["name"],
                    "artist": track["artists"][0]["name"],
                    "preview": track["preview_url"],
                    "album_art": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
                    "spotify_url": track["external_urls"]["spotify"],
                    "uri": track["uri"]
                })
        except Exception as e:
            print(f"⚠️ Could not search for genre '{genre}': {e}")
            continue

    # Shuffle results to mix genres together
    random.shuffle(songs)
    
    # Trim to requested limit
    songs = songs[:limit]
    
    print(f"✅ Found {len(songs)} tracks via Search.\n")
    
    return {
        "tracks": songs,
        "genres_used": user_genres,
        "total_count": len(songs)
    }
   

# --- Routes ---
@me_bp.route("/playlist", methods=["POST"])
def create_playlist():
    """Create a playlist"""
    sp = get_spotify_client()
    if not sp:
        return jsonify({"error": "User not logged in"}), 401
    
    try:
        top_genres = get_top_genres(sp)
        recommendations = get_recommendation_by_genres(sp, top_genres, 30)
        return jsonify({
            "message": "Recommendations generated!",
            "recommendations": recommendations["tracks"][:10],
            "genres_used": recommendations["genres_used"],
            "total_available": recommendations["total_count"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@me_bp.route("/favorite-songs", methods=["GET"])
def get_top_songs():
    """Get user's favorite songs and recommendations"""
    sp = get_spotify_client()
    if not sp:
        return jsonify({"error": "User not logged in"}), 401
    
    try:
        print("\n" + "="*50)
        print("🎵 Fetching favorite songs...")
        print("="*50)
        
        songs = get_top_tracks(sp, 20)
        print(f"✅ Got {len(songs)} favorite songs")
        
        top_genres = get_top_genres(sp)
        print(f"✅ Got {len(top_genres)} genres")
        
        recommendations = get_recommendation_by_genres(sp, top_genres, 20)
        
        print("="*50 + "\n")
        
        return jsonify({
            "favorite_songs": songs,
            "recommendations": recommendations["tracks"],
            "genres_used": recommendations["genres_used"]
        })
        
    except SpotifyException as e:
        print(f"❌ Spotify API error: {e}")
        return jsonify({"error": f"Spotify API error: {str(e)}"}), 500
    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# Debug route for testing genre matching
@me_bp.route("/test-genres", methods=["GET"])
def test_genres():
    """Test genre matching - useful for debugging"""
    sp = get_spotify_client()
    if not sp:
        return jsonify({"error": "User not logged in"}), 401
    
    try:
        top_genres = get_top_genres(sp)
        valid_spotify_genres = get_valid_seeds(sp)
        
        results = []
        for genre in top_genres[:15]:
            matched = normalize_genre(genre, valid_spotify_genres)
            results.append({
                "original": genre,
                "matched": matched
            })
        
        return jsonify({
            "your_top_genres": top_genres[:15],
            "matching_results": results
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500