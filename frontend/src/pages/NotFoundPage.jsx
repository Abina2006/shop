import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 number */}
        <div className="text-[120px] sm:text-[160px] font-extrabold leading-none bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent select-none mb-2">
          404
        </div>

        <div className="text-4xl mb-4">🛍️</div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Looks like this page wandered off to find a better deal. Let's get you back to comparing prices!
        </p>

        {/* Quick Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
          >
            🏠 Go to Homepage
          </Link>
          <Link
            to="/compare"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-2xl transition-all text-sm"
          >
            📊 Compare Products
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition-all text-sm"
          >
            ← Go Back
          </button>
        </div>

        {/* Popular links */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { to: '/wishlist', label: '❤️ Wishlist' },
            { to: '/alerts', label: '🔔 Price Alerts' },
            { to: '/scrape', label: '⚡ Compare URL' },
            { to: '/login', label: '🔐 Sign In' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 px-3 py-1.5 rounded-full transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
