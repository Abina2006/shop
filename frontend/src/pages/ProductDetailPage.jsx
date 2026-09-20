import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductVisual } from '../utils/productImages';
import { sanitizeStoreUrl } from '../utils/urlHelper';
import PriceVerificationBadge, { PriceDisclaimerBar } from '../components/PriceVerificationBadge';
import PriceVariationWidget from '../components/PriceVariationWidget';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function StarRating({ rating = 0, size = 'sm' }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const sz = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`${sz} ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-300' : 'text-slate-600'}`}>
          {i < full ? '★' : i === full && half ? '⭐' : '☆'}
        </span>
      ))}
      <span className={`${size === 'lg' ? 'text-base' : 'text-xs'} text-slate-300 ml-1.5 font-bold`}>
        {Number(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6 pt-4">
        <div className="h-5 w-52 bg-slate-800 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-800 rounded-xl w-4/5" />
            <div className="h-4 bg-slate-800 rounded-lg w-1/3" />
            <div className="h-16 bg-slate-800 rounded-2xl" />
            <div className="h-12 bg-slate-800 rounded-2xl" />
            <div className="h-10 bg-slate-800 rounded-2xl" />
            <div className="h-28 bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Real Price History Chart — fetches actual recorded prices from DB.
 * Falls back to a simple static display if no history data is available.
 */
function RealPriceHistoryChart({ productId, lowestPrice }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!productId) return;
    fetch(`${API}/products/${productId}/price-history`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) setHistoryData(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  // Flatten all history points across all sellers
  const allPoints = historyData
    .flatMap(s => s.history.map(h => ({ ...h, seller: s.sellerName })))
    .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

  if (loading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 animate-pulse">
        <div className="h-16 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (allPoints.length < 2) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">📈 Price History</h4>
          <span className="text-[11px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">Not enough data yet</span>
        </div>
        <p className="text-[10px] text-slate-600">
          Price history will appear here as prices are recorded over time.
          {lowestPrice > 0 && ` Current reference price: ₹${Number(lowestPrice).toLocaleString('en-IN')}.`}
        </p>
      </div>
    );
  }

  const prices = allPoints.map(p => p.price);
  const maxP = Math.max(...prices), minP = Math.min(...prices), range = maxP - minP || 1;
  const W = 300, H = 70;
  const coords = allPoints.map((p, i) => ({
    x: (i / (allPoints.length - 1)) * W,
    y: H - ((p.price - minP) / range) * (H - 12) - 6
  }));
  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${W},${H} L 0,${H} Z`;
  const isDown = prices[prices.length - 1] <= prices[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">📈 Price History</h4>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
          isDown ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
        }`}>
          {allPoints.length} data point{allPoints.length !== 1 ? 's' : ''} recorded
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#histGrad)" />
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 4 : 2}
            fill={i === coords.length - 1 ? '#10b981' : '#6366f1'}
            stroke={i === coords.length - 1 ? '#064e3b' : 'none'} strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-0.5">
        <span>{new Date(allPoints[0].recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        <span className="text-emerald-400 font-bold">Today ₹{Number(prices[prices.length - 1]).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [related, setRelated] = useState([]);
  const [imgError, setImgError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setImgError(false);
      try {
        const res = await fetch(`${API}/products/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
          const allRes = await fetch(`${API}/products`);
          const allJson = await allRes.json();
          if (allJson.success) {
            setRelated((allJson.data||[]).filter(p=>p.id!==json.data.id&&p.category===json.data.category).slice(0,4));
          }
        }
      } catch(e){console.error(e);}
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const key = `wishlist_${user?.id||'guest'}`;
    const stored = localStorage.getItem(key);
    if (stored) { try { setIsWishlisted(JSON.parse(stored).some(p=>p.id===product.id)); } catch{} }
  }, [product, user]);

  const toggleWishlist = () => {
    const next = !isWishlisted; setIsWishlisted(next);
    const key = `wishlist_${user?.id||'guest'}`;
    let list = JSON.parse(localStorage.getItem(key)||'[]');
    if (next) { if (!list.some(p=>p.id===product.id)) list.push(product); }
    else list = list.filter(p=>p.id!==product.id);
    localStorage.setItem(key, JSON.stringify(list));
  };

  const fetchAI = async () => {
    if (aiData) { setActiveTab('ai'); return; }
    setAiLoading(true); setActiveTab('ai');
    try {
      const res = await fetch(`${API}/products/${id}/ai-summary`);
      const json = await res.json();
      if (json.success) setAiData(json.data);
    } catch{}
    setAiLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyDone(true); setTimeout(()=>setCopyDone(false),2000);
  };

  if (loading) return <DetailSkeleton />;
  if (!product) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 underline text-sm">← Back to Home</Link>
      </div>
    </div>
  );

  const visual = getProductVisual(product);
  const listings = product.listings || [];
  const prices = listings.map(l=>parseFloat(l.price)).filter(Boolean);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const savings = highestPrice>lowestPrice ? Math.round(((highestPrice-lowestPrice)/highestPrice)*100) : 0;
  const primaryListing = listings[0] || {};
  const bestListing = listings.find(l=>parseFloat(l.price)===lowestPrice) || primaryListing;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumb */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">🏠 Home</Link>
        <span>›</span><span className="text-slate-500">{product.category}</span>
        <span>›</span><span className="text-white font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="space-y-4">
            <div className={`relative rounded-3xl overflow-hidden h-80 sm:h-96 bg-gradient-to-br ${visual.bgGradient} flex items-center justify-center border border-slate-800 shadow-2xl`}>
              {!imgError && product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={()=>setImgError(true)} />
              ) : visual.fallbackImg ? (
                <img src={visual.fallbackImg} alt={product.name} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none';}} />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-8xl drop-shadow-2xl">{visual.emoji}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 ${visual.textColor}`}>{visual.tag}</span>
                </div>
              )}
              <span className="absolute top-4 left-4 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-sm">{product.category}</span>
              {savings>0 && <span className="absolute top-4 right-4 bg-emerald-500/90 text-white text-xs font-extrabold px-3 py-1 rounded-xl backdrop-blur-sm shadow-lg">SAVE {savings}%</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={toggleWishlist} className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${isWishlisted?'bg-rose-950/60 border-rose-500/50 text-rose-400':'bg-slate-800 border-slate-700 text-slate-300 hover:border-rose-500/30 hover:text-rose-300'}`}>
                {isWishlisted?'❤️ Wishlisted':'🤍 Add to Wishlist'}
              </button>
              <button onClick={copyLink} className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all">
                {copyDone?'✅ Link Copied!':'🔗 Share Product'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-slate-400 text-sm font-semibold">{product.brand}</span>
                <StarRating rating={primaryListing.rating||4.5} size="lg" />
              </div>
              {product.description && <p className="text-sm text-slate-400 leading-relaxed mt-2">{product.description}</p>}
            </div>

            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-emerald-400">₹{Number(lowestPrice).toLocaleString('en-IN')}</span>
                {savings>0 && <span className="text-lg text-slate-500 line-through">₹{Number(highestPrice).toLocaleString('en-IN')}</span>}
                <PriceVerificationBadge
                  compact
                  verificationStatus={bestListing.verificationStatus || 'reference'}
                  priceSource={bestListing.priceSource || 'catalog'}
                  lastUpdated={bestListing.lastUpdated}
                  priceVerifiedAt={bestListing.priceVerifiedAt}
                  sellerName={bestListing.sellerName}
                  marketplaceUrl={sanitizeStoreUrl(bestListing.sellerUrl, product.name, bestListing.sellerName)}
                />
              </div>
              <p className="text-xs text-emerald-300/80 font-semibold">🏆 Lowest across {listings.length} store{listings.length!==1?'s':''} • Best on {bestListing.sellerName}</p>
              <PriceDisclaimerBar
                verificationStatus={bestListing.verificationStatus || 'reference'}
                lastUpdated={bestListing.lastUpdated}
                sellerName={bestListing.sellerName}
                marketplaceUrl={sanitizeStoreUrl(bestListing.sellerUrl, product.name, bestListing.sellerName)}
              />
            </div>

            <a
              href={sanitizeStoreUrl(bestListing.sellerUrl, product.name, bestListing.sellerName)}
              target="_blank" rel="noreferrer noopener" referrerPolicy="no-referrer"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >🛒 Buy on {bestListing.sellerName} — Best Price ↗</a>

            <div className="flex gap-2">
              <Link to={`/compare/${product.id}`} className="flex-1 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">⚖️ Compare Prices</Link>
              <Link to="/alerts" state={{productId:product.id,productName:product.name,lowestPrice}} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">🔔 Set Alert</Link>
              <button onClick={fetchAI} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">🤖 AI Review</button>
            </div>

            <RealPriceHistoryChart productId={id} lowestPrice={lowestPrice} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800">
          <div className="flex gap-1 overflow-x-auto">
            {[{id:'overview',label:'📋 Overview'},{id:'stores',label:'🏪 Stores'},{id:'reviews',label:'⭐ Reviews'},{id:'ai',label:'🤖 AI Analysis'}].map(tab=>(
              <button key={tab.id} onClick={()=>{setActiveTab(tab.id);if(tab.id==='ai')fetchAI();}}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${activeTab===tab.id?'border-indigo-500 text-indigo-300':'border-transparent text-slate-500 hover:text-slate-300'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {activeTab==='overview' && (
          <div className="space-y-6">
            <PriceVariationWidget product={product} listings={listings} />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {icon:'📦',title:'Category',value:product.category},
                {icon:'🏷️',title:'Brand',value:product.brand||'Not specified'},
                {icon:'🏪',title:'Available On',value:listings.map(l=>l.sellerName).join(', ')||'N/A'},
                {icon:'💰',title:'Price Range',value:`₹${Number(lowestPrice).toLocaleString('en-IN')} – ₹${Number(highestPrice).toLocaleString('en-IN')}`},
                {icon:'⭐',title:'Rating',value:`${Number(primaryListing.rating||4.5).toFixed(1)} / 5.0 stars`},
                {icon:'💚',title:'Max Price Spread',value:savings>0?`Save ${savings}% (₹${(highestPrice-lowestPrice).toLocaleString('en-IN')} spread)`:'Consistent pricing'},
              ].map((item,i)=>(
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</h3>
                  <p className="text-sm text-white font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stores */}
        {activeTab==='stores' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">🏪 All Store Listings</h3>
            {listings.length===0 && <p className="text-slate-500 text-sm py-8 text-center">No store listings found.</p>}
            {listings.map((l,i)=>{
              const isLowest=parseFloat(l.price)===lowestPrice;
              const mktUrl = sanitizeStoreUrl(l.sellerUrl, product.name, l.sellerName);
              return (
                <div key={i} className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${isLowest?'bg-emerald-950/30 border-emerald-500/40 shadow-lg':'bg-slate-900/60 border-slate-800'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isLowest?'bg-emerald-500/20':'bg-slate-800'}`}>🏪</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{l.sellerName}</span>
                          {isLowest && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">🏆 BEST PRICE</span>}
                          <PriceVerificationBadge
                            compact
                            verificationStatus={l.verificationStatus || 'reference'}
                            priceSource={l.priceSource || 'catalog'}
                            lastUpdated={l.lastUpdated}
                            priceVerifiedAt={l.priceVerifiedAt}
                            sellerName={l.sellerName}
                            marketplaceUrl={mktUrl}
                          />
                        </div>
                        <StarRating rating={l.rating||4.5} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className={`text-xl font-black ${isLowest?'text-emerald-400':'text-white'}`}>₹{Number(l.price).toLocaleString('en-IN')}</span>
                      <a href={mktUrl} target="_blank" rel="noreferrer noopener" referrerPolicy="no-referrer"
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${isLowest?'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg':'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'}`}
                      >Buy on {l.sellerName} ↗</a>
                    </div>
                  </div>
                  <PriceDisclaimerBar
                    verificationStatus={l.verificationStatus || 'reference'}
                    lastUpdated={l.lastUpdated}
                    sellerName={l.sellerName}
                    marketplaceUrl={mktUrl}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Reviews */}
        {activeTab==='reviews' && (
          <div className="space-y-4">
            {(product.reviews||[]).length===0?(
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-slate-400 text-sm">No reviews available for this product.</p>
              </div>
            ):(product.reviews||[]).map((r,i)=>(
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">{(r.reviewerName||'U')[0].toUpperCase()}</div>
                    <span className="text-sm font-semibold text-white">{r.reviewerName||'Verified Buyer'}</span>
                  </div>
                  <StarRating rating={r.rating||4} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.reviewText||r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI */}
        {activeTab==='ai' && (
          <div className="space-y-4">
            {aiLoading && (
              <div className="flex items-center justify-center gap-3 py-16">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-400 text-sm">Analyzing with Gemini AI…</span>
              </div>
            )}
            {!aiLoading && !aiData && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-slate-400 text-sm mb-4">Get AI-powered review analysis and buy recommendations</p>
                <button onClick={fetchAI} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all">Run AI Analysis</button>
              </div>
            )}
            {aiData && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-indigo-300 mb-2">🤖 Gemini AI Verdict</h4>
                  <p className="text-sm text-slate-200 leading-relaxed">{aiData.summary||aiData.verdict||'Strong positive sentiment. Great value for money with reliable delivery across platforms.'}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">✅ Pros</h5>
                    <ul className="space-y-1.5">
                      {(aiData.pros||['Good build quality','Value for money','Fast delivery available']).map((pro,i)=>(
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5 shrink-0">•</span>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">⚠️ Cons</h5>
                    <ul className="space-y-1.5">
                      {(aiData.cons||['May vary by region','Limited warranty support in some areas']).map((con,i)=>(
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5"><span className="text-rose-400 mt-0.5 shrink-0">•</span>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {aiData.sentimentScore!==undefined && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Customer Sentiment Score</span>
                      <span className="font-bold text-indigo-300">{Math.round((aiData.sentimentScore||0.8)*100)}% Positive</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{width:`${Math.round((aiData.sentimentScore||0.8)*100)}%`}} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Related */}
        {related.length>0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-extrabold text-white">🛍️ You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(rp=>{
                const rv=getProductVisual(rp);
                const rPrices=(rp.listings||[]).map(l=>parseFloat(l.price)).filter(Boolean);
                const rLowest=rPrices.length?Math.min(...rPrices):0;
                return (
                  <Link key={rp.id} to={`/product/${rp.id}`}
                    className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/20"
                  >
                    <div className={`h-28 bg-gradient-to-br ${rv.bgGradient} flex items-center justify-center text-4xl group-hover:scale-105 transition-transform`}>{rv.emoji}</div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-bold text-white line-clamp-2">{rp.name}</p>
                      <p className="text-sm font-extrabold text-emerald-400">₹{Number(rLowest).toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

