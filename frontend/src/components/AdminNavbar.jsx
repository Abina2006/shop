import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-amber-500/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Admin Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">🛍️</span>
              <span className="font-extrabold text-lg bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                ShopWise AI
              </span>
            </Link>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              🛡️ Admin Portal
            </span>
          </div>

          {/* Admin Navigation */}
          <div className="flex items-center space-x-6 text-xs font-semibold">
            <Link to="/admin" className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors">
              <span>⚙️</span> Dashboard Overview
            </Link>

            <Link to="/scrape" className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <span>🕷️</span> Live Scraper Engine
            </Link>

            <Link to="/products" className="bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-indigo-200 border border-slate-700 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5">
              <span>🛒</span> Switch to User Site ↗
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span>{user?.name || 'Admin'}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left block px-4 py-2 text-xs font-medium text-rose-400 hover:bg-slate-700 transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
