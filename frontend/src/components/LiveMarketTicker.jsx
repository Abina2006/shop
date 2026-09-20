import React from 'react';
import { useRealtimeFeed } from '../hooks/useRealtimeFeed';

export default function LiveMarketTicker() {
  const { isConnected, tickerEvents } = useRealtimeFeed();

  const defaultItems = [
    { id: '1', formattedChange: '⚡ Live Stream Connected — Ready for incoming e-commerce data', change: 'info' },
    { id: '2', formattedChange: '🕷️ Paste any product URL to extract live pricing, ratings & customer reviews', change: 'info' },
  ];

  const items = tickerEvents.length > 0 ? tickerEvents : defaultItems;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 flex items-center justify-between overflow-hidden shadow-inner">
      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {isConnected ? 'LIVE FEED' : 'CONNECTING...'}
        </span>
        <span className="hidden sm:inline-block text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
          Real-Time Market Activity:
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden mx-4">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {items.map((evt, idx) => (
            <div key={evt.id || idx} className="inline-flex items-center gap-2 text-slate-300 font-medium">
              <span className={`font-semibold ${evt.change === 'drop' ? 'text-emerald-400' : evt.change === 'rise' ? 'text-rose-400' : 'text-indigo-400'}`}>
                {evt.formattedChange}
              </span>
              {evt.timestamp && <span className="text-slate-500 text-[10px]">[{evt.timestamp}]</span>}
              <span className="text-slate-700 font-normal">|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
        <span>Auto-Sync Active</span>
      </div>
    </div>
  );
}
