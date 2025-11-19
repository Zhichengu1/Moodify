import React from 'react';
import { Music, Play, Layout, Shield, Zap, Heart, Smile, Globe, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  // Single login function - use the prop passed from App.js
// Inside LandingPage component
const handleLogin = () => {
  if (onGetStarted) {
    onGetStarted(); 
  } else {
    window.location.href = 'http://127.0.0.1:5000/api/login';  // Changed
  }
};

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* --- Header --- */}
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Moodify
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Reviews</a>
          </nav>

          {/* CTA Button */}
          <button 
            onClick={handleLogin}
            className="px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 is live! Experience mood-based listening.
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white">
            Music that matches <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              your exact vibe.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop scrolling through endless playlists. Moodify analyzes your mood and instantly curates the perfect soundtrack for your life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> Start Listening Free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white text-lg font-bold rounded-full hover:bg-gray-700 transition-all border border-gray-700">
              View Demo
            </button>
          </div>
          
          {/* Stats/Social Proof */}
          <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-500">
            <div className="flex flex-col items-center">
               <span className="text-2xl font-bold text-white">10k+</span>
               <span className="text-sm">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-2xl font-bold text-white">2M+</span>
               <span className="text-sm">Songs Curated</span>
            </div>
             <div className="flex flex-col items-center">
               <span className="text-2xl font-bold text-white">4.9/5</span>
               <span className="text-sm">App Store Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Moodify?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We combine advanced AI with simple, intuitive design to give you the best listening experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-950 rounded-2xl border border-gray-800 hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Smile className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mood Detection</h3>
              <p className="text-gray-400 leading-relaxed">
                Select how you feel or let our AI analyze your listening history to pick the perfect genre.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-950 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                <Zap className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Mixes</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate fresh playlists in seconds. No more spending hours crafting the perfect queue.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-950 rounded-2xl border border-gray-800 hover:border-teal-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                <Globe className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Discovery</h3>
              <p className="text-gray-400 leading-relaxed">
                Find hidden gems from around the world that match your taste profile perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- How it Works / Preview --- */}
      <section id="how-it-works" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
             <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Your personal DJ, <br />
              available 24/7.
             </h2>
             <p className="text-lg text-gray-400">
               Moodify isn't just a music player. It's an intelligent companion that understands context. Whether you're studying, working out, or winding down, we have the mix for you.
             </p>
             
             <div className="space-y-4">
               {['Smart playlist generation based on activities', 'Seamless Spotify integration', 'Daily curated mood mixes'].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                   <span className="text-gray-300">{item}</span>
                 </div>
               ))}
             </div>

             <button className="text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300 transition-colors">
               Learn more about our tech <ArrowRight className="w-4 h-4" />
             </button>
          </div>

          <div className="flex-1 relative">
             {/* Abstract "App Preview" Visual */}
             <div className="relative z-10 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-all duration-500">
               <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"/>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                   <div className="w-3 h-3 rounded-full bg-green-500"/>
                 </div>
                 <div className="text-xs text-gray-500 font-mono">Dashboard</div>
               </div>
               
               <div className="space-y-4">
                 <div className="h-32 bg-gray-800 rounded-xl animate-pulse w-full" />
                 <div className="flex gap-4">
                   <div className="h-24 bg-gray-800 rounded-xl flex-1" />
                   <div className="h-24 bg-gray-800 rounded-xl flex-1" />
                 </div>
                 <div className="space-y-2 pt-2">
                   <div className="h-4 bg-gray-800 rounded w-3/4" />
                   <div className="h-4 bg-gray-800 rounded w-1/2" />
                 </div>
               </div>

               {/* Floating Badge */}
               <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl shadow-lg flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-lg">
                   <Music className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <div className="text-white text-sm font-bold">Now Playing</div>
                   <div className="text-white/80 text-xs">Chill Lo-Fi Beats</div>
                 </div>
               </div>
             </div>
             
             {/* Decorative Backdrop */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/20 blur-3xl -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to find your rhythm?</h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of music lovers who have transformed their daily listening habits with Moodify.
            </p>
            <button 
              onClick={handleLogin}
              className="px-10 py-4 bg-white text-indigo-900 text-lg font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-950 border-t border-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <Music className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-gray-100 text-xl">Moodify</span>
          </div>
          
          <div className="text-gray-500 text-sm">
            © 2024 Moodify Inc. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;