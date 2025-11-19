import { useState, useEffect } from "react";
import { Play, Coffee, Zap, Briefcase, CloudRain, Smile, Music, Layout, LogOut, Loader } from "lucide-react";
import { checkAuthStatus, getFavoriteSongs, createPlaylist, logout } from "../api/spotify";

const Sidebar = ({ user, onLogout }) => (
  <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
    <div className="p-6 flex items-center gap-3 border-b border-gray-100">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <Music className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-xl text-gray-800">Moodify</span>
    </div>
    
    <nav className="flex-1 p-4 space-y-1">
      <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg font-medium">
        <Layout className="w-5 h-5" /> Dashboard
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
        <Music className="w-5 h-5" /> Library
      </button>
    </nav>
    
    {user && (
      <div className="p-4 border-t border-gray-100">
        <div className="px-4 py-3 mb-2 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{user.display_name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    )}
  </aside>
);

const SongCard = ({ song }) => (
  <div className="group bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer">
    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
      <img 
        src={song.album_art || 'https://via.placeholder.com/300'} 
        alt={song.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>
    </div>
    <div className="px-1">
      <h3 className="font-semibold text-gray-900 truncate">{song.name}</h3>
      <p className="text-sm text-gray-500">{song.artist}</p>
    </div>
  </div>
);

const MOODS = [
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'bg-teal-50 text-teal-600', border: 'border-teal-200', hover: 'hover:border-teal-400' },
  { id: 'energetic', label: 'Energetic', icon: Zap, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200', hover: 'hover:border-yellow-400' },
  { id: 'focus', label: 'Focus', icon: Briefcase, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-400' },
  { id: 'sad', label: 'Melancholy', icon: CloudRain, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200', hover: 'hover:border-indigo-400' },
  { id: 'happy', label: 'Feel Good', icon: Smile, color: 'bg-pink-50 text-pink-600', border: 'border-pink-200', hover: 'hover:border-pink-400' },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  // Load user data and songs on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Get user info
        const authResult = await checkAuthStatus();
        if (authResult.isAuthenticated || authResult.authenticated) {
          setUser(authResult.user);
          
          // Load favorite songs
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

  // Load favorite songs
  const loadFavoriteSongs = async () => {
    const result = await getFavoriteSongs();
    if (result.success) {
      setSongs(result.data.favorite_songs || []);
      setRecommendations(result.data.recommendations || []);
    } else {
      console.error('Failed to load songs:', result.error);
    }
  };

  // Handle mood selection and playlist creation
  const handleMoodSelect = async (moodId) => {
    setSelectedMood(moodId);
    setCreatingPlaylist(true);
    
    try {
      const result = await createPlaylist(moodId);
      if (result.success) {
        alert(`Playlist created! ${result.data.message}`);
        await loadFavoriteSongs();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Playlist creation error:', err);
      alert('Failed to create playlist');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Reload the page to go back to landing page
      window.location.href = '/';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, <span className="text-indigo-600">{user?.display_name || "User"}</span>
            </h1>
            <p className="text-gray-500">Ready to find the perfect soundtrack for your day?</p>
          </div>

          {/* Mood Selection Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Smile className="w-5 h-5 text-indigo-500" />
              How are you feeling?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    disabled={creatingPlaylist}
                    className={`
                      relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                      ${mood.color}
                      ${isSelected ? `border-current shadow-md scale-105` : `${mood.border} ${mood.hover} shadow-sm hover:-translate-y-1`}
                      ${creatingPlaylist ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <mood.icon className={`w-8 h-8 mb-3 ${creatingPlaylist && isSelected ? 'animate-bounce' : ''}`} />
                    <span className="font-semibold text-sm">{mood.label}</span>
                    {creatingPlaylist && isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                        <Loader className="w-6 h-6 animate-spin" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Your Favorite Songs */}
          {songs.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Music className="w-5 h-5 text-indigo-500" />
                Your Favorite Songs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {songs.slice(0, 8).map((song, index) => (
                  <SongCard key={index} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.slice(0, 8).map((song, index) => (
                  <SongCard key={index} song={song} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}