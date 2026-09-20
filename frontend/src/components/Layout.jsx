import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrollY, setScrollY] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setShowTop(y > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollPercent = Math.min(100, Math.round(
    (scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100
  ));

  return (
    <div className="flex flex-col min-h-screen bg-slate-955">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-slate-800/50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-100"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      <Navbar />
      <main className={`flex-1 w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>
      <Footer />

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl shadow-indigo-900/50 flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 border border-indigo-400/30"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Layout;
