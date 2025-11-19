from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from services.play_list import me_bp
from datetime import timedelta
import os

app = Flask(__name__)

# Configure CORS properly

CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"])
app.secret_key = os.getenv('SECRET_KEY', 'FLASK_SECRET_KEY')
# Session configuration
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=31)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True

app.register_blueprint(auth_bp)
app.register_blueprint(me_bp)

@app.route("/")
def home():
    return {"message": "Welcome to Moodify backend!"}

# In your main Flask app file (app.py or similar)
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)