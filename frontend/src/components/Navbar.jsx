import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to homepage with search query — triggers catalog filter
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group" onClick={() => setMobileOpen(false)}>
              <span className="text-2xl transition-transform group-hover:scale-110">🛍️</span>
              <span className="font-extrabold text-lg sm:text-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                ShopWise AI
              </span>
            </Link>
          </div>

          {/* Search Bar — desktop */}
          <div className="flex-1 max-w-sm hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products & deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors">🔍</button>
            </form>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/compare"
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/compare') || isActive('/') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
            >
              <span>📊</span> Compare
            </Link>
            <Link
              to="/catalog"
              className={`text-sm font-medium transition-colors ${isActive('/catalog') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
            >
              🛍️ All Products
            </Link>
            <Link
              to="/wishlist"
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/wishlist') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
            >
              <span>❤️</span> Wishlist
            </Link>
            <Link
              to="/scrape"
              className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold"
            >
              <span>⚡</span> Compare URL
            </Link>
            {isAuthenticated && (
              <Link
                to="/alerts"
                className={`text-sm font-medium transition-colors ${isActive('/alerts') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
              >
                🔔 Alerts
              </Link>
            )}
          </div>

          {/* Auth Buttons — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="h-5 w-px bg-slate-700/80" />
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors text-sm focus:outline-none"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs uppercase text-white shadow-sm">
                    {user?.name?.charAt(0)}
                  </span>
                  <span className="hidden md:inline font-medium text-slate-200 text-xs">{user?.name}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in duration-150">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      ❤️ My Wishlist
                    </Link>
                    <Link
                      to="/alerts"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      🔔 Price Alerts
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-slate-700/60 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left block px-4 py-2 text-xs font-medium text-rose-400 hover:bg-slate-700/60 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products & deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="absolute left-3 top-3 text-slate-400">🔍</button>
          </form>

          {/* Mobile Nav Links */}
          <div className="space-y-1 pt-1">
            {[
              { to: '/compare', label: '📊 Compare Products' },
              { to: '/catalog', label: '🛍️ All Products' },
              { to: '/wishlist', label: '❤️ Wishlist' },
              { to: '/scrape', label: '⚡ Compare URL' },
              ...(isAuthenticated ? [
                { to: '/alerts', label: '🔔 Price Alerts' },
                { to: '/profile', label: '👤 My Profile' },
              ] : []),
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(to) ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth */}
          <div className="border-t border-slate-800 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                    {user?.name?.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{user?.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="text-xs text-rose-400 font-semibold px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
