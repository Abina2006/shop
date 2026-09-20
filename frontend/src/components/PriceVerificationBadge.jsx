import React, { useState } from 'react';

/**
 * PriceVerificationBadge
 *
 * Displays a transparent, honest badge indicating whether a price is:
 *   - "verified"  : confirmed from a live data source within 24h (green)
 *   - "reference" : catalog/manual price, may differ from current marketplace (yellow)
 *   - "stale"     : not updated in 48h+, likely outdated (red)
 *
 * Always provides a "Check Live Price" link to the real marketplace.
 *
 * Props:
 *   verificationStatus: 'verified' | 'reference' | 'stale'
 *   priceSource: 'catalog' | 'manual' | 'api'
 *   lastUpdated: ISO string
 *   priceVerifiedAt: ISO string | null
 *   sellerName: string
 *   marketplaceUrl: string  (real marketplace search URL)
 *   compact: boolean        (small inline version)
 */
export default function PriceVerificationBadge({
  verificationStatus = 'reference',
  priceSource = 'catalog',
  lastUpdated,
  lastCheckedAt,
  priceVerifiedAt,
  sellerName = '',
  marketplaceUrl = '',
  compact = false,
  onRefresh = null,
  isRefreshing = false,
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  function timeAgo(isoString) {
    if (!isoString) return null;
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  }

  const checkTime = timeAgo(lastCheckedAt || priceVerifiedAt || lastUpdated);
  const statusKey = String(verificationStatus).toLowerCase();

  const config = {
    verified: {
      bg: 'bg-emerald-500/15 border-emerald-500/40',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      icon: '✓',
      label: 'Recently Verified',
      tooltip: `Price confirmed from live data source. Last checked: ${checkTime || 'just now'}.`,
    },
    stale: {
      bg: 'bg-amber-500/15 border-amber-500/40',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      icon: '⚠',
      label: 'Price May Have Changed',
      tooltip: `Price data is stale (last checked ${checkTime || 'some time ago'}). Current marketplace price may differ.`,
    },
    verification_failed: {
      bg: 'bg-rose-500/15 border-rose-500/40',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      icon: '✕',
      label: 'Unable to Verify Current Price',
      tooltip: `Live verification encountered an error. Showing last successfully verified price from ${checkTime || 'catalog'}.`,
    },
    unavailable: {
      bg: 'bg-slate-500/15 border-slate-500/40',
      text: 'text-slate-400',
      dot: 'bg-slate-400',
      icon: '⚪',
      label: 'Currently Unavailable',
      tooltip: 'This item is currently unavailable or out of stock on the marketplace.',
    },
    reference: {
      bg: 'bg-indigo-500/15 border-indigo-500/40',
      text: 'text-indigo-400',
      dot: 'bg-indigo-400',
      icon: '◎',
      label: 'Catalog Reference',
      tooltip: `Catalog reference price. Last checked: ${checkTime || 'recently'}. Always verify on marketplace before purchase.`,
    },
  };

  const c = config[statusKey] || config.reference;

  if (compact) {
    return (
      <span className="relative inline-flex items-center gap-1">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} cursor-help`}
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
          {c.label} {checkTime ? `(${checkTime})` : ''}
        </span>
        {tooltipOpen && (
          <span className="absolute z-50 bottom-full left-0 mb-1.5 w-60 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] leading-relaxed rounded-xl p-2.5 shadow-2xl pointer-events-none">
            {c.tooltip}
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border px-3.5 py-2.5 ${c.bg} flex flex-col gap-2`}>
      <div className="flex items-center justify-between gap-2">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${c.text}`}>
          <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse shrink-0`} />
          <span>{c.icon} {c.label}</span>
        </div>
        {checkTime && (
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">
            Last checked: {checkTime}
          </span>
        )}
      </div>

      <p className="text-[10px] text-slate-300 leading-relaxed">
        {c.tooltip}
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/40">
        {marketplaceUrl && marketplaceUrl !== '#' ? (
          <a
            href={marketplaceUrl}
            target="_blank"
            rel="noreferrer noopener"
            referrerPolicy="no-referrer"
            className={`inline-flex items-center gap-1 text-[11px] font-bold ${c.text} hover:underline`}
          >
            View on {sellerName || 'Marketplace'} ↗
          </a>
        ) : (
          <span className="text-[10px] text-slate-500 font-medium">
            Marketplace link unavailable
          </span>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all disabled:opacity-50"
          >
            <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>
    </div>
  );
}

export function PriceDisclaimerBar({ verificationStatus = 'reference', lastUpdated, lastCheckedAt, sellerName, marketplaceUrl }) {
  function timeAgo(isoString) {
    if (!isoString) return null;
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  }

  const ago = timeAgo(lastCheckedAt || lastUpdated);
  const statusKey = String(verificationStatus).toLowerCase();

  const messages = {
    verified: `✓ Price verified${ago ? ` · last checked ${ago}` : ''}`,
    stale: `⚠ Price may have changed${ago ? ` · last checked ${ago}` : ''}`,
    verification_failed: `✕ Unable to verify current price${ago ? ` · showing price from ${ago}` : ''}`,
    unavailable: `⚪ Listing unavailable`,
    reference: `◎ Reference price${ago ? ` · last checked ${ago}` : ''}`,
  };

  const colors = {
    verified: 'text-emerald-400/90',
    stale: 'text-amber-400/90',
    verification_failed: 'text-rose-400/90',
    unavailable: 'text-slate-400/90',
    reference: 'text-indigo-400/90',
  };

  return (
    <div className={`flex items-center justify-between text-[10px] font-semibold ${colors[statusKey] || colors.reference}`}>
      <span>{messages[statusKey] || messages.reference}</span>
      {marketplaceUrl && marketplaceUrl !== '#' ? (
        <a
          href={marketplaceUrl}
          target="_blank"
          rel="noreferrer noopener"
          referrerPolicy="no-referrer"
          className="underline hover:no-underline shrink-0 ml-2 font-bold"
        >
          View on {sellerName || 'Marketplace'} ↗
        </a>
      ) : (
        <span className="text-slate-500 ml-2">Link unavailable</span>
      )}
    </div>
  );
}
