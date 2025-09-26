from flask import Blueprint, request, jsonify
from services.spotify_service import get_playlist_for_mood

mood_bp = Blueprint("mood", __name__)

@mood_bp.route("/", methods=["GET"])
def mood_playlist():
    """
    Endpoint: /mood?feeling=happy&limit=5
    Returns a JSON playlist based on mood
    """
    mood = request.args.get("feeling", "happy")
    limit = int(request.args.get("limit", 5))

    playlist = get_playlist_for_mood(mood, limit)
    return jsonify(playlist)
