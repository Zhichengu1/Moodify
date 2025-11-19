import os
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv() # load the credientials for calling for api calls

scope = "playlist-modify-public playlist-modify-private user-read-private user-top-read user-read-email" # access information
sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope=scope
)
# object of spotify OAuth
# provide the token require to access the user's profile
# access token 
# refresh token


