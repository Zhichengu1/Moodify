from flask import Blueprint, redirect, request, session, jsonify
from services.spotify_service import sp_oauth
from spotipy import Spotify

auth_bp = Blueprint("auth", __name__, url_prefix="/api") # all api routes come here for spotify process

# Step 1: Redirect user to Spotify login
@auth_bp.route("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url) # send a http redirect to browser

# Step 2: Spotify redirects here after login
@auth_bp.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "No code provided"}), 400
    try:
        token_info = sp_oauth.get_access_token(code, as_dict=True)
        session["token_info"] = token_info
        session.permanent = True  # Session lasts longer
        sp = Spotify(auth=token_info["access_token"])
        user = sp.current_user()
        
        return jsonify({
            "message": "Login successful!",
            "user_display_name": user["display_name"],
            "user_id": user["id"],
            "email": user.get("email")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Clears user session to log them out
    
    Returns:
        JSON response confirming logout
    """
    # TODO: Clear the session
    session.clear()
    # TODO: Return success message
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/status", methods=["GET"])
def check_auth_status():
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
            "email": user.get("email")
        }), 200
    except:
        session.clear()  # Clear invalid session
        return jsonify({"authenticated": False}), 401