from flask import Blueprint, redirect, request, session, jsonify
from services.spotify_service import sp_oauth
from spotipy import Spotify
import os

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

# Frontend URL (where to redirect after login)
# Ensure this is localhost if you are visiting localhost:3000 in Chrome
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
@auth_bp.route("/login")
def login():
    """Redirect user to Spotify login"""
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@auth_bp.route("/callback")
def callback():
    """
    Handle Spotify's redirect after user authentication
    """
    # Check if user denied access
    error = request.args.get("error")
    if error:
        # Redirect to frontend with error
        return redirect(f"{FRONTEND_URL}?error=access_denied")
    
    # Get authorization code
    code = request.args.get("code")
    if not code:
        return redirect(f"{FRONTEND_URL}?error=no_code")
    
    try:
        # Exchange code for tokens
        token_info = sp_oauth.get_access_token(code, as_dict=True, check_cache=False)
        
        if not token_info:
            return redirect(f"{FRONTEND_URL}?error=token_failed")
        
        # Store in session
        session["token_info"] = token_info
        session.permanent = True
        
        # Verify token works by getting user info
        sp = Spotify(auth=token_info["access_token"])
        user = sp.current_user()
        
        print(f"✅ User logged in: {user['display_name']}")
        
        # Redirect back to frontend dashboard
        return redirect(f"{FRONTEND_URL}")
        
    except Exception as e:
        print(f"❌ Callback error: {e}")
        return redirect(f"{FRONTEND_URL}?error=auth_failed")


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/status", methods=["GET"])
def check_auth_status():
    """Check if user is authenticated"""
    token_info = session.get("token_info")
    
    if not token_info:
        return jsonify({"authenticated": False}), 401
    
    try:
        sp = Spotify(auth=token_info["access_token"])
        user = sp.current_user()
        
        return jsonify({
            "authenticated": True,
            "user_id": user["id"],
            "display_name": user["display_name"],
            "email": user.get("email"),
            "profile_image": user["images"][0]["url"] if user.get("images") else None
        }), 200
        
    except Exception as e:
        print(f"❌ Auth status check failed: {e}")
        session.clear()
        return jsonify({"authenticated": False}), 401