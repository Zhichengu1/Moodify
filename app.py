from flask import Flask
from routes.auth_routes import auth_bp  # <- updated import path
from services.play_list import me_bp  # import your mood blueprint
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "supersecretkey"  # required for sessions
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(me_bp)  # <-- register mood routes

@app.route("/")
def home():
    return {"message": "Welcome to Moodify backend!"}


if __name__ == "__main__":
    app.run(debug=True)
