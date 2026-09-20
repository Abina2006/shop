import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectPath = (location.state?.from?.pathname && location.state?.from?.pathname !== '/login')
    ? location.state.from.pathname
    : '/compare';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
    const result = await login(demoEmail, demoPassword);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-3xl shadow-xl shadow-indigo-900/40 mb-3 animate-pulse">
            🛍️
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            ShopWise <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to unlock live price tracking, AI recommendations & multi-store comparisons
          </p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3.5 mb-6 flex items-center gap-2 animate-in fade-in">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. abinaa059@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 mt-2 text-sm active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign In to ShopWise AI 🚀'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
          <span className="block text-[11px] font-bold uppercase text-slate-500 text-center tracking-wider">
            Quick 1-Click Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('vaish@gmail.com', 'vaish')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/40 text-xs font-semibold text-indigo-300 py-2.5 px-3 rounded-xl transition-all shadow-sm"
            >
              <span>⚡</span>
              <span>Login as Vaish</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('abinaa059@gmail.com', 'Abina@2006')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/40 text-xs font-semibold text-purple-300 py-2.5 px-3 rounded-xl transition-all shadow-sm"
            >
              <span>👑</span>
              <span>Login as Abina</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register for Free →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
