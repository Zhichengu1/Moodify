# Moodify Frontend

A modern React application for generating mood-based Spotify playlists. Built with React, Tailwind CSS, and Axios for seamless API communication.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [State Management](#state-management)
- [API Communication](#api-communication)
- [Routing & Navigation](#routing--navigation)
- [Component Documentation](#component-documentation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The Moodify frontend is a Single Page Application (SPA) built with React that provides an intuitive interface for users to generate personalized Spotify playlists based on their current mood. It communicates with a Flask backend for Spotify OAuth authentication and playlist management.

---

## Features

- **Modern Landing Page**: Attractive hero section with animated elements and feature highlights
- **Spotify OAuth Integration**: Secure authentication flow with session management
- **Mood-Based Playlist Generation**: Visual mood selector with 5 different moods
- **Dashboard Interface**: Clean, sidebar layout with user profile and song cards
- **Real-time Authentication**: Automatic auth status checking and redirects
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Graceful error management with user-friendly messages

---

## Tech Stack

- **React** 18.x - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **Create React App** - Build tooling and configuration

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── config.js          # Axios instance configuration
│   │   └── spotify.js         # API endpoint functions
│   ├── components/
│   │   ├── LandingPage.js     # Landing page component
│   │   └── Dashboard.js       # Main dashboard component
│   ├── App.js                 # Root component with routing logic
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles and Tailwind imports
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher
- Backend Flask server running on `http://127.0.0.1:5000`

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/moodify.git
   cd moodify/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   touch .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start the development server**:
   ```bash
   npm start
   ```

6. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Configuration

### Axios Configuration (`src/api/config.js`)

The application uses a centralized Axios instance for all API requests:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // Flask backend URL
  withCredentials: true,              // Send cookies with requests
});

export default api;
```

**Key Configuration Options**:
- `baseURL`: Base URL for all API requests (Flask backend)
- `withCredentials: true`: **CRITICAL** - Enables sending cookies/session data with cross-origin requests for OAuth authentication

---

## Architecture & Design Patterns

### Component-Based Architecture

The application follows React's component-based architecture with clear separation of concerns:

1. **Presentational Components**: `LandingPage`, `Dashboard`, `Sidebar`, `SongCard`
2. **Container Components**: `App.js` (handles routing and authentication logic)
3. **API Layer**: `src/api/` (centralized API communication)

### Single Page Application (SPA) Flow

```
User visits app
    ↓
App.js checks authentication status
    ↓
Not authenticated → LandingPage
    ↓
User clicks "Get Started"
    ↓
Redirect to backend /api/login
    ↓
Spotify OAuth flow (handled by backend)
    ↓
Backend redirects to frontend /dashboard
    ↓
App.js detects authentication
    ↓
Shows Dashboard component
```

---

## State Management

### React Hooks-Based State Management

The application uses React Hooks for state management without external libraries like Redux.

#### App.js State
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(false);  // Auth status
const [loading, setLoading] = useState(true);                   // Initial load state
```

#### Dashboard.js State
```javascript
const [user, setUser] = useState(null);                          // User profile data
const [songs, setSongs] = useState([]);                          // Favorite songs array
const [recommendations, setRecommendations] = useState([]);      // Recommended songs
const [selectedMood, setSelectedMood] = useState(null);          // Currently selected mood
const [loading, setLoading] = useState(true);                    // Dashboard load state
const [creatingPlaylist, setCreatingPlaylist] = useState(false); // Playlist creation state
```

#### LandingPage.js State
- **Stateless Component**: Uses props for callbacks (`onGetStarted`)

### State Update Patterns

**1. Loading Data on Mount**:
```javascript
useEffect(() => {
  async function loadData() {
    setLoading(true);
    try {
      const result = await checkAuthStatus();
      setIsAuthenticated(result.isAuthenticated);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []); // Empty dependency array = run once on mount
```

**2. Updating State from API Responses**:
```javascript
const loadFavoriteSongs = async () => {
  const result = await getFavoriteSongs();
  if (result.success) {
    setSongs(result.data.favorite_songs || []);
    setRecommendations(result.data.recommendations || []);
  }
};
```

**3. Conditional State Updates**:
```javascript
const handleMoodSelect = async (moodId) => {
  setSelectedMood(moodId);
  setCreatingPlaylist(true);
  
  try {
    const result = await createPlaylist(moodId);
    if (result.success) {
      await loadFavoriteSongs(); // Refresh data
    }
  } finally {
    setCreatingPlaylist(false);
  }
};
```

---

## API Communication

### Why Axios Instead of Fetch?

The application uses **Axios** instead of native `fetch()` for several advantages:

1. **Automatic JSON Transformation**: No need to call `.json()` manually
2. **Interceptors Support**: Can add global request/response interceptors
3. **Better Error Handling**: Automatic error throwing for non-2xx responses
4. **Request Cancellation**: Built-in support for canceling requests
5. **Cookie Handling**: Better cross-origin cookie support with `withCredentials`
6. **Progress Tracking**: Upload/download progress monitoring

### API Module (`src/api/spotify.js`)

All API calls are centralized in this module for maintainability:

#### Authentication Endpoints

**Check Authentication Status**:
```javascript
export const checkAuthStatus = async () => {
  try {
    const res = await api.get("/api/status");
    return {
      isAuthenticated: res.data.authenticated,
      user: {
        display_name: res.data.display_name,
        email: res.data.email,
        user_id: res.data.user_id,
        profile_image: res.data.profile_image
      }
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
};
```

**Logout**:
```javascript
export const logout = async () => {
  try {
    await api.post('/api/logout');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};
```

#### Playlist Endpoints

**Get Favorite Songs**:
```javascript
export const getFavoriteSongs = async () => {
  try {
    const response = await api.get('/me/favorite-songs');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch songs',
    };
  }
};
```

**Create Playlist**:
```javascript
export const createPlaylist = async (mood, playlistName = null) => {
  try {
    const response = await api.post('/me/playlist', {
      mood,
      playlist_name: playlistName,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create playlist',
    };
  }
};
```

**Get Recommendations**:
```javascript
export const getRecommendations = async (limit = 30) => {
  try {
    const response = await api.get('/me/recommendations', {
      params: { limit },  // Query parameters
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch recommendations',
    };
  }
};
```

**Get Genre Analysis**:
```javascript
export const getGenreAnalysis = async () => {
  try {
    const response = await api.get('/me/genre-analysis');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to analyze genres',
    };
  }
};
```

### API Response Pattern

All API functions follow a consistent response pattern:

```javascript
{
  success: boolean,      // Operation success status
  data?: object,         // Response data (if successful)
  error?: string         // Error message (if failed)
}
```

This pattern allows for predictable error handling in components:

```javascript
const result = await createPlaylist(mood);
if (result.success) {
  // Handle success
  alert(`Playlist created! ${result.data.message}`);
} else {
  // Handle error
  alert(`Error: ${result.error}`);
}
```

---

## Routing & Navigation

### Conditional Rendering (Client-Side Routing)

Instead of using React Router, the app uses conditional rendering based on authentication state:

```javascript
// App.js
return (
  <div className="App">
    {isAuthenticated ? (
      <Dashboard />
    ) : (
      <LandingPage onGetStarted={handleGetStarted} />
    )}
  </div>
);
```

**Why this approach?**
- Simpler for small applications with 2 main views
- No additional dependencies
- Authentication-based routing is straightforward

### Navigation Methods

**1. Backend Redirect (OAuth Flow)**:
```javascript
const handleGetStarted = () => {
  // Redirect to Flask backend for Spotify OAuth
  window.location.href = 'http://127.0.0.1:5000/api/login';
};
```

**2. Full Page Reload (After Logout)**:
```javascript
const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    window.location.href = '/';  // Full page reload to reset state
  }
};
```

**3. Component State Change (Internal Navigation)**:
```javascript
// Authentication status change triggers re-render
const checkAuth = async () => {
  const result = await checkAuthStatus();
  setIsAuthenticated(result.isAuthenticated);  // Triggers conditional render
};
```

### Redirect Flow After OAuth

```
User clicks "Get Started"
    ↓
window.location.href = 'http://127.0.0.1:5000/api/login'
    ↓
Backend redirects to Spotify
    ↓
User authorizes on Spotify
    ↓
Spotify redirects to backend /callback
    ↓
Backend processes auth and redirects to 'http://localhost:3000/dashboard'
    ↓
App.js detects URL contains /dashboard
    ↓
checkAuthStatus() returns authenticated: true
    ↓
Dashboard component renders
```

---

## Component Documentation

### 1. App.js (Root Component)

**Purpose**: Main application container that handles authentication logic and conditional rendering.

**State**:
- `isAuthenticated`: Boolean tracking user authentication status
- `loading`: Boolean for initial authentication check

**Key Functions**:
```javascript
// Check authentication on mount
useEffect(() => {
  checkAuth();
}, []);

// Async authentication check
const checkAuth = async () => {
  try {
    const result = await checkAuthStatus();
    setIsAuthenticated(result.isAuthenticated || result.authenticated || false);
  } finally {
    setLoading(false);
  }
};

// Redirect to backend login
const handleGetStarted = () => {
  window.location.href = 'http://127.0.0.1:5000/api/login';
};
```

**Rendering Logic**:
1. Show loading spinner while checking auth
2. Render Dashboard if authenticated
3. Render LandingPage if not authenticated

---

### 2. LandingPage.js

**Purpose**: Marketing page with hero section, features, and call-to-action buttons.

**Props**:
- `onGetStarted`: Function callback for login redirect

**Key Sections**:
- **Header**: Fixed navigation with logo and CTA button
- **Hero**: Main value proposition with animated badge
- **Features**: Grid of 3 key features (Mood Detection, Instant Mixes, Global Discovery)
- **How It Works**: Section with checklist and app preview
- **CTA Section**: Final conversion section
- **Footer**: Links and copyright

**Event Handlers**:
```javascript
const handleLogin = () => {
  if (onGetStarted) {
    onGetStarted();  // Use prop callback
  } else {
    // Fallback direct redirect
    window.location.href = 'http://127.0.0.1:5000/api/login';
  }
};
```

**Design Features**:
- Gradient backgrounds with blur effects
- Animated ping indicator
- Hover effects on cards
- Responsive grid layouts
- Social proof stats (10k+ users, 2M+ songs, 4.9/5 rating)

---

### 3. Dashboard.js

**Purpose**: Main user interface after authentication, displays user profile, favorite songs, and mood selector.

**State Management**:
```javascript
const [user, setUser] = useState(null);                    // User profile
const [songs, setSongs] = useState([]);                    // Favorite songs
const [recommendations, setRecommendations] = useState([]); // Recommendations
const [selectedMood, setSelectedMood] = useState(null);     // Selected mood
const [loading, setLoading] = useState(true);               // Loading state
const [creatingPlaylist, setCreatingPlaylist] = useState(false); // Playlist creation
```

**Data Loading Flow**:
```javascript
useEffect(() => {
  async function loadData() {
    try {
      // 1. Check authentication and get user data
      const authResult = await checkAuthStatus();
      if (authResult.isAuthenticated) {
        setUser(authResult.user);
        
        // 2. Load favorite songs
        await loadFavoriteSongs();
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);
```

**Mood Selection Handler**:
```javascript
const handleMoodSelect = async (moodId) => {
  setSelectedMood(moodId);           // Update selected mood
  setCreatingPlaylist(true);         // Show loading state
  
  try {
    const result = await createPlaylist(moodId);
    if (result.success) {
      alert(`Playlist created! ${result.data.message}`);
      await loadFavoriteSongs();     // Refresh song list
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (err) {
    console.error('Playlist creation error:', err);
    alert('Failed to create playlist');
  } finally {
    setCreatingPlaylist(false);      // Hide loading state
  }
};
```

**Sub-Components**:

#### Sidebar Component
```javascript
const Sidebar = ({ user, onLogout }) => (
  <aside className="...">
    {/* Logo */}
    <div className="p-6 flex items-center gap-3">
      <Music icon /> Moodify
    </div>
    
    {/* Navigation */}
    <nav>
      <button>Dashboard</button>
      <button>Library</button>
    </nav>
    
    {/* User Profile & Logout */}
    {user && (
      <div>
        <p>{user.display_name}</p>
        <p>{user.email}</p>
        <button onClick={onLogout}>Logout</button>
      </div>
    )}
  </aside>
);
```

#### SongCard Component
```javascript
const SongCard = ({ song }) => (
  <div className="group ...">
    {/* Album Art */}
    <img src={song.album_art} alt={song.name} />
    
    {/* Play Button Overlay (on hover) */}
    <div className="... group-hover:opacity-100">
      <Play icon />
    </div>
    
    {/* Song Info */}
    <h3>{song.name}</h3>
    <p>{song.artist}</p>
  </div>
);
```

**Mood Configuration**:
```javascript
const MOODS = [
  { 
    id: 'chill', 
    label: 'Chill', 
    icon: Coffee,
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-200'
  },
  { id: 'energetic', label: 'Energetic', icon: Zap, ... },
  { id: 'focus', label: 'Focus', icon: Briefcase, ... },
  { id: 'sad', label: 'Melancholy', icon: CloudRain, ... },
  { id: 'happy', label: 'Feel Good', icon: Smile, ... },
];
```

---

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- Hot reloading enabled
- Error overlay in browser
- Linting errors displayed in console

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder:
- Minified and optimized
- Filenames include hashes for cache busting
- Ready for deployment

**Build Output**:
```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
└── asset-manifest.json
```

### `npm run eject`
⚠️ **One-way operation** - Exposes all configuration files (webpack, Babel, ESLint).

---

## Environment Variables

Create a `.env` file in the root of the frontend directory:

```bash
# Backend API URL
REACT_APP_API_URL=http://127.0.0.1:5000

# Optional: Environment
REACT_APP_ENV=development
```

**Usage in Code**:
```javascript
const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
```

**Important Notes**:
- All custom environment variables must start with `REACT_APP_`
- Changes require restart of development server
- Never commit `.env` to version control

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: `Access-Control-Allow-Origin` error in console

**Solution**:
```javascript
// Ensure withCredentials is set in config.js
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true,  // Must be true
});
```

Backend must also have CORS enabled:
```python
# Flask backend
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])
```

#### 2. Authentication Not Persisting
**Problem**: User logged out after page refresh

**Solution**:
- Ensure `withCredentials: true` in Axios config
- Backend must set session cookies correctly
- Check browser cookie settings (not blocking third-party cookies)

#### 3. API Calls Returning 401
**Problem**: Unauthorized errors after some time

**Solution**:
- Backend session may have expired
- Implement token refresh logic
- Check backend session timeout settings

#### 4. Backend Connection Refused
**Problem**: `ERR_CONNECTION_REFUSED` error

**Solution**:
- Ensure Flask backend is running on `http://127.0.0.1:5000`
- Check firewall settings
- Verify port 5000 is not in use by another process

#### 5. Styling Not Applied
**Problem**: Tailwind classes not working

**Solution**:
```bash
# Reinstall dependencies
npm install

# Clear cache and restart
rm -rf node_modules/.cache
npm start
```

---

## Deployment

### Production Build

1. **Create production build**:
   ```bash
   npm run build
   ```

2. **Test production build locally**:
   ```bash
   npx serve -s build
   ```

3. **Update environment variables** for production:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

### Deployment Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages
```bash
npm install gh-pages --save-dev
# Add to package.json:
"homepage": "https://username.github.io/moodify"
"predeploy": "npm run build"
"deploy": "gh-pages -d build"
```

---

## Best Practices

### Code Organization
- Keep components small and focused
- Extract reusable logic into custom hooks
- Centralize API calls in `/api` directory
- Use consistent naming conventions

### Error Handling
```javascript
// Always handle API errors gracefully
try {
  const result = await someApiCall();
  if (result.success) {
    // Handle success
  } else {
    // Show user-friendly error
    console.error(result.error);
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

### Performance Optimization
- Use `React.memo()` for components that don't need frequent re-renders
- Implement loading states for better UX
- Lazy load components with `React.lazy()` if needed

### Security
- Never expose API keys in frontend code
- Always use HTTPS in production
- Validate user input before sending to backend
- Use `withCredentials: true` for secure cookie handling

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


