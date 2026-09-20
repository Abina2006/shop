import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import PlatformAdvisorCard from '../components/PlatformAdvisorCard';
import { sanitizeStoreUrl } from '../utils/urlHelper';
import { getProductVisual } from '../utils/productImages';
import PriceVerificationBadge, { PriceDisclaimerBar } from '../components/PriceVerificationBadge';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
      <span className="text-xs text-slate-300 font-semibold ml-1.5">{Number(rating || 0).toFixed(1)}</span>
    </span>
  );
}

function VerifiedPriceChart({ historyData = [], lowestPrice = 0 }) {
  const allPoints = (historyData || [])
    .flatMap(s => (s.history || []).map(h => ({ ...h, seller: s.sellerName })))
    .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

  if (allPoints.length < 2) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📈</span> Real Verified Price History
          </h3>
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            Initial Tracking
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          ShopWise AI records real price history only when prices are verified with marketplaces. Zero fake data generated.
          {lowestPrice > 0 && ` Current verified market price: ₹${Number(lowestPrice).toLocaleString('en-IN')}.`}
        </p>
      </div>
    );
  }

  const prices = allPoints.map(p => p.price);
  const maxP = Math.max(...prices);
  const minP = Math.min(...prices);
  const range = maxP - minP || 1;
  const W = 400;
  const H = 90;

  const coords = allPoints.map((p, i) => ({
    x: (i / (allPoints.length - 1)) * W,
    y: H - ((p.price - minP) / range) * (H - 20) - 10,
    price: p.price,
    date: p.recordedAt,
    seller: p.seller
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${W},${H} L 0,${H} Z`;
  const isDrop = prices[prices.length - 1] <= prices[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📈</span> Verified Price History (Database Recorded)
          </h3>
          <p className="text-[11px] text-slate-400">Authentic recorded price points — no interpolated or simulated data</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isDrop
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
        }`}>
          {isDrop ? '📉 Price Dropping' : '📈 Recent Trend'} • {allPoints.length} Checkpoints
        </span>
      </div>

      <div className="relative pt-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDrop ? '#10b981' : '#6366f1'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isDrop ? '#10b981' : '#6366f1'} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#priceGradient)" />
          <path d={pathD} fill="none" stroke={isDrop ? '#10b981' : '#6366f1'} strokeWidth="2.5" strokeLinecap="round" />
          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#ffffff" stroke={isDrop ? '#10b981' : '#6366f1'} strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* Historical Checkpoints Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
        {allPoints.slice(-4).map((pt, idx) => (
          <div key={idx} className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">
              {new Date(pt.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
            <span className="font-bold text-slate-200">₹{Number(pt.price).toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-indigo-400 block">{pt.seller}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Single Product Comparison state
  const [singleCompareData, setSingleCompareData] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);

  // Multi-product Comparison state (when comparing multiple products side-by-side)
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedData, setComparedData] = useState([]);
  const [activeAdvisorIndex, setActiveAdvisorIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Determine active product ID from route param or search params
  const activeProductId = productId || (searchParams.get('ids') && !searchParams.get('ids').includes(',') ? searchParams.get('ids') : null);

  // 1. Fetch Single Product Comparison if activeProductId exists
  useEffect(() => {
    if (!activeProductId) return;

    setSingleLoading(true);
    fetch(`${API}/products/${activeProductId}/compare`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSingleCompareData(json.data);
        }
      })
      .catch(err => console.error('[ComparePage] Single compare error:', err))
      .finally(() => setSingleLoading(false));

    fetch(`${API}/products/${activeProductId}/price-history`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setPriceHistory(json.data);
        }
      })
      .catch(() => {});
  }, [activeProductId]);

  // 2. Fetch catalog products for selector
  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAvailableProducts(json.data);

          const idsFromParam = searchParams.get('ids');
          if (idsFromParam && idsFromParam.includes(',')) {
            setSelectedIds(idsFromParam.split(',').map(s => s.trim()).filter(Boolean));
          } else if (!activeProductId && json.data.length >= 2) {
            setSelectedIds(json.data.slice(0, 3).map(p => p.id));
          }
        }
      })
      .catch(() => {});
  }, [activeProductId]);

  // 3. Fetch multi-product comparison if multiple IDs selected
  useEffect(() => {
    if (activeProductId) return;
    if (selectedIds.length === 0) {
      setComparedData([]);
      return;
    }

    setLoading(true);
    fetch(`${API}/products/compare?ids=${selectedIds.join(',')}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setComparedData(json.data);
          if (activeAdvisorIndex >= json.data.length) {
            setActiveAdvisorIndex(0);
          }
        }
      })
      .finally(() => setLoading(false));

    setSearchParams({ ids: selectedIds.join(',') });
  }, [selectedIds, activeProductId]);

  const handleVerifyLivePrice = async () => {
    if (!activeProductId) return;
    setIsVerifying(true);
    setVerifyMessage('');

    try {
      const res = await fetch(`${API}/products/${activeProductId}/verify`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        setSingleCompareData(json.data);
        setVerifyMessage('Live market prices verified with sources!');
        setTimeout(() => setVerifyMessage(''), 4000);
      }
    } catch {
      setVerifyMessage('Live verification failed. Showing last verified prices.');
      setTimeout(() => setVerifyMessage(''), 4000);
    }
    setIsVerifying(false);
  };

  const handleToggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare up to 4 products at a time.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Dedicated Single Product Comparison Mode (Section 21)
  if (activeProductId && singleCompareData) {
    const { product, marketplaces, lowestPrice, bestMarketplace, priceMismatchDetected, priceMismatchDetails } = singleCompareData;
    const visual = getProductVisual(product.name, product.category, product.brand);

    return (
      <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">Compare Prices</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/catalog')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-all font-medium"
            >
              ← Back to Catalog
            </button>
            <button
              onClick={() => {
                setSingleCompareData(null);
                navigate('/compare');
              }}
              className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30 transition-all font-medium"
            >
              Multi-Product Matrix
            </button>
          </div>
        </div>

        {/* Product Identity Header */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Product Image with Image Verification Status (Section 10) */}
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-6xl mb-2 block">{visual.emoji}</span>
                    <span className="text-xs text-slate-500">Image unavailable</span>
                  </div>
                )}
                {product.imageVerified && (
                  <span className="absolute bottom-3 left-3 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    ✓ Verified Image ({product.imageSource || 'marketplace'})
                  </span>
                )}
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Info & Price Summary */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {product.brand} • {product.model || product.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  {product.title}
                </h1>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {product.description || 'Verified product specifications across top Indian marketplaces.'}
                </p>
              </div>

              {/* Verified Lowest Price Callout */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                    Best Verified Market Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-emerald-400">
                      ₹{lowestPrice ? Number(lowestPrice).toLocaleString('en-IN') : 'N/A'}
                    </span>
                    {bestMarketplace && (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        🏆 Best on {bestMarketplace}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleVerifyLivePrice}
                    disabled={isVerifying}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    <span className={isVerifying ? 'animate-spin' : ''}>🔄</span>
                    {isVerifying ? 'Checking...' : 'Re-Verify Prices'}
                  </button>
                  <Link
                    to="/alerts"
                    state={{ productId: product.id, productName: product.title, lowestPrice }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
                  >
                    <span>🔔</span> Alert
                  </Link>
                </div>
              </div>

              {/* Feedback messages */}
              {verifyMessage && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl animate-in fade-in">
                  ✓ {verifyMessage}
                </div>
              )}

              {/* Price Mismatch Banner (Section 16) */}
              {priceMismatchDetected && priceMismatchDetails && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span>⚠️</span> Price mismatch detected
                  </div>
                  <div className="text-slate-300 flex items-center gap-4 flex-wrap">
                    <span>ShopWise Catalog: <strong>₹{Number(priceMismatchDetails.catalogPrice).toLocaleString('en-IN')}</strong></span>
                    <span>Source Current: <strong className="text-amber-400">₹{Number(priceMismatchDetails.verifiedPrice).toLocaleString('en-IN')}</strong></span>
                    <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {priceMismatchDetails.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── PRICE COMPARISON SECTION (Section 21) ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>🏪</span> Marketplace Price Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Verified store listings. Click "Buy" to visit the marketplace; Compare stays inside ShopWise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaces.map((mkt, idx) => {
              const isBest = mkt.marketplace === bestMarketplace && mkt.price === lowestPrice;
              const isAvailable = mkt.priceStatus !== 'UNAVAILABLE' && mkt.price > 0;

              return (
                <div
                  key={idx}
                  className={`bg-slate-900/90 rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                    isBest
                      ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Store Name & Best Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {mkt.marketplace === 'Amazon' ? '📦' :
                           mkt.marketplace === 'Flipkart' ? '🛒' :
                           mkt.marketplace === 'Meesho' ? '🛍️' :
                           mkt.marketplace === 'Croma' ? '⚡' : '👗'}
                        </span>
                        <span className="font-extrabold text-base text-white">{mkt.marketplace}</span>
                      </div>
                      {isBest && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          BEST DEAL 🏆
                        </span>
                      )}
                    </div>

                    {/* Price Display */}
                    <div>
                      {isAvailable ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white">
                            ₹{Number(mkt.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-500">INR</span>
                        </div>
                      ) : (
                        <div className="text-slate-400 font-semibold text-sm">
                          Price unavailable
                          <span className="block text-[11px] text-slate-500">⚠ Unable to verify</span>
                        </div>
                      )}
                    </div>

                    {/* Verification Status Badge (Section 15) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {mkt.priceStatus === 'VERIFIED' && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>✓</span> Verified Price
                        </span>
                      )}
                      {mkt.priceStatus === 'UNVERIFIED' && (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>⚠</span> Unverified (Search Link)
                        </span>
                      )}
                      {mkt.priceStatus === 'STALE' && (
                        <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>🕒</span> Stale Price
                        </span>
                      )}
                      {mkt.priceStatus === 'UNAVAILABLE' && (
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                          ⚪ Unavailable
                        </span>
                      )}

                      {/* Match Score Indicator (Section 9) */}
                      {mkt.matchScore !== null && (
                        <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                          {mkt.matchScore}% Match
                        </span>
                      )}
                    </div>

                    {/* Last Checked */}
                    {mkt.lastChecked && (
                      <div className="text-[10px] text-slate-500">
                        Last checked: {new Date(mkt.lastChecked).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  {/* BUY BUTTON (Section 4: Only Buy opens external URL) */}
                  <div className="pt-3 border-t border-slate-800/80">
                    {isAvailable && mkt.productUrl ? (
                      <button
                        onClick={() => {
                          const url = sanitizeStoreUrl(mkt.productUrl, product.title, mkt.marketplace);
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isBest
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                        }`}
                      >
                        <span>🛒</span> Buy on {mkt.marketplace} ↗
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800"
                      >
                        Not Available on {mkt.marketplace}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VERIFIED PRICE HISTORY CHART (Section 17) ── */}
        <VerifiedPriceChart historyData={priceHistory} lowestPrice={lowestPrice} />
      </div>
    );
  }

  // Multi-Product Matrix View (Fallback / Comparison Tool)
  const currentAdvisorProduct = comparedData[activeAdvisorIndex] || comparedData[0];
  const categories = ['All', ...Array.from(new Set(availableProducts.map(p => p.category))).filter(Boolean)];
  const filteredAvailable = availableProducts.filter(prod => {
    const matchesSearch = !searchQuery || prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || prod.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-indigo-500/20">
          <span>🤖</span> Multi-Store Price Comparison Matrix
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Product Price & Platform Comparison
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Compare verified prices across Amazon, Flipkart, Meesho, Croma, and Myntra. Compare stays inside ShopWise.
        </p>
      </div>

      {/* Product Selector Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select products to compare (Selected: {selectedIds.length}/4)
            </span>
            <p className="text-[11px] text-slate-500">Filter by category or search by name</p>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors self-start sm:self-auto"
            >
              Clear all ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 text-xs text-white placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950/80 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Pills for Products */}
        <div className="flex flex-wrap gap-2 pt-2 max-h-40 overflow-y-auto">
          {filteredAvailable.map(prod => {
            const isSelected = selectedIds.includes(prod.id);
            return (
              <button
                key={prod.id}
                onClick={() => handleToggleProduct(prod.id)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span className="truncate max-w-[200px]">{prod.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      {comparedData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-48">Feature</th>
                  {comparedData.map(p => (
                    <th key={p.id} className="p-5 border-l border-slate-800 text-sm font-bold text-white">
                      <div className="space-y-2">
                        <span className="block text-xs text-indigo-400">{p.brand}</span>
                        <span className="line-clamp-2">{p.name}</span>
                        <Link
                          to={`/compare/${p.id}`}
                          className="inline-block text-[11px] text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-all"
                        >
                          View Full Store Breakdown →
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                <tr>
                  <td className="p-5 font-bold text-slate-400 uppercase">Best Price</td>
                  {comparedData.map(p => (
                    <td key={p.id} className="p-5 border-l border-slate-800 font-extrabold text-lg text-emerald-400">
                      ₹{Number(p.minPrice || 0).toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-5 font-bold text-slate-400 uppercase">Rating</td>
                  {comparedData.map(p => (
                    <td key={p.id} className="p-5 border-l border-slate-800">
                      <StarRating rating={p.avgRating || 4.5} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-5 font-bold text-slate-400 uppercase">Store Options</td>
                  {comparedData.map(p => (
                    <td key={p.id} className="p-5 border-l border-slate-800 space-y-2">
                      {(p.listings || []).map(l => (
                        <div key={l.id} className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <span className="font-semibold text-slate-200">{l.sellerName}</span>
                          <div className="text-right">
                            <span className="font-bold text-indigo-300">₹{Number(l.price).toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => {
                                const url = sanitizeStoreUrl(l.sellerUrl, p.name, l.sellerName);
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }}
                              className="block text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                            >
                              Buy ↗
                            </button>
                          </div>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
