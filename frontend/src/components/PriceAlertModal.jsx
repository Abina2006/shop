import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function PriceAlertModal({ product, onClose }) {
  const { user } = useAuth();
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const listings = product.listings || [];
  const prices = listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const suggestedTarget = Math.round(lowestPrice * 0.9);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetPrice) {
      setErrorMsg('Please enter a target price.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API}/products/${product.id}/price-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPrice, email })
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(`✅ Alert activated! We will notify ${email || 'you'} when ${product.name} drops to ₹${targetPrice}.`);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setErrorMsg(json.message || 'Failed to activate alert.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 space-y-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔔</span>
            <div>
              <h2 className="text-base font-bold text-white">Set Price Drop Alert</h2>
              <p className="text-[11px] text-slate-400">Get notified instantly when the price drops</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Product preview */}
        <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white truncate max-w-[220px]">{product.name}</h3>
            <span className="text-[11px] text-slate-400">Current Best: <strong className="text-emerald-400">₹{lowestPrice.toLocaleString('en-IN')}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setTargetPrice(suggestedTarget)}
            className="text-[10px] bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-lg hover:bg-indigo-600/40 transition-all font-semibold"
          >
            Set 10% Off (₹{suggestedTarget})
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 text-center leading-relaxed">
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Price (₹)
              </label>
              <input
                type="number"
                placeholder={`e.g. ${suggestedTarget}`}
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value)}
                className="w-full bg-slate-800 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notification Email
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{loading ? "Activating..." : "🔔 Activate Price Alert"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
