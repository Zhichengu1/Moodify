# Moodify
Moodify is a web application that generates Spotify playlists based on the user's current mood. Users can log in with Spotify, select their mood, and receive a curated playlist with previews of tracks. Premium users can optionally save the playlist directly to their Spotify account.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Spotify API Integration](#spotify-api-integration)
- [Feature Documentation](#feature-documentation)
- [Hosting](#hosting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
Moodify allows users to quickly generate playlists that match their current mood or activity. It leverages the Spotify Web API to fetch tracks, generate playlists, and optionally save them to a user's account. The app features a modern, dark-themed interface built with React and Tailwind CSS and a Python Flask backend for handling Spotify OAuth and API calls.

---

## Features
- **Mood-based playlist generation**: Choose moods such as happy, sad, chill, workout, or study.
- **Spotify login for users**: OAuth login via Spotify.
- **Preview playback**: Listen to short previews of songs before saving. (disabled by the Spotify Web API)
- **Playlist creation**: (Optional) Save playlists directly to Spotify for Premium users.
- **Customizable playlist length**: Optionally specify the number of songs in a playlist.
- **Favorite-style suggestions**: Generate playlists based on the user's preferred genres and favorite tracks.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Python, Flask, Spotipy
- **Database**: Optional (SQLite / Redis for session or user data)
- **APIs**: Spotify Web API

---

## Setup & Installation

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed
- Spotify Developer account

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moodify.git
   cd moodify/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate    # macOS / Linux
   venv\Scripts\activate       # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
   FLASK_SECRET_KEY=your_secret_key
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

---

## Usage

1. **Login**: Click "Login with Spotify" to authenticate.
2. **Select Mood**: Choose your current mood from the available options.
3. **Generate Playlist**: Click "Generate Playlist" to create a custom playlist.
4. **Preview Songs**: Listen to 30-second previews (if available).
5. **Save to Spotify**: (Premium users) Save the playlist directly to your Spotify account.

---

## Spotify API Integration

### Authentication Flow
- OAuth 2.0 Authorization Code Flow
- Scopes required: `user-read-private`, `user-read-email`, `playlist-modify-public`, `playlist-modify-private`

### Key Endpoints Used
- `/v1/me` - Get current user profile
- `/v1/recommendations` - Generate track recommendations
- `/v1/users/{user_id}/playlists` - Create playlists
- `/v1/playlists/{playlist_id}/tracks` - Add tracks to playlist

---

## Feature Documentation

### 1. Mood-Based Playlist Generation
**Description**: Users can select from predefined moods to generate a playlist that matches their emotional state or activity.

**How it works**:
- Each mood is mapped to specific audio features (valence, energy, danceability, etc.)
- The backend queries Spotify's recommendation API with these parameters
- Returns 20-50 tracks based on the selected mood

**Moods Available**:
- **Happy**: High valence (0.7-1.0), high energy (0.6-0.9)
- **Sad**: Low valence (0.0-0.3), low energy (0.2-0.5)
- **Chill**: Medium valence (0.4-0.6), low-medium energy (0.3-0.6)
- **Workout**: High energy (0.8-1.0), high tempo (120-180 BPM)
- **Study**: Low energy (0.2-0.5), instrumental preference

---

### 2. Spotify OAuth Authentication (`auth_routes.py`)
**Description**: Secure user authentication using Spotify's OAuth 2.0 flow, implemented through Flask backend routes.

**How it works**:
1. **SpotifyOAuth Object Creation**: The `sp_oauth` object is instantiated in `auth_routes.py` with client credentials and redirect URI
2. **Authorization URL Generation**: When user clicks "Login with Spotify", the backend calls `sp_oauth.get_authorize_url()` to generate the Spotify authorization URL
3. **User Authorization**: User is redirected to Spotify's login page to grant permissions
4. **Callback Handling**: After authorization, Spotify redirects to `/callback` route with an authorization code
5. **Token Exchange**: The callback route exchanges the code for access and refresh tokens using `sp_oauth.get_access_token()`
6. **Session Storage**: Tokens are stored server-side in Flask session for security
7. **Frontend Redirect**: After successful authentication, user is redirected to React frontend dashboard using Flask's `redirect()` function

**Key Routes**:
```python
# auth_routes.py

from spotipy.oauth2 import SpotifyOAuth

# Initialize SpotifyOAuth object
sp_oauth = SpotifyOAuth(
    client_id=os.getenv('SPOTIFY_CLIENT_ID'),
    client_secret=os.getenv('SPOTIFY_CLIENT_SECRET'),
    redirect_uri=os.getenv('SPOTIFY_REDIRECT_URI'),
    scope='user-read-private user-read-email playlist-modify-public'
)

@app.route('/login')
def login():
    """Generate and return Spotify authorization URL"""
    auth_url = sp_oauth.get_authorize_url()
    return jsonify({'auth_url': auth_url})

@app.route('/callback')
def callback():
    """Handle OAuth callback and redirect to frontend dashboard"""
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    
    # Store tokens in session
    session['token_info'] = token_info
    
    # Redirect to React frontend dashboard (not render_template)
    return redirect('http://localhost:3000/dashboard')

@app.route('/auth/status')
def auth_status():
    """Check if user is authenticated"""
    token_info = session.get('token_info')
    
    if token_info:
        # Check if token is expired
        now = int(time.time())
        is_expired = token_info['expires_at'] - now < 60
        
        if is_expired:
            # Refresh the token
            token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
            session['token_info'] = token_info
        
        return jsonify({'authenticated': True})
    
    return jsonify({'authenticated': False})
```

**Frontend Integration**:
```javascript
// React component example
const handleLogin = async () => {
  const response = await fetch('http://localhost:5000/login');
  const data = await response.json();
  window.location.href = data.auth_url;
};

const checkAuthStatus = async () => {
  const response = await fetch('http://localhost:5000/auth/status');
  const data = await response.json();
  return data.authenticated; // Returns true or false
};
```

**Security Considerations**:
- Tokens are stored server-side in Flask session only (never exposed to frontend)
- Uses `redirect()` instead of `render_template()` to maintain React SPA architecture
- HTTPS required for production environment
- Token refresh handled automatically when expired
- Session cookies should be set with `httpOnly` and `secure` flags in production

---

### 3. Track Preview Playback
**Description**: Users can listen to 30-second previews of tracks before saving the playlist.

**How it works**:
- Spotify API provides preview URLs for most tracks
- Frontend HTML5 audio player handles playback
- Play/pause controls for each track

**Limitations**:
- Not all tracks have preview URLs available
- Requires active internet connection
- Preview quality limited by Spotify's API

---

### 4. Custom Playlist Length
**Description**: Users can specify the number of tracks they want in their generated playlist.

**How it works**:
- Slider or input field allows selection (10-100 tracks)
- Backend adjusts the number of recommendation requests
- Duplicates are filtered out

**Usage**:
```python
# Backend example
playlist_length = request.args.get('length', default=20, type=int)
recommendations = sp.recommendations(
    seed_genres=['pop', 'rock'],
    limit=min(playlist_length, 100)
)
```

---

### 5. Personalized Recommendations
**Description**: Generate playlists based on user's listening history and favorite genres.

**How it works**:
- Analyzes user's top artists and tracks
- Extracts preferred genres
- Uses these as seeds for recommendations
- Combines mood parameters with personal preferences

**API Usage**:
- `/v1/me/top/artists` - Get user's top artists
- `/v1/me/top/tracks` - Get user's top tracks
- Used as seed data for `/v1/recommendations`

---

### 6. Save Playlist to Spotify
**Description**: Premium users can save generated playlists directly to their Spotify account.

**How it works**:
1. Create new playlist in user's account
2. Add generated tracks to playlist
3. Set playlist name (e.g., "Moodify - Happy Vibes")
4. Optionally add custom description

**Requirements**:
- User must have Spotify Premium
- Requires `playlist-modify-public` or `playlist-modify-private` scope

**Code Example**:
```python
# Create playlist
playlist = sp.user_playlist_create(
    user_id=user_id,
    name=f"Moodify - {mood.title()}",
    public=False,
    description="Generated by Moodify"
)

# Add tracks
sp.playlist_add_items(playlist['id'], track_uris)
```

---

### [Add More Features Here]

### Template for Adding New Features:
```markdown
### X. [Feature Name]
**Description**: [Brief description of what the feature does]

**How it works**:
- [Step 1]
- [Step 2]
- [Step 3]

**Technical Details**:
- [API endpoints used]
- [Key functions/components]
- [Data structures]

**Usage Example**:
```[language]
[Code example if applicable]
```

**Limitations/Notes**:
- [Any known limitations]
- [Special requirements]
```

---

## Hosting

### Deployment Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS Elastic Beanstalk, Google Cloud Run

### Environment Variables (Production)
```
SPOTIFY_CLIENT_ID=your_production_client_id
SPOTIFY_CLIENT_SECRET=your_production_client_secret
SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
FLASK_SECRET_KEY=your_secure_secret_key
DATABASE_URL=your_database_url (optional)
```

### Deployment Checklist
- [ ] Update redirect URIs in Spotify Developer Dashboard
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Configure CORS settings
- [ ] Test OAuth flow in production
- [ ] Monitor API rate limits

---

## Future Improvements
- [ ] Social sharing features
- [ ] Collaborative playlist generation
- [ ] Music discovery based on weather/time of day
- [ ] Integration with Apple Music and other platforms
- [ ] Advanced filters (year, popularity, explicit content)
- [ ] User playlist history and favorites
- [ ] Mobile app (React Native)
- [ ] Mood detection via facial recognition or text analysis

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotipy Python Library](https://spotipy.readthedocs.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

