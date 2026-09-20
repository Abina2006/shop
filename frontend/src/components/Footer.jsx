import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand Column */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
              <span className="font-extrabold text-lg bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ShopWise AI
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              India's smartest price comparison platform. Powered by AI to find you the best deals across all major stores.
            </p>
            {/* Store Logos */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['Meesho', 'Flipkart', 'Amazon', 'Croma', 'Myntra'].map(store => (
                <span
                  key={store}
                  className="bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold px-2 py-1 rounded-lg"
                >
                  {store}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: '🏠 Home' },
                { to: '/wishlist', label: '❤️ My Wishlist' },
                { to: '/compare', label: '📊 Compare Products' },
                { to: '/scrape', label: '⚡ Compare URL' },
                { to: '/alerts', label: '🔔 Price Alerts' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/login', label: '🔐 Sign In' },
                { to: '/register', label: '✨ Register Free' },
                { to: '/profile', label: '👤 My Profile' },
                { to: '/admin', label: '⚙️ Admin Panel' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2.5">
              {[
                '🤖 Gemini AI Summaries',
                '📈 30-Day Price History',
                '🔔 Instant Price Alerts',
                '⚡ Real-time Sync',
                '🛒 Multi-Store Comparison',
              ].map(f => (
                <li key={f} className="text-sm text-slate-500">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} ShopWise AI. All rights reserved. Built with ❤️ for Indian shoppers.
          </p>
          <p className="text-xs text-slate-600">
            Prices are fetched from public listings and may vary. ShopWise AI is not affiliated with any store.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
