import "./App.css";

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900/95 to-gray-800">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-10 animate-float bg-white/20" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 animate-float bg-white/15" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 animate-float bg-white/10" style={{ animationDelay: '4s' }}></div>

        {/* Cyber Grid & Hex Pattern */}
        <div className="cyber-grid absolute inset-0 opacity-20"></div>
        <div className="hex-pattern absolute inset-0 opacity-15"></div>


        {/* Vertical Energy Beams */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`beam-${i}`}
            className="absolute w-px bottom-0"
            style={{
              left: `${20 + i * 20}%`,
              background: `linear-gradient(to top, transparent, rgba(255,255,255,0.2), transparent)`,
              height: '50%',
              opacity: 0.3,
              animation: 'energy-beam 3s ease-in-out infinite',
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}

        {/* Particle Dots */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40 animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>

      <header className="relative p-5 sticky top-0 z-50 border-b border-white/10 bg-gradient-to-br from-black via-gray-900/95 to-gray-800 glass-morphism">
        <div className=" mx-auto flex justify-between items-center relative z-10">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pulse-ring"></div>
              <div className="absolute inset-0 holographic rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-glow"></div>
              <div className="relative p-3 rounded-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white neon-white">Moodify</h1>
          </div>

          {/* Right: Description & Login Button */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-right">
            <button className="px-6 py-2 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
              Login with Spotify
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto p-6 pb-12 z-10">
        <div className="text-center py-20">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-white neon-white tracking-tight">
            Welcome to Moodify
          </h2>
          <p className="text-white/50 text-xl max-w-2xl mx-auto tracking-wide">
            Your personal direct playlist generator
          </p>

          {/* CTA Button */}
          <div className="mt-16">
            <button className="relative group px-10 py-5 rounded-xl font-bold text-lg text-white holographic transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Initialize System</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
