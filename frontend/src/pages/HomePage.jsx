import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductVisual } from '../utils/productImages';
import { sanitizeStoreUrl } from '../utils/urlHelper';
import PriceAdvisorModal from '../components/PriceAdvisorModal';
import PriceAlertModal from '../components/PriceAlertModal';
import AiBudgetAdvisorWidget from '../components/AiBudgetAdvisorWidget';
import PriceVerificationBadge, { PriceDisclaimerBar } from '../components/PriceVerificationBadge';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/* ─── Animated counter helper ─── */
function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const tick = () => {
          start += step;
          if (start >= end) { setCount(end); return; }
          setCount(Math.floor(start));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating orb background ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute bottom-[-5%] left-[30%] w-[350px] h-[350px] rounded-full bg-blue-600/8 blur-[100px] animate-pulse delay-500" />
    </div>
  );
}

const CATEGORY_EMOJI = {
  'Mobiles & Tablets': '📱',
  'Laptops & Computers': '💻',
  'Electronics & Accessories': '🎧',
  'Fashion & Clothing': '👕',
  'Shoes & Footwear': '👟',
  'Beauty & Personal Care': '💄',
  'Home & Kitchen': '🏠',
  'Furniture': '🪑',
  'Toys & Baby Products': '🧸',
  'Books & Stationery': '📚',
  'Sports & Fitness': '🏋️',
  'Grocery & Daily Essentials': '🛒',
  'Jewellery & Accessories': '💍',
  'Automotive': '🚗',
  'Pet Supplies': '🐶',
  'Tools & Home Improvement': '🔧',
  'Gaming': '🎮',
  'TV & Appliances': '📺',
  'Travel & Luggage': '🧳',
  'Gifts & Others': '🎁',
  'General': '🛍️'
};


function TickerBanner({ products = [] }) {
  // Build ticker items dynamically from live DB prices
  const items = products.slice(0, 12).map(p => {
    const cheapest = (p.listings || []).reduce((a, b) => (parseFloat(a.price) <= parseFloat(b.price) ? a : b), p.listings?.[0] || {});
    const emoji = CATEGORY_EMOJI[p.category] || '🛍️';
    const price = cheapest.price ? `₹${Number(cheapest.price).toLocaleString('en-IN')}` : null;
    const store = cheapest.sellerName || '';
    if (!price) return null;
    return `${emoji} ${p.name.split(' ').slice(0, 4).join(' ')} — ${price} on ${store}`;
  }).filter(Boolean);

  const display = items.length > 0 ? items : ['🔥 Live market prices from Meesho, Flipkart, Amazon & more — refreshed every 4 hours'];

  return (
    <div className="relative bg-gradient-to-r from-indigo-900/80 via-slate-900/90 to-indigo-900/80 border-y border-indigo-500/20 overflow-hidden py-2.5">
      <div className="flex gap-0 animate-[ticker_35s_linear_infinite] whitespace-nowrap">
        {[...display, ...display].map((d, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-8 text-xs font-medium text-slate-300">
            {d}
            <span className="text-indigo-500/60 text-base">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-900/20 group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StarRating({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-300' : 'text-slate-600'}`}>
          {i < full ? '★' : i === full && half ? '⭐' : '☆'}
        </span>
      ))}
      <span className="text-xs text-slate-400 ml-1 font-semibold">{Number(rating || 0).toFixed(1)}</span>
    </span>
  );
}

function ProductCard({ product, onPriceSynced, onOpenAdvisor, onOpenAlert }) {
  const { user } = useAuth();
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [customListings, setCustomListings] = useState(null);

  const visual = getProductVisual(product);
  const listings = customListings || product.listings || [];
  const primaryListing = listings[0] || {};
  const prices = listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : (parseFloat(primaryListing.price) || 0);
  const highestPrice = prices.length > 0 ? Math.max(...prices) : lowestPrice;
  const savings = highestPrice > lowestPrice ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100) : 0;
  const hasStaleData = listings.some(l => l.isStale);
  const latestUpdate = listings.reduce((latest, l) => {
    if (!l.lastUpdated) return latest;
    return !latest || new Date(l.lastUpdated) > new Date(latest) ? l.lastUpdated : latest;
  }, null);

  useEffect(() => {
    const storageKey = `wishlist_${user?.id || 'guest'}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const list = JSON.parse(stored);
        setIsWishlisted(list.some(p => p.id === product.id));
      } catch {}
    }
  }, [product.id, user]);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    const storageKey = `wishlist_${user?.id || 'guest'}`;
    const stored = localStorage.getItem(storageKey);
    let list = stored ? JSON.parse(stored) : [];
    if (nextState) {
      if (!list.some(p => p.id === product.id)) list.push(product);
    } else {
      list = list.filter(p => p.id !== product.id);
    }
    localStorage.setItem(storageKey, JSON.stringify(list));

    try {
      if (nextState) {
        await fetch(`${API}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, userId: user?.id })
        });
      } else {
        await fetch(`${API}/wishlist/${product.id}?userId=${user?.id || ''}`, {
          method: 'DELETE'
        });
      }
    } catch {}
  };

  // Sync real-time live market prices on-demand
  const handleSyncLivePrice = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setSyncError(false);
    try {
      const res = await fetch(`${API}/products/${product.id}/sync-live-price`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data?.listings) {
        setCustomListings(json.data.listings);
        setSyncSuccess(true);
        if (onPriceSynced) onPriceSynced(product.id, json.data.listings);
        setTimeout(() => setSyncSuccess(false), 4000);
      } else {
        setSyncError(true);
        setTimeout(() => setSyncError(false), 5000);
      }
    } catch {
      setSyncError(true);
      setTimeout(() => setSyncError(false), 5000);
    }
    setIsSyncing(false);
  };

  const fetchAISummary = async () => {
    if (aiData) {
      setShowAI(!showAI);
      return;
    }
    setAiLoading(true);
    setShowAI(true);
    try {
      const res = await fetch(`${API}/products/${product.id}/ai-summary`);
      const json = await res.json();
      if (json.success) {
        setAiData(json.data);
      }
    } catch {
      /* silent */
    }
    setAiLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-900/20 flex flex-col justify-between">
      <div>
        <div className={`relative h-48 bg-gradient-to-br ${visual.bgGradient} overflow-hidden flex items-center justify-center`}>
          {!imgError && product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              onError={() => setImgError(true)}
            />
          ) : visual.fallbackImg ? (
            <img
              src={visual.fallbackImg}
              alt={product.name}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-5xl mb-2 drop-shadow-md animate-pulse">{visual.emoji}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 ${visual.textColor}`}>
                {visual.tag}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">{visual.desc}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 bg-indigo-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm shadow-md">
            {product.category}
          </span>
          
          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-95 shadow-md z-10 ${
              isWishlisted
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-400'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>

          <span className="absolute bottom-3 right-3 bg-slate-900/90 text-slate-300 text-[11px] px-2 py-0.5 rounded-lg backdrop-blur-sm border border-slate-700/50">
            {listings.length > 1 ? `🏪 ${listings.length} Stores` : `🏪 ${primaryListing.sellerName || product.brand}`}
          </span>

          {/* Real-Time Verified Live Badge */}
          {syncSuccess && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-500/90 text-white text-[11px] font-bold py-1 px-2 rounded-lg text-center backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom duration-200 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              🟢 REAL-TIME MARKET PRICE VERIFIED (Just Now)
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{product.name}</h3>
            <span className="text-slate-500 text-xs">{product.brand}</span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <span className="text-xl font-extrabold text-emerald-400">
                ₹{Number(lowestPrice || 0).toLocaleString('en-IN')}
              </span>
              {savings > 0 && (
                <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
                  Save {savings}%
                </span>
              )}
            </div>
            <PriceVerificationBadge
              compact
              verificationStatus={primaryListing.verificationStatus || (hasStaleData ? 'stale' : 'verified')}
              lastCheckedAt={primaryListing.lastCheckedAt || primaryListing.lastScrapedAt}
              sellerName={primaryListing.sellerName}
              marketplaceUrl={sanitizeStoreUrl(primaryListing.sellerUrl, product.name, primaryListing.sellerName)}
            />
          </div>

          <StarRating rating={primaryListing.rating || 4.5} />

          {/* Sync Live Market Price Button */}
          <button
            onClick={handleSyncLivePrice}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 py-1.5 rounded-xl transition-all disabled:opacity-50"
          >
            <span className={isSyncing ? "animate-spin" : ""}>🔄</span>
            {isSyncing ? "Refreshing prices..." : "Refresh Market Prices"}
          </button>

          {/* Across Stores Preview */}
          {listings.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span>🏪</span> Live Store Rates ({listings.length}):
                </span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Best: ₹{Number(lowestPrice || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="space-y-1">
                {listings.map((st, i) => {
                  const isLowest = parseFloat(st.price) === lowestPrice;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        isLowest
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-sm'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{st.sellerName}</span>
                        {isLowest && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                            BEST DEAL 🏆
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isLowest ? 'text-emerald-400' : 'text-slate-300'}`}>
                          ₹{Number(st.price).toLocaleString('en-IN')}
                        </span>
                        <a
                          href={sanitizeStoreUrl(st.sellerUrl, product.name, st.sellerName)}
                          target="_blank"
                          rel="noreferrer noopener"
                          referrerPolicy="no-referrer"
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                            isLowest
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-indigo-400'
                          }`}
                        >
                          Store ↗
                        </a>
                      </div>
                      {st.lastUpdated && (
                        <span className="text-[9px] text-slate-600">
                          Updated: {new Date(st.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Insights Button */}
          <button
            onClick={fetchAISummary}
            className="w-full text-xs font-semibold bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>✨</span>
            {aiLoading ? 'Analyzing Reviews with AI…' : showAI ? 'Hide AI Analysis' : 'AI Review Insights'}
          </button>

          {/* AI Summary Drawer */}
          {showAI && aiData && (
            <div className="p-3.5 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                  🤖 {aiData.source || 'Gemini AI'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                  {aiData.verdict || 'Recommended Buy'}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] italic">
                "{aiData.summary}"
              </p>

              {/* Best App / Store to Buy */}
              {aiData.bestAppToBuy && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-300 uppercase">🏆 Best Store to Buy:</span>
                    <span className="bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded">
                      {aiData.bestAppToBuy}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="text-xs font-bold text-white">
                      ₹{Number(aiData.bestAppPrice || lowestPrice).toLocaleString('en-IN')}
                    </span>
                    <a
                      href={sanitizeStoreUrl(aiData.bestAppUrl, product.name, aiData.bestAppToBuy)}
                      target="_blank"
                      rel="noreferrer noopener"
                      referrerPolicy="no-referrer"
                      className="text-[10px] text-emerald-400 underline font-semibold"
                    >
                      Buy on {aiData.bestAppToBuy} ↗
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {aiData.bestAppReason}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Additional Quick Action Buttons: Price History & Alert */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onOpenAdvisor && onOpenAdvisor(product)}
              className="flex items-center justify-center gap-1 text-[11px] font-semibold bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 py-1.5 rounded-xl transition-all"
            >
              <span>📈</span> Price Trend & AI
            </button>
            <button
              onClick={() => onOpenAlert && onOpenAlert(product)}
              className="flex items-center justify-center gap-1 text-[11px] font-semibold bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 py-1.5 rounded-xl transition-all"
            >
              <span>🔔</span> Price Alert
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/compare/${product.id}`}
            className="flex items-center justify-center gap-1.5 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-2 rounded-xl transition-all font-bold shadow-md shadow-indigo-900/30"
          >
            <span>⚖️</span> Compare Prices
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const targetUrl = sanitizeStoreUrl(primaryListing.sellerUrl, product.name, primaryListing.sellerName);
              window.open(targetUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center justify-center gap-1.5 text-center text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-2 rounded-xl transition-all font-bold shadow-md shadow-emerald-900/30"
          >
            <span>🛒</span> Buy {primaryListing.sellerName ? `on ${primaryListing.sellerName}` : ''} ↗
          </button>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="block text-center text-[11px] text-slate-400 hover:text-slate-200 py-1 font-medium transition-colors"
        >
          View Full Details & Specs →
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN HOMEPAGE ─────────────────── */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Catalog state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [syncAllLoading, setSyncAllLoading] = useState(false);
  const [syncAllSuccess, setSyncAllSuccess] = useState(false);
  const [activeAdvisorProduct, setActiveAdvisorProduct] = useState(null);
  const [activeAlertProduct, setActiveAlertProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchStatus, setSearchStatus] = useState('');

  const [heroMode, setHeroMode] = useState('scrape'); // 'scrape' or 'search'
  const [urlInput, setUrlInput] = useState('');
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);
  const [scrapeError, setScrapeError] = useState('');

  const handleHeroScrape = async (e) => {
    if (e) e.preventDefault();
    const targetUrl = urlInput.trim();
    if (!targetUrl) return;
    setScrapeLoading(true);
    setScrapeError('');
    setScrapeResult(null);

    try {
      const res = await fetch(`${API}/products/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.success && data.data?.length) {
        setScrapeResult(data.data[0]);
        fetchProducts();
      } else {
        setScrapeError(data.message || 'Could not extract product data from URL.');
      }
    } catch {
      setScrapeError('Network error – unable to connect to backend server.');
    }
    setScrapeLoading(false);
  };

  const categories = [
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

  const fetchProducts = async (q = searchQuery, cat = selectedCategory) => {
    setLoading(true);
    setFetchError(false);
    if (q) {
      setSearchStatus('Searching products across supported marketplaces...');
    }

    try {
      let endpoint = '';
      if (q) {
        setSearchStatus('Checking available marketplaces & matching products...');
        endpoint = `${API}/products/search?q=${encodeURIComponent(q)}`;
      } else {
        const categoryParam = (cat && cat !== 'All') ? `&category=${encodeURIComponent(cat)}` : '';
        endpoint = `${API}/products?_t=${Date.now()}${categoryParam}`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data || []);
      } else {
        throw new Error(json.message || 'Unknown error from server');
      }
    } catch (err) {
      console.error('[HomePage] Failed to fetch products:', err.message);
      setFetchError(true);
    }
    setLoading(false);
    setSearchStatus('');
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'All';
    setSearchQuery(q);
    setSelectedCategory(cat);
    fetchProducts(q, cat);
    
    // Scroll to products if query is present
    if (q || (cat && cat !== 'All')) {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        setTimeout(() => catalogEl.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [searchParams]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const params = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (catName !== 'All') params.category = catName;
    setSearchParams(params);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-20 px-4 text-center overflow-hidden">
        <FloatingOrbs />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-indigo-900/20 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI-Powered Price Comparison — Live Market Data
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 max-w-4xl mx-auto">
          Shop Smarter with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI-Driven
          </span>{' '}
          Price Intelligence
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Compare prices across <strong className="text-slate-200">Meesho, Flipkart, Amazon, Croma & Myntra</strong> in real-time.
          Our AI finds you the best deal — every single time.
        </p>

        {!isAuthenticated ? (
          <div className="max-w-xl mx-auto space-y-6 z-10 relative">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-md">
              <span className="text-4xl block mb-2">🛍️</span>
              <h2 className="text-xl font-extrabold text-white">Compare Prices Across 5 Indian Stores</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in or register to compare product links in real-time across <strong className="text-slate-200">Meesho, Flipkart, Amazon, Croma & Myntra</strong>, get Google Gemini AI review summaries, and receive instant price drop alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <span>🔐 Sign In to Compare Prices</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✨ Create Free Account</span>
                </Link>
              </div>
            </div>
            {/* Browse products without login */}
            <div className="mt-4">
              <button
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-300 text-xs font-semibold transition-colors group"
              >
                <span>👇 Browse all products without signing in</span>
                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Selector Tabs */}
            <div className="flex justify-center gap-2 mb-4 z-10 relative">
              <button
                type="button"
                onClick={() => setHeroMode('scrape')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  heroMode === 'scrape'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>⚡ Compare Product URL</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroMode('search')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  heroMode === 'search'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🔍 Search Catalog</span>
              </button>
            </div>

            {/* Form Container */}
            {heroMode === 'scrape' ? (
              <form onSubmit={handleHeroScrape} className="max-w-2xl mx-auto mb-4 z-10 relative space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔗</span>
                    <input
                      type="url"
                      placeholder="Paste Meesho, Flipkart, Amazon, Myntra link..."
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="w-full bg-slate-800/90 text-sm text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={scrapeLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{scrapeLoading ? "🕷️ Extracting..." : "⚡ Compare Now"}</span>
                  </button>
                </div>

                {/* Quick try example pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 font-medium">Try:</span>
                  {[
                    { label: 'boAt Earbuds (Meesho)', url: 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency/p/6p8x2z' },
                    { label: 'iPhone 15 Pro (Amazon)', url: 'https://amazon.in/dp/B0CHX12345' },
                    { label: 'Sony Headphones (Amazon)', url: 'https://amazon.in/dp/B09XS8728S' },
                    { label: 'boAt Airdopes (Flipkart)', url: 'https://flipkart.com/boat-airdopes-141' },
                  ].map(ex => (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => {
                        setUrlInput(ex.url);
                        setHeroMode('scrape');
                      }}
                      className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-indigo-300 hover:text-indigo-200 px-2.5 py-1 rounded-lg text-[11px] transition-all"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <form onSubmit={handleHeroSearch} className="flex items-center max-w-lg mx-auto gap-2 mb-6 z-10 relative">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
                  <input
                    id="hero-search-input"
                    type="text"
                    placeholder="Search soap, kurti, iPhone, laptop…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <button
                  id="hero-search-btn"
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-700/40 active:scale-95"
                >
                  Search
                </button>
              </form>
            )}

            {/* Live Scrape Result Preview Banner on Home Page */}
            {scrapeLoading && (
              <div className="max-w-xl mx-auto my-6 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-center space-y-2 text-indigo-300 animate-pulse">
                <span className="text-2xl block">🕷️</span>
                <p className="text-xs font-bold">Scanning product & extracting live store prices...</p>
              </div>
            )}

            {scrapeError && (
              <div className="max-w-xl mx-auto my-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-center text-xs text-red-300">
                ⚠️ {scrapeError}
              </div>
            )}

            {scrapeResult && (
              <div className="max-w-2xl mx-auto my-6 p-6 bg-slate-900 border border-indigo-500/50 rounded-3xl text-left space-y-4 shadow-2xl shadow-indigo-950/50 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Successfully Scraped & Compared
                  </span>
                  <button onClick={() => setScrapeResult(null)} className="text-xs text-slate-500 hover:text-slate-300">✕ Close</button>
                </div>
                <ProductCard
                  product={scrapeResult.product || scrapeResult}
                  onOpenAdvisor={(prod) => setActiveAdvisorProduct(prod)}
                  onOpenAlert={(prod) => setActiveAlertProduct(prod)}
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* ── TICKER ── */}
      <TickerBanner products={products} />

      {/* ── STATS ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Products Tracked',   value: products.length || 36, suffix: '+' },
            { label: 'Store Comparisons',  value: products.reduce((a, p) => a + (p.listings?.length || 0), 0) || 112, suffix: '+' },
            { label: 'Happy Shoppers',     value: 4200, suffix: '+' },
            { label: 'Avg. Savings',       value: 23,   suffix: '%' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
              <p className="text-3xl font-extrabold text-white mb-1">
                <Counter end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI BUDGET ADVISOR WIDGET ── */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <AiBudgetAdvisorWidget />
      </section>
      
      {/* ── CATALOG SECTION (Always shown — browse all products) ── */}
      {true && (
        <section id="catalog-section" className="py-14 px-4 bg-slate-950/80">
          <div className="max-w-7xl mx-auto">
            {/* Category Pills */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    selectedCategory === cat.name
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-white">
                    {selectedCategory !== 'All' ? `${selectedCategory} Products` : searchQuery ? 'Search Results' : 'All Products'}
                  </h2>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Market Rates
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  {products.length} product{products.length !== 1 ? 's' : ''} available in database
                  {searchQuery ? ` matching "${searchQuery}"` : ''}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Batch Live Sync All Stores Button */}
                <button
                  onClick={async () => {
                    setSyncAllLoading(true);
                    try {
                      const res = await fetch(`${API}/products/sync-all-live`, { method: 'POST' });
                      const json = await res.json();
                      if (json.success) {
                        setSyncAllSuccess(true);
                        await fetchProducts(searchQuery, selectedCategory);
                        setTimeout(() => setSyncAllSuccess(false), 5000);
                      }
                    } catch {
                      /* silent */
                    }
                    setSyncAllLoading(false);
                  }}
                  disabled={syncAllLoading}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className={syncAllLoading ? "animate-spin" : ""}>⚡</span>
                  {syncAllLoading ? "Syncing All Products Live..." : "Sync All Stores Live"}
                </button>

                {(searchQuery || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSearchParams({});
                    }}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Clear filters ✕
                  </button>
                )}
              </div>
            </div>

            {/* Sync All Success Banner */}
            {syncAllSuccess && (
              <div className="mb-6 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
                <span className="text-base">✅</span>
                <span><strong>Live Sync Complete!</strong> All catalog prices have been updated in real-time across Meesho, Flipkart, Amazon, and Croma.</span>
              </div>
            )}

            {/* Catalog Grid */}
            {fetchError ? (
              <div className="text-center py-20 px-6 border border-dashed border-red-800/60 rounded-3xl bg-red-950/20 max-w-3xl mx-auto">
                <span className="text-5xl block mb-3">⚠️</span>
                <h3 className="text-xl font-bold text-red-300 mb-2">Could Not Load Prices from Database</h3>
                <p className="text-xs text-slate-400 mb-6">
                  The backend API is unavailable. Ensure the backend server is active and PostgreSQL database is connected. If using Render free tier, please allow ~30 seconds for server wake-up.
                </p>
                <button
                  onClick={() => fetchProducts()}
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-2xl transition-all text-sm"
                >
                  🔄 Retry Loading Products
                </button>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {searchStatus && (
                  <div className="p-4 bg-indigo-950/60 border border-indigo-500/40 rounded-2xl text-center text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 shadow-lg animate-pulse">
                    <span className="animate-spin">🔄</span>
                    <span>{searchStatus}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-slate-800 rounded-lg w-4/5" />
                      <div className="h-3 bg-slate-800 rounded-lg w-1/3" />
                      <div className="h-6 bg-slate-800 rounded-lg w-1/2" />
                      <div className="h-8 bg-slate-800 rounded-xl" />
                      <div className="h-16 bg-slate-800 rounded-xl" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-slate-800 rounded-xl flex-1" />
                        <div className="h-8 bg-slate-800 rounded-xl flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 px-6 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40 max-w-3xl mx-auto">
                <span className="text-5xl block mb-3">🕸️</span>
                <h3 className="text-xl font-bold text-white mb-2">No Live Products Found</h3>
                <p className="text-xs text-slate-400 mb-6">
                  No products match your search. Use the Live Scraper to ingest real-time product links.
                </p>
                <Link
                  to="/scrape"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
                >
                  <span>🚀 Open Live Scraper Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onOpenAdvisor={(prod) => setActiveAdvisorProduct(prod)}
                    onOpenAlert={(prod) => setActiveAlertProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">How ShopWise AI Works</h2>
          <p className="text-sm text-slate-400">Three simple steps to the best deal</p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '🔍', title: 'Search Any Product', desc: 'Type what you want — from soap to smartphones. Our engine scans all major Indian e-commerce stores instantly.' },
            { step: '02', icon: '🤖', title: 'AI Compares & Ranks', desc: 'Gemini AI analyses price, ratings, seller reliability, and delivery speed to find you the verified best deal.' },
            { step: '03', icon: '🏆', title: 'Save & Shop Smart', desc: 'See the BEST DEAL highlighted with savings %. Click to buy directly from the winning store.' },
          ].map(item => (
            <div key={item.step} className="text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="text-xs font-bold text-indigo-500 mb-3 tracking-widest">{item.step}</div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why ShopWise AI?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon="🤖" title="Gemini AI Recommendations" desc="Google Gemini AI analyses seller trustworthiness, price history, and delivery metrics to give you a personalised best pick." color="from-blue-600 to-indigo-700" />
            <FeatureCard icon="⚡" title="Live URL Scraper" desc="Paste any Meesho, Flipkart or Amazon product URL and get an instant price comparison against all other platforms." color="from-purple-600 to-violet-700" />
            <FeatureCard icon="📊" title="Multi-Store Price Chart" desc="See prices side-by-side from up to 5 stores with a clear BEST DEAL badge and percentage savings highlighted." color="from-emerald-500 to-teal-600" />
            <FeatureCard icon="🔔" title="Price Alert System" desc="Set a target price and get notified the moment a product drops below your budget — never miss a sale." color="from-amber-500 to-orange-600" />
            <FeatureCard icon="🛡️" title="Seller Reliability Score" desc="Our algorithm rates each platform on delivery speed, return policy, and customer support so you shop with confidence." color="from-rose-600 to-pink-700" />
            <FeatureCard icon="🇮🇳" title="Made for India" desc="Covers Meesho, Flipkart, Amazon India, Croma, BigBasket, Myntra — the platforms you actually use every day." color="from-orange-500 to-amber-600" />
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!isAuthenticated && (
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-purple-900/60 rounded-3xl border border-indigo-500/20 p-10 shadow-2xl shadow-indigo-900/30">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Start Saving Money Today
            </h2>
            <p className="text-slate-400 text-sm mb-7 leading-relaxed">
              Join thousands of smart Indian shoppers who save an average of ₹1,200 per purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                id="cta-register-btn"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-700/40 text-sm active:scale-95"
              >
                🚀 Create Free Account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AI Smart Shopping Advisor & Price History Modal */}
      {activeAdvisorProduct && (
        <PriceAdvisorModal
          product={activeAdvisorProduct}
          onClose={() => setActiveAdvisorProduct(null)}
        />
      )}

      {/* Price Drop Alert Modal */}
      {activeAlertProduct && (
        <PriceAlertModal
          product={activeAlertProduct}
          onClose={() => setActiveAlertProduct(null)}
        />
      )}

      {/* Ticker CSS */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-\\[ticker_35s_linear_infinite\\] {
          animation: ticker 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
