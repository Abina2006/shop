import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeFeed } from '../hooks/useRealtimeFeed';
import { getProductVisual } from '../utils/productImages';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STEPS = [
  { id: 1, label: 'Connecting to URL', icon: '🌐' },
  { id: 2, label: 'Crawling with Scrapy spider', icon: '🕷️' },
  { id: 3, label: 'Rendering JavaScript (headless browser)', icon: '⚙️' },
  { id: 4, label: 'Extracting ratings & reviews', icon: '⭐' },
  { id: 5, label: 'Saving to database', icon: '💾' },
];

const EXAMPLE_URLS = [
  { label: 'boAt Earbuds (Meesho)', url: 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency/p/6p8x2z', site: 'meesho.com' },
  { label: 'iPhone 15 Pro (Amazon)', url: 'https://amazon.in/dp/B0CHX12345', site: 'amazon.in' },
  { label: 'Sony Headphones (Amazon)', url: 'https://amazon.in/dp/B09XS8728S', site: 'amazon.in' },
  { label: 'boAt Airdopes (Flipkart)', url: 'https://flipkart.com/boat-airdopes-141', site: 'flipkart.com' },
];

const BLOCKED_DOMAINS = ['meesho.com', 'amazon.in', 'amazon.com', 'flipkart.com', 'myntra.com', 'ajio.com'];

function StarRating({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-base ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-300' : 'text-slate-600'}`}>
          {i < full ? '★' : i === full && half ? '⭐' : '☆'}
        </span>
      ))}
      <span className="text-xs text-slate-400 ml-1">{Number(rating).toFixed(1)}</span>
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
            {(review.reviewer_name || review.reviewerName || 'V').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-200">{review.reviewer_name || review.reviewerName}</span>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-slate-400 text-xs leading-relaxed pl-9">{review.review_text || review.reviewText}</p>
    </div>
  );
}

function ProductCard({ product, listing, listings = [], reviews }) {
  const [expanded, setExpanded] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  const allListings = (listings && listings.length > 0) ? listings : (product.listings || (listing ? [listing] : []));
  const lowestPrice = allListings.length > 0 ? Math.min(...allListings.map(l => parseFloat(l.price) || 0).filter(p => p > 0)) : (listing?.price || 0);
  const highestPrice = allListings.length > 0 ? Math.max(...allListings.map(l => parseFloat(l.price) || 0).filter(p => p > 0)) : lowestPrice;
  const savings = highestPrice > lowestPrice ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100) : 0;

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
    <div className="bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-900/30 flex flex-col justify-between">
      <div>
        <div className={`relative h-44 bg-gradient-to-br ${getProductVisual(product).bgGradient || 'from-slate-800 to-slate-900'} overflow-hidden`}>
          {(() => {
            const visual = getProductVisual(product);
            const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
            
            // We use state to track error, but since we are inside a functional block without hooks for this specific image,
            // we'll rely on a tiny inline React component or simple onError hiding if fallbackImg is null.
            // But wait, ScraperPage's ProductCard is a component, so we CAN use hooks!
            // However, to keep it simple and match the DOM structure of HomePage:
            return (
              <>
                {hasImage ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity relative z-10"
                    onError={(e) => { 
                      if (visual.fallbackImg) {
                        e.target.src = visual.fallbackImg; 
                      } else {
                        e.target.style.display = 'none'; 
                      }
                    }}
                  />
                ) : visual.fallbackImg ? (
                  <img
                    src={visual.fallbackImg}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity relative z-10"
                  />
                ) : null}
                
                {/* Always render the fallback div underneath, so if img is hidden, it shows through! */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-0">
                  <span className="text-5xl mb-2 drop-shadow-md animate-pulse">{visual.emoji}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 ${visual.textColor}`}>
                    {visual.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">{visual.desc}</span>
                </div>
              </>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-20 pointer-events-none" />
          <span className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm z-30">
            {product.category}
          </span>
          <span className="absolute top-3 right-3 bg-slate-900/80 text-slate-300 text-xs px-2 py-1 rounded-lg backdrop-blur-sm z-30">
            {allListings.length > 1 ? `🏪 ${allListings.length} Stores Available` : `🏪 ${listing?.sellerName || product.brand}`}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{product.name}</h3>
            <span className="text-slate-500 text-xs">{product.brand}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              {Number(lowestPrice) > 0 ? (
                <span className="text-xl font-extrabold text-emerald-400">
                  ₹{Number(lowestPrice).toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-sm font-bold text-slate-400 border border-slate-600 px-2 py-1 rounded-md">
                  UNVERIFIED
                </span>
              )}
              {savings > 0 && Number(lowestPrice) > 0 && (
                <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
                  Save {savings}%
                </span>
              )}
            </div>
            <StarRating rating={listing?.rating || 4.5} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{Number(listing?.reviewCount || 350).toLocaleString()} reviews</span>
            <span>{listing?.currency || 'INR'}</span>
          </div>

          {/* Multi-Website Store Prices Breakdown */}
          {allListings.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  🛒 Across {allListings.length} Websites:
                </span>
                <button
                  onClick={() => setShowStores(!showStores)}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  {showStores ? 'Less' : 'View all'}
                </button>
              </div>

              <div className="space-y-1.5">
                {(showStores ? allListings : allListings.slice(0, 2)).map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/40">
                    <span className="text-slate-300 font-medium">{st.sellerName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-300">₹{Number(st.price).toLocaleString('en-IN')}</span>
                      <a
                        href={st.sellerUrl || `https://www.google.com/search?q=${encodeURIComponent(product.name)}+${encodeURIComponent(st.sellerName)}+price`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Check ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 pt-0.5">◎ Reference prices — verify on marketplace before purchase</p>
            </div>
          )}

          {/* AI Insights Button */}
          <button
            onClick={fetchAISummary}
            className="w-full text-xs font-semibold bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>✨</span>
            {aiLoading ? 'Analyzing with Gemini AI…' : showAI ? 'Hide AI Analysis' : 'AI Review Insights'}
          </button>

          {/* AI Summary Drawer */}
          {showAI && aiData && (
            <div className="p-3.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-2.5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  🤖 {aiData.source || 'Gemini AI'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${aiData.sentiment === 'Positive' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {aiData.verdict || aiData.sentiment}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] italic">
                "{aiData.summary}"
              </p>

              {/* Sentiment Score Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Positive ({aiData.positivePercent || 85}%)</span>
                  <span>Negative ({aiData.negativePercent || 15}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden flex">
                  <div style={{ width: `${aiData.positivePercent || 85}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${aiData.negativePercent || 15}%` }} className="bg-rose-500 h-full" />
                </div>
              </div>

              {/* Best App / Store to Buy Recommendation */}
              {aiData.bestAppToBuy && (
                <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 rounded-xl p-3 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                      🏆 Recommended Store to Buy:
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {aiData.bestAppToBuy}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="text-sm font-extrabold text-white">
                      ₹{Number(aiData.bestAppPrice || lowestPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {aiData.bestAppUrl && (
                      <a
                        href={aiData.bestAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-0.5"
                      >
                        Buy on {aiData.bestAppToBuy} ↗
                      </a>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-300 leading-snug">
                    💡 <span className="text-slate-200">{aiData.bestAppReason || 'Provides the most competitive deal and high seller trust rating.'}</span>
                  </p>
                </div>
              )}

              {/* Key Pros */}
              {aiData.pros && aiData.pros.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Top Highlights:</span>
                  <ul className="space-y-0.5">
                    {aiData.pros.slice(0, 2).map((pro, i) => (
                      <li key={i} className="text-slate-300 text-[11px] flex items-start gap-1">
                        <span className="text-emerald-400">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {reviews && reviews.length > 0 && (
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 py-1.5 border border-slate-700 hover:border-indigo-500/40 rounded-xl transition-all"
              >
                {expanded ? '▲ Hide' : '▼ Show'} {reviews.length} Raw Review{reviews.length !== 1 ? 's' : ''}
              </button>
              {expanded && (
                <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto pr-0.5">
                  {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 flex gap-2">
        <Link
          to={`/compare/${product.id}`}
          className="flex-1 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl border border-indigo-500/30 transition-all font-bold shadow-md shadow-indigo-900/30"
        >
          ⚖️ Compare Prices
        </Link>
      </div>
    </div>
  );
}

const ScraperPage = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [search, setSearch] = useState('');
  const stepTimerRef = useRef(null);

  const { isConnected, scraperLogs, latestProductScraped } = useRealtimeFeed();

  // Auto refresh product list when a new product is scraped live via SSE
  useEffect(() => {
    if (latestProductScraped) {
      fetchAllProducts();
    }
  }, [latestProductScraped]);

  const isBlockedDomain = (inputUrl) => {
    try {
      const domain = new URL(inputUrl).hostname.toLowerCase();
      return BLOCKED_DOMAINS.some(d => domain.includes(d));
    } catch { return false; }
  };

  const startStepAnimation = () => {
    let s = 0;
    setStep(0);
    const interval = setInterval(() => {
      s += 1;
      if (s >= STEPS.length) { clearInterval(interval); return; }
      setStep(s);
    }, isBlockedDomain(url) ? 3000 : 1500);
    stepTimerRef.current = interval;
    return interval;
  };

  const fetchAllProducts = async (q = search) => {
    setLoadingAll(true);
    try {
      const res = await fetch(`${API}/products?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success) setAllProducts(json.data);
    } catch { /* silent */ }
    setLoadingAll(false);
  };

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus('loading');
    setResults([]);
    setRelatedProducts([]);
    setErrorMsg('');
    setIsProtected(false);
    const interval = startStepAnimation();

    try {
      const res = await fetch(`${API}/products/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      clearInterval(interval);
      setStep(STEPS.length - 1);
      const data = await res.json();

      if (data.success && data.data?.length) {
        setResults(data.data);
        if (data.relatedProducts && data.relatedProducts.length > 0) {
          setRelatedProducts(data.relatedProducts);
        }
        setStatus('success');
        fetchAllProducts();
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Could not extract product data.');
        setIsProtected(data.protected || false);
      }
    } catch {
      clearInterval(interval);
      setStatus('error');
      setErrorMsg('Network error – unable to connect to backend server. If using Render free tier, the backend may take ~30s to wake up.');
    }
  };

  useEffect(() => { fetchAllProducts(''); }, []); // eslint-disable-line

  return (
    <div className="space-y-14 py-4 max-w-7xl mx-auto px-4">

      {/* ── Hero Scraper Section ── */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800/40 to-slate-900 border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-950/50">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-indigo-500/20">
              <span className="animate-pulse">🕷️</span> Powered by Scrapy + Playwright
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Paste a Product Link
            </h1>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-xl mx-auto">
              Add a product URL to extract its details and compare reference prices across stores. Prices shown are from our catalog — always verify on the marketplace before purchasing.
            </p>
          </div>

          {/* URL Input */}
          <form onSubmit={handleScrape} className="flex flex-col sm:flex-row gap-3">
            <input
              id="product-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://store.example.com/products/earphones..."
              disabled={status === 'loading'}
              className="flex-1 bg-slate-800/80 text-white placeholder-slate-500 px-5 py-4 rounded-2xl border border-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-all disabled:opacity-50"
            />
            <button
              id="scrape-btn"
              type="submit"
              disabled={status === 'loading' || !url.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-50 text-white font-bold px-7 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center gap-2 whitespace-nowrap"
            >
              {status === 'loading'
                ? <><span className="inline-block animate-spin">⚙️</span> Comparing…</>
                : <><span>⚡</span> Compare Now</>}
            </button>
          </form>

          {/* Example URLs */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            <span className="text-slate-600 text-xs self-center">Try:</span>
            {EXAMPLE_URLS.map((ex) => (
              <button
                key={ex.url}
                onClick={() => setUrl(ex.url)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Step Animation */}
          {status === 'loading' && (
            <div className="mt-8 space-y-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-700 ${i <= step ? 'bg-indigo-500/10 border border-indigo-500/20' : 'opacity-20'}`}
                >
                  <span className={`text-lg ${i === step ? 'animate-pulse' : ''}`}>{s.icon}</span>
                  <span className={`text-sm font-medium ${i <= step ? 'text-indigo-300' : 'text-slate-600'}`}>{s.label}</span>
                  {i < step && <span className="ml-auto text-green-400 text-xs font-semibold">✓</span>}
                  {i === step && <span className="ml-auto text-indigo-400 text-xs animate-pulse">running…</span>}
                </div>
              ))}
            </div>
          )}



          {/* Error / Protected site */}
          {status === 'error' && (
            <div className={`mt-6 rounded-2xl p-5 border ${isProtected ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{isProtected ? '🛡️' : '⚠️'}</span>
                <div className="space-y-2">
                  <p className={`text-sm font-semibold ${isProtected ? 'text-amber-300' : 'text-red-300'}`}>
                    {isProtected ? 'Bot Protection Detected' : 'Extraction Failed'}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
                  {isProtected && (
                    <div className="mt-3 p-3 bg-slate-900/50 rounded-xl space-y-1">
                      <p className="text-xs font-semibold text-slate-300">✅ Sites that work well:</p>
                      {EXAMPLE_URLS.map(ex => (
                        <button key={ex.url} onClick={() => setUrl(ex.url)} className="block text-xs text-indigo-400 hover:text-indigo-300 underline">
                          → {ex.site}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Extraction Results ── */}
      {status === 'success' && results.length > 0 && (
        <section className="space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-lg">✅</div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {results.length} Product{results.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-slate-500 text-xs truncate max-w-md">{url}</p>
                </div>
              </div>
              {/* Price disclaimer banner */}
              <div className="flex-1 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5">
                <span className="text-amber-400 text-sm shrink-0 mt-0.5">◎</span>
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  <strong>Reference prices shown.</strong> Prices are from our catalog and may differ from current marketplace prices. Click <em>"Check on [Store] ↗"</em> to verify the live price before purchasing.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((r, i) => (
                <ProductCard
                  key={i}
                  product={r.product}
                  listing={r.listing}
                  listings={r.listings || r.product?.listings}
                  reviews={r.reviews}
                />
              ))}
            </div>
          </div>

          {/* ── Relatable / Similar Products ── */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✨</span>
                  <div>
                    <h3 className="text-base font-bold text-white">Related & Alternative Products</h3>
                    <p className="text-slate-500 text-xs">Similar items from across other catalogs and sellers</p>
                  </div>
                </div>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
                  {relatedProducts.length} Match{relatedProducts.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    listing={p.listings?.[0]}
                    listings={p.listings}
                    reviews={p.listings?.[0]?.reviews}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Product Catalog ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Scraped Product Catalog</h2>
            <p className="text-slate-500 text-sm mt-0.5">{allProducts.length} total products in database</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search catalog…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAllProducts(search)}
              className="bg-slate-800 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm transition-all w-52"
            />
            <button
              onClick={() => fetchAllProducts(search)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl border border-slate-700 text-sm transition-all"
            >
              🔄
            </button>
          </div>
        </div>

        {loadingAll ? (
          <div className="flex justify-center py-20">
            <div className="text-indigo-400 animate-pulse">Loading catalog…</div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-3xl">
            <div className="text-6xl mb-4">🕷️</div>
            <p className="text-lg font-semibold text-slate-400">No products scraped yet</p>
            <p className="text-sm text-slate-600 mt-1">Paste a product URL above and click Scrape Now</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {EXAMPLE_URLS.map(ex => (
                <button key={ex.url} onClick={() => setUrl(ex.url)} className="text-xs text-indigo-400 bg-indigo-600/10 border border-indigo-600/20 px-3 py-1.5 rounded-lg hover:bg-indigo-600/20 transition-all">
                  Try: {ex.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                listing={product.listings?.[0]}
                listings={product.listings}
                reviews={product.listings?.[0]?.reviews}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ScraperPage;
