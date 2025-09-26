from flask import Flask, jsonify, request
from routes.mood_routes import mood_bp  # blueprint for /mood
from routes.auth_routes import auth_bp


app = Flask(__name__)

# Register mood blueprint
app.register_blueprint(mood_bp, url_prefix="/mood")
app.register_blueprint(auth_bp, url_prefix="/auth")


@app.route("/")
def home():
    return jsonify({"message": "Welcome to Moodify 🎶 — enter your mood to get a playlist!"})

if __name__ == "__main__":
    app.run(debug=True)
