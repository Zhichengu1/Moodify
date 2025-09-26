import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Authenticate with Spotify (Client Credentials Flow)
client_credentials_manager = SpotifyClientCredentials(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET")
)

# Spotify object for API calls
sp = Spotify(client_credentials_manager=client_credentials_manager)

# Mood → Genre mapping
MOOD_GENRE_MAP = {
    "happy": "pop",
    "sad": "acoustic",
    "chill": "lofi",
    "focus": "classical",
    "angry": "metal",
    "romantic": "r&b",
    "energetic": "edm"
}

def get_playlist_for_mood(mood, limit=5):
    """
    Fetches a dynamic playlist based on the mood.
    Returns track name, artist, album art, and preview URL.
    """
    genre = MOOD_GENRE_MAP.get(mood.lower(), "pop")  # default to pop
    results = sp.search(q=f"genre:{genre}", type="track", limit=limit)

    playlist = []
    for item in results['tracks']['items']:
        track_info = {
            "track": item['name'],
            "artist": item['artists'][0]['name'],
            "preview_url": item['preview_url'],  # 30-second preview
            "album_art": item['album']['images'][0]['url'] if item['album']['images'] else None
        }
        playlist.append(track_info)

    return {"mood": mood, "playlist": playlist}

