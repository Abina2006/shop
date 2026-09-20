import React, { useState, useEffect } from 'react';
import { sanitizeStoreUrl } from '../utils/urlHelper';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function PriceAdvisorModal({ product, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;
    const fetchAdvisor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/products/${product.id}/smart-advisor`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (e) {
        console.error('Error loading advisor data:', e);
      }
      setLoading(false);
    };
    fetchAdvisor();
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">AI Smart Shopping Assistant & Price Trend</h2>
              <p className="text-xs text-indigo-400 font-medium">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-block animate-spin text-3xl">⚙️</div>
            <p className="text-indigo-300 text-sm font-semibold">Analyzing historical price cycles, stock trends & discount predictions...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">

            {/* Smart Buying Verdict Banner */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow">
                  <span>🎯</span> {data.action?.title}
                </span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {data.action?.confidenceScore}% AI Confidence Score
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {data.action?.prediction}
              </p>
            </div>

            {/* 30-Day Interactive Historical Price Graph */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📈</span> 30-Day Historical Price Graph
                </h3>
                <span className="text-[11px] text-emerald-400 font-bold">
                  Current: ₹{Number(data.currentLowestPrice).toLocaleString('en-IN')} (Lowest)
                </span>
              </div>

              {/* Visual SVG Price Trend */}
              <div className="relative pt-4 pb-2">
                <div className="grid grid-cols-5 gap-2 text-center items-end h-28 border-b border-slate-800 pb-2">
                  {data.priceHistoryGraph?.map((pt, i) => {
                    const maxP = Math.max(...data.priceHistoryGraph.map(p => p.price));
                    const minP = Math.min(...data.priceHistoryGraph.map(p => p.price));
                    const heightPct = Math.max(30, Math.round(((pt.price - minP) / (maxP - minP || 1)) * 60 + 35));
                    const isLowest = pt.price === minP;
                    return (
                      <div key={i} className="flex flex-col items-center justify-end h-full group">
                        <span className={`text-[10px] font-bold mb-1 transition-all ${isLowest ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}>
                          ₹{pt.price}
                        </span>
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                            isLowest
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/30'
                              : 'bg-gradient-to-t from-indigo-900/80 to-indigo-600/70 hover:from-indigo-800 hover:to-indigo-500'
                          }`}
                        />
                        <span className="text-[9px] text-slate-500 mt-2 truncate w-full">{pt.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Store Value Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏪</span> Real-Time Store Comparison & Delivery Matrix
              </h3>
              <div className="grid gap-2.5">
                {data.storeMatrix?.map((st, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      st.isLowest
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{st.store}</span>
                        {st.isLowest && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                            BEST DEAL 🏆
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          🛡️ {st.trustScore}% Trust
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                        <span>🚚 {st.deliveryDays}</span>
                        <span>🔄 {st.returnPolicy}</span>
                        <span className="text-indigo-400 font-medium">🎁 {st.activeOffer}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className={`text-base font-extrabold ${st.isLowest ? 'text-emerald-400' : 'text-white'}`}>
                        ₹{Number(st.price).toLocaleString('en-IN')}
                      </span>
                      <a
                        href={sanitizeStoreUrl(st.storeUrl, product?.name, st.store)}
                        target="_blank"
                        rel="noreferrer noopener"
                        referrerPolicy="no-referrer"
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow ${
                          st.isLowest
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                            : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        Buy on {st.store} ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">Could not load AI Advisor data.</p>
        )}

      </div>
    </div>
  );
}
