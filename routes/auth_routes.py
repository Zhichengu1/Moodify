# routes/auth_routes.py
from flask import Blueprint, redirect
from spotipy.oauth2 import SpotifyOAuth
import os

auth_bp = Blueprint("auth", __name__)

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope="user-read-private"
)

@auth_bp.route("/login")
def login():
    # This URL will redirect the user to Spotify's login page
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)
