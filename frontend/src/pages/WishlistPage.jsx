import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductVisual } from '../utils/productImages';

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
      <span className="text-xs text-slate-400 ml-1 font-semibold">{Number(rating || 0).toFixed(1)}</span>
    </span>
  );
}

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [enriched, setEnriched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const storageKey = `wishlist_${user?.id || 'guest'}`;

  const loadWishlist = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  };

  // Fetch live product data for wishlisted items to get fresh prices
  const enrichProducts = async (items) => {
    if (!items.length) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const json = await res.json();
      if (json.success && json.data) {
        const map = {};
        json.data.forEach(p => { map[p.id] = p; });
        const result = items.map(w => map[w.id] || w);
        setEnriched(result);
      } else {
        setEnriched(items);
      }
    } catch {
      setEnriched(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  useEffect(() => {
    enrichProducts(wishlist);
  }, [wishlist]);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(p => p.id !== productId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setWishlist(updated);
    showToast('Removed from wishlist');
  };

  const clearAll = () => {
    localStorage.removeItem(storageKey);
    setWishlist([]);
    setEnriched([]);
    showToast('Wishlist cleared');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const products = enriched.length ? enriched : wishlist;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white text-sm px-5 py-2.5 rounded-2xl shadow-2xl animate-in fade-in duration-200">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">❤️</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Wishlist</h1>
              {products.length > 0 && (
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  {products.length} item{products.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              {isAuthenticated
                ? `Saved products for ${user?.name} · prices update live`
                : 'Guest wishlist · sign in to sync across devices'}
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/compare?ids=' + products.slice(0, 4).map(p => p.id).join(','))}
                className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                📊 Compare All
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                🗑️ Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-24 px-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl">
              🛍️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              Browse products and click the ❤️ heart icon to save them here for later. Compare prices across Meesho, Flipkart, Amazon, Croma & Myntra.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
            >
              🛒 Browse Products
            </Link>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-800 rounded-xl w-3/4" />
                  <div className="h-3 bg-slate-800 rounded-xl w-1/2" />
                  <div className="h-8 bg-slate-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const visual = getProductVisual(product);
              const listings = product.listings || [];
              const prices = listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
              const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
              const savings = highestPrice > lowestPrice
                ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
                : 0;
              const bestStore = listings.find(l => parseFloat(l.price) === lowestPrice);
              const avgRating = listings.length > 0
                ? listings.reduce((a, l) => a + (parseFloat(l.rating) || 0), 0) / listings.length
                : 0;

              return (
                <div
                  key={product.id}
                  className={`group relative bg-gradient-to-br ${visual.bgGradient} border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20 hover:-translate-y-0.5 flex flex-col`}
                >
                  {/* Savings badge */}
                  {savings > 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
                      SAVE {savings}%
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white text-xs flex items-center justify-center transition-all shadow-md"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>

                  {/* Product Image / Emoji Card */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl || visual.fallbackImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (e.target.src !== visual.fallbackImg && visual.fallbackImg) {
                          e.target.src = visual.fallbackImg;
                        } else {
                          e.target.style.display = 'none';
                          if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div
                      className="hidden w-full h-full items-center justify-center bg-gradient-to-br"
                    >
                      <span className="text-6xl">{visual.emoji}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className={`inline-flex items-center gap-1.5 self-start bg-gradient-to-r ${visual.badgeColor} px-2 py-0.5 rounded-full`}>
                      <span className="text-[10px]">{visual.emoji}</span>
                      <span className="text-[10px] font-bold text-white">{product.category || visual.tag}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                      {product.name}
                    </h3>

                    {avgRating > 0 && <StarRating rating={avgRating} />}

                    {/* Price Display */}
                    <div className="mt-auto pt-2 border-t border-slate-800/60">
                      {lowestPrice > 0 ? (
                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-[10px] text-slate-500 mb-0.5">Best price</p>
                            <p className="text-xl font-extrabold text-white">
                              ₹{lowestPrice.toLocaleString('en-IN')}
                            </p>
                            {bestStore && (
                              <p className="text-[10px] text-emerald-400 font-semibold">
                                on {bestStore.sellerName}
                              </p>
                            )}
                          </div>
                          {listings.length > 1 && (
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500">{listings.length} stores</p>
                              <p className="text-xs text-slate-400 line-through">
                                ₹{highestPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-xs">Price unavailable</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                      >
                        View Details →
                      </Link>
                      <Link
                        to={`/compare/${product.id}`}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                        title="Compare prices across stores"
                      >
                        <span>⚖️</span> Compare
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        {!loading && products.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
