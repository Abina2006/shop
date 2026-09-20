import React, { useState, useEffect } from 'react';
import { sanitizeStoreUrl } from '../utils/urlHelper';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const PLATFORM_THEMES = {
  Amazon: {
    bg: 'from-amber-500/20 via-orange-500/10 to-slate-900',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
    icon: '📦',
    accent: 'text-amber-400',
  },
  Flipkart: {
    bg: 'from-blue-600/20 via-sky-500/10 to-slate-900',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white font-bold',
    icon: '⚡',
    accent: 'text-blue-400',
  },
  Meesho: {
    bg: 'from-pink-600/20 via-rose-500/10 to-slate-900',
    border: 'border-pink-500/40',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    btn: 'bg-pink-600 hover:bg-pink-500 text-white font-bold',
    icon: '🛍️',
    accent: 'text-pink-400',
  },
  Myntra: {
    bg: 'from-rose-600/20 via-red-500/10 to-slate-900',
    border: 'border-rose-500/40',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    btn: 'bg-rose-600 hover:bg-rose-500 text-white font-bold',
    icon: '👗',
    accent: 'text-rose-400',
  },
  Croma: {
    bg: 'from-teal-600/20 via-emerald-500/10 to-slate-900',
    border: 'border-teal-500/40',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    btn: 'bg-teal-600 hover:bg-teal-500 text-white font-bold',
    icon: '🔌',
    accent: 'text-teal-400',
  },
  Ajio: {
    bg: 'from-purple-600/20 via-indigo-500/10 to-slate-900',
    border: 'border-purple-500/40',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white font-bold',
    icon: '✨',
    accent: 'text-purple-400',
  },
};

const PlatformAdvisorCard = ({ product, listings = [] }) => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState('best_value');

  useEffect(() => {
    if (!product && listings.length === 0) return;

    setLoading(true);
    fetch(`${API}/platform-advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product?.id,
        productName: product?.name,
        category: product?.category,
        price: product?.minPrice || listings[0]?.price,
        listings: listings.length > 0 ? listings : product?.listings,
        preference,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAdvice(json.data);
        }
      })
      .catch((err) => console.error('Platform advisor fetch error:', err))
      .finally(() => setLoading(false));
  }, [product, listings, preference]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-pulse">
        <div className="inline-block text-3xl mb-3 animate-spin">🤖</div>
        <h3 className="text-white font-bold text-base">AI Platform Advisor Analyzing...</h3>
        <p className="text-slate-500 text-xs mt-1">
          Evaluating prices, seller ratings, delivery SLAs, and verified store guarantees...
        </p>
      </div>
    );
  }

  if (!advice) return null;

  const platform = advice.recommendedPlatform || 'Amazon';
  const theme = PLATFORM_THEMES[platform] || PLATFORM_THEMES.Amazon;
  const targetListing = listings.find((l) =>
    l.sellerName.toLowerCase().includes(platform.toLowerCase())
  );
  const rawTargetUrl = targetListing?.sellerUrl || listings[0]?.sellerUrl || '#';
  const targetUrl = sanitizeStoreUrl(rawTargetUrl, product?.name, platform);

  return (
    <div
      className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300`}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-2xl shadow-lg">
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                AI Platform Advisor
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                {advice.confidenceScore || 95}% Match
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Recommended: Buy on <span className={theme.accent}>{platform}</span>
            </h2>
          </div>
        </div>

        {/* Preference Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'best_value', label: '💰 Best Value' },
            { id: 'fastest_delivery', label: '⚡ Fastest Delivery' },
            { id: 'highest_rating', label: '⭐ Top Seller' },
          ].map((pref) => (
            <button
              key={pref.id}
              onClick={() => setPreference(pref.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                preference === pref.id
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pref.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rationale Bullet Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(advice.reasons || []).map((reason, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 bg-slate-900/60 border border-slate-800/60 p-3 rounded-2xl"
          >
            <span className="text-sm mt-0.5">✅</span>
            <span className="text-xs text-slate-300 leading-relaxed font-medium">
              {reason}
            </span>
          </div>
        ))}
      </div>

      {/* 4 Decision Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Pillar 1: Best Price */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>🏷️</span> Best Price
          </div>
          <div className="text-xl font-black text-emerald-400">
            ₹{Number(advice.bestPrice || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            Lowest on {advice.bestPriceStore || platform}
            {advice.savingsPercent > 0 && ` (Save ${advice.savingsPercent}%)`}
          </p>
        </div>

        {/* Pillar 2: Best Seller */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>⭐</span> Best Seller
          </div>
          <div className="text-lg font-extrabold text-white truncate">
            {advice.bestSeller || platform}
          </div>
          <p className="text-[11px] text-slate-500">
            {advice.bestSellerRating || 4.8}★ Trust Rating
          </p>
        </div>

        {/* Pillar 3: Fastest Delivery */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>⚡</span> Fastest Delivery
          </div>
          <div className="text-xs font-bold text-slate-200 line-clamp-1">
            {advice.fastestDelivery || '1-2 Days Express'}
          </div>
          <p className="text-[11px] text-slate-500">Verified Dispatch SLA</p>
        </div>

        {/* Pillar 4: Best Offer */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>🏷️</span> Best Offer
          </div>
          <div className="text-xs font-bold text-amber-300 line-clamp-1">
            {advice.bestOffer || 'Card Discounts & No-Cost EMI'}
          </div>
          <p className="text-[11px] text-slate-500">Bank & Exchange Benefits</p>
        </div>
      </div>

      {/* Summary Rationale & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
          💡 <span className="text-slate-200 font-medium">{advice.verdictSummary}</span>
        </p>

        <a
          href={targetUrl}
          target="_blank"
          rel="noreferrer noopener"
          referrerPolicy="no-referrer"
          className={`${theme.btn} px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg whitespace-nowrap cursor-pointer`}
        >
          <span>Buy on {platform}</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
};

export default PlatformAdvisorCard;
