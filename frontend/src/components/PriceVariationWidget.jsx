import React from 'react';
import PriceVerificationBadge from './PriceVerificationBadge';
import { sanitizeStoreUrl } from '../utils/urlHelper';

/**
 * PriceVariationWidget
 *
 * Visualizes the price variation / spread across sellers (Amazon, Flipkart, Meesho, Croma, Myntra).
 * Highlights lowest price, average price, price spread, and seller price differences.
 */
export default function PriceVariationWidget({ product, listings = [] }) {
  if (!listings || listings.length === 0) return null;

  const validListings = listings.filter(l => parseFloat(l.price) > 0);
  if (validListings.length === 0) return null;

  const prices = validListings.map(l => parseFloat(l.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const priceSpread = maxPrice - minPrice;
  const variationPct = maxPrice > 0 ? Math.round((priceSpread / maxPrice) * 100) : 0;

  const lowestListing = validListings.find(l => parseFloat(l.price) === minPrice) || validListings[0];

  // Volatility classification
  let statusBadge = {
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    title: '✓ Consistent Pricing Across Stores',
    sub: `Minimal price difference (only ${variationPct}% spread across ${validListings.length} stores).`,
  };

  if (variationPct >= 25) {
    statusBadge = {
      color: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
      title: `🔥 High Price Variation (${variationPct}% Spread)`,
      sub: `You save ₹${priceSpread.toLocaleString('en-IN')} by buying from ${lowestListing.sellerName} instead of the highest-priced store!`,
    };
  } else if (variationPct >= 10) {
    statusBadge = {
      color: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
      title: `⚡ Moderate Price Variation (${variationPct}% Spread)`,
      sub: `Compare sellers below — buy from ${lowestListing.sellerName} to save ₹${priceSpread.toLocaleString('en-IN')}.`,
    };
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              📊 Multi-Store Price Variation Analysis
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
              {statusBadge.title}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
            {statusBadge.sub}
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Lowest */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">🏆 Lowest Price</span>
          <div className="text-2xl font-black text-emerald-300">₹{minPrice.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400/80 block truncate">on {lowestListing.sellerName}</span>
        </div>

        {/* Average */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">📈 Market Average</span>
          <div className="text-2xl font-extrabold text-slate-200">₹{avgPrice.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400 block truncate">across {validListings.length} stores</span>
        </div>

        {/* Highest */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">🏷️ Highest Price</span>
          <div className="text-2xl font-extrabold text-slate-400">₹{maxPrice.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 block truncate">peak store rate</span>
        </div>

        {/* Variation Spread */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">💰 Max Savings Spread</span>
          <div className="text-2xl font-black text-indigo-300">₹{priceSpread.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-indigo-400/80 block font-bold">({variationPct}% difference)</span>
        </div>
      </div>

      {/* Seller Breakdown Matrix */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          🏪 Seller Price Comparison Matrix
        </h4>

        <div className="space-y-2">
          {validListings.map((listing, i) => {
            const price = parseFloat(listing.price);
            const isLowest = price === minPrice;
            const diff = price - minPrice;
            const diffPct = minPrice > 0 ? Math.round((diff / minPrice) * 100) : 0;
            const mktUrl = sanitizeStoreUrl(listing.sellerUrl, product?.name, listing.sellerName);

            return (
              <div
                key={listing.id || i}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  isLowest
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold ${
                      isLowest ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    🏪
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{listing.sellerName}</span>
                      {isLowest && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          🏆 BEST DEAL
                        </span>
                      )}
                      <PriceVerificationBadge
                        compact
                        verificationStatus={listing.verificationStatus || 'reference'}
                        lastCheckedAt={listing.lastCheckedAt}
                        sellerName={listing.sellerName}
                        marketplaceUrl={mktUrl}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {listing.offers || 'Standard seller warranty'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className={`text-base font-black ${isLowest ? 'text-emerald-400' : 'text-slate-200'}`}>
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                    {isLowest ? (
                      <span className="text-[10px] text-emerald-400 font-bold block">Lowest Market Rate</span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold block">
                        +₹{diff.toLocaleString('en-IN')} (+{diffPct}%) higher
                      </span>
                    )}
                  </div>

                  {mktUrl && mktUrl !== '#' ? (
                    <a
                      href={mktUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      referrerPolicy="no-referrer"
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shrink-0 ${
                        isLowest
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700'
                      }`}
                    >
                      View ↗
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium">Link Unavailable</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
