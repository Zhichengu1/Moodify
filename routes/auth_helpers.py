"""
Authentication helper functions for token management
"""
from flask import session
from spotipy import Spotify
from services.spotify_service import sp_oauth
import time

def get_spotify_client():
    """
    Returns authenticated Spotify client with automatic token refresh.
    
    How it works:
    1. Gets token from session
    2. Checks if expired
    3. Refreshes if needed
    4. Returns ready-to-use client
    
    Returns:
        Spotify: Authenticated client, or None if not logged in
    """
    token_info = session.get("token_info")
    
    if not token_info:
        print("âŒ No token in session")
        return None
    
    # Check if token is expired
    current_time = int(time.time())
    expires_at = token_info.get('expires_at', 0)
    
    # Add 60 second buffer (refresh before actual expiration)
    is_expired = current_time >= expires_at - 60
    
    if is_expired:
        print("ðŸ”„ Token expired, refreshing...")
        try:
            # Use refresh token to get new access token
            refresh_token = token_info.get('refresh_token')
            if not refresh_token:
                print("âŒ No refresh token available")
                return None
            
            # Get new token
            new_token_info = sp_oauth.refresh_access_token(refresh_token)
            
            # Update session with new token
            session["token_info"] = new_token_info
            token_info = new_token_info
            
            print("âœ… Token refreshed successfully")
        except Exception as e:
            print(f"âŒ Token refresh failed: {e}")
            return None
    
    # Return authenticated client
    return Spotify(auth=token_info['access_token'])


def require_auth(f):
    """
    Decorator to protect routes that need authentication.
    Automatically handles token refresh.
    
    Usage:
        @me_bp.route("/favorite-songs")
        @require_auth
        def get_top_songs(sp):
            # sp is guaranteed to be valid here
            songs = get_top_tracks(sp, 20)
            return jsonify({"songs": songs})
    """
    from functools import wraps
    from flask import jsonify
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        sp = get_spotify_client()
        
        if not sp:
            return jsonify({"error": "Unauthorized. Please login again."}), 401
        
        # Pass Spotify client as first argument to the function
        return f(sp, *args, **kwargs)
    
    return decorated_function