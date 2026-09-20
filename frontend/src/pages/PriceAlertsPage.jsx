import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sanitizeStoreUrl } from '../utils/urlHelper';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function PriceAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  
  // New Alert Form state
  const [alertMode, setAlertMode] = useState('catalog'); // 'catalog' | 'url'
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customProductUrl, setCustomProductUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [notificationEmail, setNotificationEmail] = useState(user?.email || '');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/price-alerts?userId=${user?.id || ''}&email=${encodeURIComponent(user?.email || '')}`);
      const json = await res.json();
      if (json.success) {
        setAlerts(json.data || []);
      }
    } catch {
      /* silent */
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const json = await res.json();
      if (json.success && json.data) {
        setProducts(json.data);
        if (json.data.length > 0 && !selectedProductId) {
          setSelectedProductId(json.data[0].id);
          const lowest = parseFloat(json.data[0].listings?.[0]?.price) || 1000;
          setTargetPrice(Math.round(lowest * 0.9));
        }
      }
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchProducts();
  }, [user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleProductSelectChange = (id) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod && prod.listings?.[0]) {
      const lowest = parseFloat(prod.listings[0].price) || 1000;
      setTargetPrice(Math.round(lowest * 0.9));
    }
  };

  const handleUrlInputChange = (url) => {
    setCustomProductUrl(url);
    // Auto-detect if a catalog product already has this URL
    if (url.trim()) {
      const cleanUrl = url.toLowerCase();
      const matched = products.find(p => 
        (p.listings || []).some(l => (l.sellerUrl || '').toLowerCase().includes(cleanUrl.split('?')[0]))
      );
      if (matched && matched.listings?.[0]) {
        setSelectedProductId(matched.id);
        const lowest = parseFloat(matched.listings[0].price) || 1000;
        setTargetPrice(Math.round(lowest * 0.9));
      }
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (alertMode === 'catalog' && (!selectedProductId || !targetPrice)) {
      setFormError('Please select a product and target price.');
      return;
    }
    if (alertMode === 'url' && (!customProductUrl.trim() || !targetPrice)) {
      setFormError('Please paste a valid Flipkart / Amazon / Store product URL and target price.');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      const res = await fetch(`${API}/price-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: alertMode === 'catalog' ? selectedProductId : undefined,
          productUrl: alertMode === 'url' ? customProductUrl.trim() : undefined,
          targetPrice: parseFloat(targetPrice),
          email: notificationEmail || user?.email,
          userId: user?.id
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('🔔 Price drop alert activated successfully!');
        if (alertMode === 'url') setCustomProductUrl('');
        fetchAlerts();
      } else {
        setFormError(json.message || 'Failed to activate alert.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    }
    setCreating(false);
  };

  const handleToggleAlert = async (id) => {
    try {
      const res = await fetch(`${API}/price-alerts/${id}/toggle`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
        showToast(json.message);
      }
    } catch {
      /* silent */
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      const res = await fetch(`${API}/price-alerts/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAlerts(prev => prev.filter(a => a.id !== id));
        showToast('🗑️ Price alert removed.');
      }
    } catch {
      /* silent */
    }
  };

  const handleSaveEditPrice = async (id) => {
    if (!editPrice || isNaN(editPrice)) return;
    try {
      const res = await fetch(`${API}/price-alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPrice: parseFloat(editPrice) })
      });
      const json = await res.json();
      if (json.success) {
        setEditingId(null);
        showToast('✅ Target price updated!');
        fetchAlerts();
      }
    } catch {
      /* silent */
    }
  };

  const handleTestEmailDispatch = async (id, prodName) => {
    try {
      showToast(`📤 Sending test alert email for "${prodName.substring(0, 25)}..."`);
      const res = await fetch(`${API}/price-alerts/${id}/test-trigger`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(`📬 ${json.message}`);
      }
    } catch {
      showToast('❌ Test email dispatch failed.');
    }
  };

  // Metrics
  const totalActive = alerts.filter(a => a.isActive).length;
  const triggeredCount = alerts.filter(a => a.isTriggered && a.isActive).length;
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedLowest = selectedProduct ? parseFloat(selectedProduct.listings?.[0]?.price) || 0 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 px-4 pt-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-indigo-200 text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
            <span>✨</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-amber-500/20">
              <span>🔔</span> Real-Time Price Drop Monitor
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Price Alerts Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Set target price thresholds. We automatically track Flipkart, Meesho, Amazon & Croma and alert you when deals drop.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block font-medium">Monitored</span>
              <span className="text-xl font-extrabold text-white">{totalActive}</span>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-xs text-emerald-400 block font-medium">Target Reached</span>
              <span className="text-xl font-extrabold text-emerald-300">{triggeredCount}</span>
            </div>
          </div>
        </div>

        {/* Single Rectangular Box with 3 Integrated Options */}
        <div className="bg-slate-900/90 border-2 border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base">⚡</span>
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                Set a New Price Drop Alert
              </h2>
            </div>

            {/* Mode Switch: Catalog vs URL Paste */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAlertMode('catalog')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  alertMode === 'catalog'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📦</span> Pick from Catalog
              </button>
              <button
                type="button"
                onClick={() => setAlertMode('url')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  alertMode === 'url'
                    ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔗</span> Paste Flipkart / Store URL
              </button>
            </div>
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* Unified 3-Option Rectangular Row */}
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              
              {/* Option 1: Product Selection or URL Paste Input */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {alertMode === 'catalog' ? '1. Select Product' : '1. Paste Product URL (Flipkart / Amazon / Meesho)'}
                  </span>
                  {alertMode === 'url' && (
                    <span className="text-[10px] text-amber-400 font-semibold">Flipkart & All Stores Supported</span>
                  )}
                </div>

                {alertMode === 'catalog' ? (
                  <select
                    value={selectedProductId}
                    onChange={e => handleProductSelectChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-indigo-500 font-medium transition-colors cursor-pointer"
                  >
                    {products.map(p => {
                      const minP = parseFloat(p.listings?.[0]?.price || 0);
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} (Best: ₹{minP.toLocaleString('en-IN')})
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="url"
                      value={customProductUrl}
                      onChange={e => handleUrlInputChange(e.target.value)}
                      placeholder="https://www.flipkart.com/... or Amazon / Meesho link"
                      className="w-full bg-slate-900 border border-orange-500/40 text-white text-xs rounded-xl pl-3.5 pr-8 py-3 focus:outline-none focus:border-orange-400 font-medium transition-colors placeholder:text-slate-500"
                      required
                    />
                    {customProductUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomProductUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Target Price (₹) Input */}
              <div className="lg:col-span-3 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    2. Target Price (₹)
                  </span>
                  {selectedLowest > 0 && alertMode === 'catalog' && (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Now: ₹{selectedLowest.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={e => setTargetPrice(e.target.value)}
                  placeholder="e.g. 1199"
                  className="w-full bg-slate-900 border border-slate-700/80 text-amber-300 text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              {/* Option 3: Activate Alert CTA Action */}
              <div className="lg:col-span-3 flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full h-[42px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {creating ? (
                    <>
                      <span className="animate-spin text-sm">⚙️</span>
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <span>🔔</span>
                      <span>Activate Alert</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Quick Preset Buttons (5%, 10%, 15%, 20% Off) */}
            {selectedLowest > 0 && alertMode === 'catalog' && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                <span className="font-semibold text-slate-500">Quick Target:</span>
                {[
                  { label: '5% Off', pct: 0.95 },
                  { label: '10% Off', pct: 0.90 },
                  { label: '15% Off', pct: 0.85 },
                  { label: '20% Off', pct: 0.80 }
                ].map(preset => {
                  const targetVal = Math.round(selectedLowest * preset.pct);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTargetPrice(targetVal)}
                      className="bg-slate-800/80 hover:bg-slate-750 text-indigo-300 border border-slate-700/60 px-2.5 py-1 rounded-lg transition-colors font-bold text-[11px]"
                    >
                      {preset.label} (₹{targetVal.toLocaleString('en-IN')})
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>

        {/* Alerts List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-white">
              Tracked Product Alerts ({alerts.length})
            </h2>
            <button
              onClick={fetchAlerts}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>🔄</span> Refresh Rates
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin text-3xl mb-2">⚙️</div>
              <p className="text-slate-400 text-xs">Loading your price alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 p-6">
              <span className="text-5xl block mb-3">🔕</span>
              <h3 className="text-base font-bold text-white mb-1">No Active Price Alerts</h3>
              <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
                Select any product above or browse the catalog to set price drop notifications.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alerts.map(alert => {
                const diff = alert.priceDifference;
                const hit = alert.isTriggered;

                return (
                  <div
                    key={alert.id}
                    className={`bg-slate-900 rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                      hit
                        ? 'border-emerald-500/60 shadow-emerald-950/30'
                        : alert.isActive
                        ? 'border-slate-800 hover:border-indigo-500/40'
                        : 'border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase bg-slate-800 text-indigo-400 px-2 py-0.5 rounded border border-slate-700">
                          {alert.category || 'Product'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {hit ? (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              TARGET REACHED 🎉
                            </span>
                          ) : (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              ⏳ Monitoring (-₹{diff.toLocaleString('en-IN')} to hit)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="flex gap-3 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700/80 flex items-center justify-center">
                          {alert.imageUrl ? (
                            <img
                              src={alert.imageUrl}
                              alt={alert.productName}
                              className="w-full h-full object-cover"
                              onError={e => e.target.style.display = 'none'}
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {alert.productName}
                          </h3>
                          <span className="text-[11px] text-slate-500">{alert.brand}</span>
                        </div>
                      </div>

                      {/* Price Comparison Block */}
                      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Current Best Price:</span>
                          <span className="font-extrabold text-white">
                            ₹{alert.currentPrice.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Your Target Threshold:</span>
                          {editingId === alert.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editPrice}
                                onChange={e => setEditPrice(e.target.value)}
                                className="w-20 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded border border-amber-500"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEditPrice(alert.id)}
                                className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-amber-400">
                                ₹{alert.targetPrice.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingId(alert.id);
                                  setEditPrice(alert.targetPrice);
                                }}
                                title="Edit Target Price"
                                className="text-[10px] text-slate-500 hover:text-slate-300"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Progress Gauge */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              hit ? 'bg-emerald-400 w-full' : 'bg-amber-400'
                            }`}
                            style={{
                              width: hit ? '100%' : `${Math.min(100, Math.round((alert.targetPrice / alert.currentPrice) * 100))}%`
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Winning Store: <strong className="text-slate-300">{alert.winningStore}</strong></span>
                          <span>🚚 {alert.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/80">
                      <div className="flex gap-2">
                        {alert.winningUrl && (
                          <a
                            href={sanitizeStoreUrl(alert.winningUrl, alert.productName, alert.winningStore)}
                            target="_blank"
                            rel="noreferrer noopener"
                            referrerPolicy="no-referrer"
                            className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
                              hit
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                                : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700'
                            }`}
                          >
                            Buy on {alert.winningStore} ↗
                          </a>
                        )}

                        <button
                          onClick={() => handleTestEmailDispatch(alert.id, alert.productName)}
                          title="Simulate email dispatch right now"
                          className="bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        >
                          ✉️ Test Email
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          onClick={() => handleToggleAlert(alert.id)}
                          className={`text-[11px] font-semibold transition-colors ${
                            alert.isActive ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                          }`}
                        >
                          {alert.isActive ? '⏸ Pause Alert' : '▶️ Resume Alert'}
                        </button>

                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                        >
                          ✕ Delete Alert
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
