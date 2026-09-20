import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { name: 'All', icon: '🌟' },
  { name: 'Mobiles & Tablets', icon: '📱' },
  { name: 'Laptops & Computers', icon: '💻' },
  { name: 'Electronics & Accessories', icon: '🎧' },
  { name: 'Fashion & Clothing', icon: '👕' },
  { name: 'Shoes & Footwear', icon: '👟' },
  { name: 'Beauty & Personal Care', icon: '💄' },
  { name: 'Home & Kitchen', icon: '🏠' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Toys & Baby Products', icon: '🧸' },
  { name: 'Books & Stationery', icon: '📚' },
  { name: 'Sports & Fitness', icon: '🏋️' },
  { name: 'Grocery & Daily Essentials', icon: '🛒' },
  { name: 'Jewellery & Accessories', icon: '💍' },
  { name: 'Automotive', icon: '🚗' },
  { name: 'Pet Supplies', icon: '🐶' },
  { name: 'Tools & Home Improvement', icon: '🔧' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'TV & Appliances', icon: '📺' },
  { name: 'Travel & Luggage', icon: '🧳' },
  { name: 'Gifts & Others', icon: '🎁' },
];


export default function AiBudgetAdvisorWidget() {
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleFindRecommendation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API}/products/budget-advisor?category=${encodeURIComponent(category)}&budget=${budget}`);
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-indigo-500/30">
              <span>🤖</span> AI Product Advisor & Smart Budget Matcher
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Find the Best Product Within Your Budget
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Our Gemini AI analyses category value, platform discounts, and delivery speeds to pick your best purchase.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFindRecommendation} className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {CATEGORIES.map(c => (
                <option key={c.name} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Max Budget (₹{Number(budget).toLocaleString('en-IN')})
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="200"
                max="150000"
                step="200"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-24 bg-slate-800/90 border border-slate-700 text-white text-xs font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500 text-center"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-indigo-700/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>AI Analyzing Deals...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Find Best Deal</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Card */}
        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {result && result.topPick ? (
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                {/* AI Verdict Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                      AI Top Recommendation
                    </span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    {result.totalMatching} options under budget
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-5 items-center">
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 md:col-span-2">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700 flex items-center justify-center">
                      {result.topPick.imageUrl ? (
                        <img
                          src={result.topPick.imageUrl}
                          alt={result.topPick.name}
                          className="w-full h-full object-cover"
                          onError={e => e.target.style.display = 'none'}
                        />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {result.topPick.category} • {result.topPick.brand}
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-1 leading-snug">
                        {result.topPick.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 italic">
                        "{result.aiVerdict}"
                      </p>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Lowest Market Deal</span>
                      <div className="text-2xl font-extrabold text-emerald-400 my-0.5">
                        ₹{Number(result.topPick.lowestPrice).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-300">
                        Buy from <strong>{result.topPick.winningStore}</strong>
                      </span>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 flex flex-col gap-0.5">
                      <span>🚚 {result.topPick.deliveryTime}</span>
                      <span>🎁 {result.topPick.offers}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {result.topPick.winningUrl && (
                        <a
                          href={result.topPick.winningUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg transition-all"
                        >
                          Buy Store ↗
                        </a>
                      )}
                      <Link
                        to={`/compare?ids=${result.topPick.id}`}
                        className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 py-1.5 px-3 rounded-lg border border-slate-700 transition-all"
                      >
                        Compare
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Runner Up Preview */}
                {result.runnerUp && (
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-400">
                      🥈 <strong>Runner Up Pick:</strong> {result.runnerUp.name}
                    </span>
                    <span className="font-bold text-emerald-400">
                      ₹{Number(result.runnerUp.lowestPrice).toLocaleString('en-IN')} on {result.runnerUp.winningStore}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                <span>⚠️ No products found within ₹{Number(budget).toLocaleString('en-IN')} for {category}. Try increasing your budget limit.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
