import React, { useState, useEffect } from 'react';

function App() {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // Animated gradient background
  useEffect(() => {
    const interval = setInterval(() => {
      document.documentElement.style.setProperty('--gradient-rotation', `${Date.now() / 100}deg`);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Predefined moods with emojis and colors
  const moods = [
    { name: 'Happy', emoji: '😊', color: 'from-yellow-400 via-orange-400 to-pink-400', glow: 'shadow-yellow-500/50' },
    { name: 'Sad', emoji: '😢', color: 'from-blue-400 via-indigo-500 to-purple-600', glow: 'shadow-blue-500/50' },
    { name: 'Energetic', emoji: '⚡', color: 'from-red-400 via-pink-500 to-purple-500', glow: 'shadow-red-500/50' },
    { name: 'Relaxed', emoji: '😌', color: 'from-green-400 via-teal-500 to-cyan-500', glow: 'shadow-green-500/50' },
    { name: 'Romantic', emoji: '❤️', color: 'from-pink-400 via-red-400 to-rose-500', glow: 'shadow-pink-500/50' },
    { name: 'Focused', emoji: '🎯', color: 'from-purple-400 via-indigo-500 to-blue-500', glow: 'shadow-purple-500/50' },
    { name: 'Party', emoji: '🎉', color: 'from-purple-500 via-pink-500 to-red-500', glow: 'shadow-purple-500/50' },
    { name: 'Melancholic', emoji: '🌧️', color: 'from-gray-400 via-slate-500 to-gray-600', glow: 'shadow-gray-500/50' }
  ];

  // ============================================
  // BACKEND INTEGRATION POINT #1
  // ============================================
  const fetchPlaylistFromAPI = async (mood) => {
    setLoading(true);
    
    try {
      // TODO: Replace with your actual Flask API endpoint
      // const response = await fetch(`http://localhost:5000/api/playlist/${mood}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });
      // const data = await response.json();
      // setPlaylist(data.tracks);
      
      // TEMPORARY: Sample data with more realistic track names
      setTimeout(() => {
        const sampleTracks = [
          { 
            id: 1, 
            name: 'Blinding Lights', 
            artist: 'The Weeknd', 
            album: 'After Hours', 
            cover: 'https://picsum.photos/400/400?random=1',
            preview_url: '#',
            duration: '3:20'
          },
          { 
            id: 2, 
            name: 'Levitating', 
            artist: 'Dua Lipa', 
            album: 'Future Nostalgia', 
            cover: 'https://picsum.photos/400/400?random=2',
            preview_url: '#',
            duration: '3:23'
          },
          { 
            id: 3, 
            name: 'Heat Waves', 
            artist: 'Glass Animals', 
            album: 'Dreamland', 
            cover: 'https://picsum.photos/400/400?random=3',
            preview_url: '#',
            duration: '3:58'
          },
          { 
            id: 4, 
            name: 'Stay', 
            artist: 'The Kid LAROI & Justin Bieber', 
            album: 'Stay', 
            cover: 'https://picsum.photos/400/400?random=4',
            preview_url: '#',
            duration: '2:21'
          },
          { 
            id: 5, 
            name: 'Good 4 U', 
            artist: 'Olivia Rodrigo', 
            album: 'SOUR', 
            cover: 'https://picsum.photos/400/400?random=5',
            preview_url: '#',
            duration: '2:58'
          },
          { 
            id: 6, 
            name: 'Shivers', 
            artist: 'Ed Sheeran', 
            album: '=', 
            cover: 'https://picsum.photos/400/400?random=6',
            preview_url: '#',
            duration: '3:27'
          },
          { 
            id: 7, 
            name: 'INDUSTRY BABY', 
            artist: 'Lil Nas X & Jack Harlow', 
            album: 'MONTERO', 
            cover: 'https://picsum.photos/400/400?random=7',
            preview_url: '#',
            duration: '3:32'
          },
          { 
            id: 8, 
            name: 'Peaches', 
            artist: 'Justin Bieber', 
            album: 'Justice', 
            cover: 'https://picsum.photos/400/400?random=8',
            preview_url: '#',
            duration: '3:18'
          },
        ];
        setPlaylist(sampleTracks);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching playlist:', error);
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCustomMood('');
    fetchPlaylistFromAPI(mood);
  };

  const handleCustomMoodSubmit = (e) => {
    e.preventDefault();
    if (customMood.trim()) {
      setSelectedMood(customMood);
      fetchPlaylistFromAPI(customMood);
    }
  };

  // ============================================
  // BACKEND INTEGRATION POINT #2
  // ============================================
  const handlePlayPreview = (track) => {
    // TODO: Implement actual audio playback
    setCurrentlyPlaying(currentlyPlaying === track.id ? null : track.id);
    console.log('Playing preview for:', track.name);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleRefreshPlaylist = () => {
    if (selectedMood) {
      fetchPlaylistFromAPI(selectedMood);
    }
  };

  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-slide-up { animation: slideInUp 0.6s ease-out forwards; }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      .animate-gradient { 
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
      }
      .glass-morphism {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .dark-glass-morphism {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .hover-lift {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-lift:hover {
        transform: translateY(-8px) scale(1.02);
      }
      .music-bar {
        animation: music-wave 1.2s ease-in-out infinite;
      }
      @keyframes music-wave {
        0%, 100% { height: 4px; }
        50% { height: 20px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900' 
        : 'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100'
    }`}>
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float ${
          darkMode ? 'bg-purple-600' : 'bg-purple-400'
        }`} style={{ animationDelay: '0s' }}></div>
        <div className={`absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float ${
          darkMode ? 'bg-pink-600' : 'bg-pink-400'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float ${
          darkMode ? 'bg-blue-600' : 'bg-blue-400'
        }`} style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header with Glassmorphism */}
      <header className={`relative p-6 ${
        darkMode ? 'dark-glass-morphism' : 'glass-morphism'
      } sticky top-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Animated Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl transform transition-transform group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            {/* App Name with Gradient */}
            <div>
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Moodify
                </span>
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Music for every mood
              </p>
            </div>
          </div>
          
          {/* Theme Toggle with Animation */}
          <button
            onClick={toggleTheme}
            className={`relative p-3 rounded-2xl transition-all duration-500 hover:scale-110 ${
              darkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-orange-300/30'
            }`}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                darkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
              }`}>
                <span className="text-xl">🌙</span>
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                darkMode ? 'opacity-0 -rotate-180' : 'opacity-100 rotate-0'
              }`}>
                <span className="text-xl">☀️</span>
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto p-6 pb-12">
        
        {/* Mood Selection Section */}
        <section className="mb-16 mt-12">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What's your vibe today?
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose your mood and let AI create the perfect soundtrack
            </p>
          </div>
          
          {/* Mood Buttons Grid with Stagger Animation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
            {moods.map((mood, index) => (
              <button
                key={mood.name}
                onClick={() => handleMoodSelect(mood.name)}
                className={`group relative p-8 rounded-3xl transition-all duration-500 hover-lift ${
                  selectedMood === mood.name
                    ? `bg-gradient-to-br ${mood.color} shadow-2xl ${mood.glow} scale-105`
                    : darkMode 
                      ? 'dark-glass-morphism hover:shadow-2xl hover:shadow-purple-500/20' 
                      : 'glass-morphism hover:shadow-2xl hover:shadow-purple-300/30'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Glow Effect */}
                {selectedMood === mood.name && (
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${mood.color} blur-xl opacity-50 -z-10`}></div>
                )}
                
                <div className="relative">
                  <div className="text-5xl mb-3 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {mood.emoji}
                  </div>
                  <div className={`font-bold text-lg ${
                    selectedMood === mood.name ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {mood.name}
                  </div>
                  {selectedMood === mood.name && (
                    <div className="absolute -top-2 -right-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Mood Input with Floating Animation */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleCustomMoodSubmit} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              <div className="relative flex gap-3">
                <input
                  type="text"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  placeholder="Or describe your mood in your own words..."
                  className={`flex-1 px-6 py-4 rounded-2xl transition-all duration-300 ${
                    darkMode 
                      ? 'dark-glass-morphism text-white placeholder-gray-400 focus:shadow-2xl focus:shadow-purple-500/20' 
                      : 'glass-morphism text-gray-900 placeholder-gray-600 focus:shadow-2xl focus:shadow-purple-300/20'
                  } border-0 focus:outline-none`}
                />
                <button
                  type="submit"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Generate
                    <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Playlist Display Section */}
        {(loading || playlist.length > 0) && (
          <section className="animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedMood ? `Your ${selectedMood} Playlist` : 'Your Playlist'}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                  <span>AI-curated tracks just for you</span>
                  <span className="flex gap-1">
                    <span className="w-1 h-4 bg-purple-500 rounded-full music-bar"></span>
                    <span className="w-1 h-4 bg-pink-500 rounded-full music-bar" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 h-4 bg-purple-500 rounded-full music-bar" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                </p>
              </div>
              {playlist.length > 0 && (
                <button
                  onClick={handleRefreshPlaylist}
                  className={`group px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'dark-glass-morphism text-gray-200 hover:shadow-xl hover:shadow-purple-500/20' 
                      : 'glass-morphism text-gray-700 hover:shadow-xl hover:shadow-purple-300/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </span>
                </button>
              )}
            </div>
            
            {/* Loading State with Skeleton Cards */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div 
                    key={n} 
                    className={`rounded-3xl overflow-hidden ${
                      darkMode ? 'dark-glass-morphism' : 'glass-morphism'
                    }`}
                    style={{
                      animationDelay: `${n * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    <div className={`h-64 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-300/50'} animate-pulse`}></div>
                    <div className="p-5">
                      <div className={`h-5 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full mb-3 animate-pulse`}></div>
                      <div className={`h-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full w-3/4 animate-pulse`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Track Cards Grid with Hover Effects */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlist.map((track, index) => (
                  <div
                    key={track.id}
                    onMouseEnter={() => setHoveredTrack(track.id)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover-lift ${
                      darkMode 
                        ? 'dark-glass-morphism shadow-xl shadow-black/20' 
                        : 'glass-morphism shadow-xl shadow-gray-300/50'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Album Cover */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={track.cover}
                        alt={track.album}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x400/9333EA/fff?text=${track.name.charAt(0)}`;
                        }}
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Play Button with Ripple Effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => handlePlayPreview(track)}
                          className={`relative bg-white/95 backdrop-blur-sm rounded-full p-5 transform transition-all duration-300 ${
                            hoveredTrack === track.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          } hover:bg-white hover:scale-110`}
                        >
                          {currentlyPlaying === track.id ? (
                            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                          {/* Ripple Animation */}
                          {currentlyPlaying === track.id && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-30"></span>
                          )}
                        </button>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-black/50 text-white' : 'bg-white/70 text-gray-900'
                        } backdrop-blur-sm`}>
                          {track.duration || '3:30'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Track Information */}
                    <div className="relative p-5">
                      <h4 className={`font-bold text-lg mb-2 truncate transition-colors duration-300 ${
                        darkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'
                      }`} title={track.name}>
                        {track.name}
                      </h4>
                      <p className={`text-sm mb-3 truncate ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} title={track.artist}>
                        {track.artist}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`} title={track.album}>
                          {track.album}
                        </p>
                        {/* Playing Indicator */}
                        {currentlyPlaying === track.id && (
                          <div className="flex gap-1">
                            <span className="w-1 h-4 bg-purple-500 rounded-full music-bar"></span>
                            <span className="w-1 h-4 bg-pink-500 rounded-full music-bar" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1 h-4 bg-purple-500 rounded-full music-bar" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Empty State with Animation */}
        {!loading && playlist.length === 0 && !selectedMood && (
          <div className="text-center py-20 animate-slide-up">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
              <div className="relative text-8xl mb-6 animate-float">🎵</div>
            </div>
            <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Let's find your perfect soundtrack
            </h3>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Select a mood above or describe how you're feeling to discover music that matches your vibe
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;