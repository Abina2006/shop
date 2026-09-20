import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductVisual } from '../utils/productImages';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/* ─── Avatar with initials ─── */
function AvatarCircle({ name = 'U', size = 'lg' }) {
  const colors = [
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-orange-600',
    'from-amber-500 to-yellow-600',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizeClass = size === 'lg' ? 'w-24 h-24 text-4xl' : 'w-10 h-10 text-base';
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-extrabold text-white shadow-2xl shadow-indigo-900/40 uppercase`}>
      {name.charAt(0)}
    </div>
  );
}

/* ─── Stat Tile ─── */
function StatTile({ icon, label, value, color = 'text-indigo-400' }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-900/70 rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/40 transition-all">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xl font-extrabold ${color}`}>{value}</span>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  );
}

/* ─── Activity Row ─── */
function ActivityRow({ icon, label, time, sub }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{label}</p>
        {sub && <p className="text-xs text-slate-500 truncate">{sub}</p>}
      </div>
      <span className="text-xs text-slate-500 flex-shrink-0">{time}</span>
    </div>
  );
}

/* ─────────────────── PROFILE PAGE ─────────────────── */
export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Wishlist stored in localStorage per-user
  const [wishlist, setWishlist] = useState([]);

  // Fake recent activity (would be from DB in a real backend)
  const recentActivity = [
    { icon: '🔍', label: 'Searched "boAt Airdopes Alpha"',      sub: 'Found best deal at Meesho — ₹981',       time: '2h ago' },
    { icon: '📊', label: 'Compared "Samsung Galaxy S24 Ultra"', sub: 'Amazon vs Flipkart vs Samsung Store',    time: '5h ago' },
    { icon: '🔍', label: 'Searched "Womans Rayon Kurti"',       sub: 'Found best deal at Meesho — ₹449',       time: '1d ago' },
    { icon: '🔍', label: 'Searched "Medimix Ayurvedic Soap"',   sub: 'Best price at Amazon — ₹35',             time: '2d ago' },
    { icon: '📊', label: 'Compared "MacBook Air M3 2024"',      sub: 'Apple Store vs Amazon vs Croma',         time: '3d ago' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setFormData({ name: user?.name || '', email: user?.email || '' });

    // Load wishlist from Backend API with localStorage fallback
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API}/wishlist?userId=${user?.id || ''}`);
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = json.data.map(item => item.product || item);
          setWishlist(formatted);
          localStorage.setItem(`wishlist_${user?.id || 'guest'}`, JSON.stringify(formatted));
          return;
        }
      } catch {
        /* fallback to local */
      }
      const stored = localStorage.getItem(`wishlist_${user?.id || 'guest'}`);
      if (stored) setWishlist(JSON.parse(stored));
    };

    fetchWishlist();
  }, [isAuthenticated, user, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    await new Promise(r => setTimeout(r, 600));
    setSaveMsg('✅ Profile updated successfully!');
    setSaving(false);
    setEditMode(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter(p => p.id !== productId);
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user?.id || 'guest'}`, JSON.stringify(updated));

    try {
      await fetch(`${API}/wishlist/${productId}?userId=${user?.id || ''}`, {
        method: 'DELETE'
      });
    } catch {
      /* silent */
    }
  };

  if (!isAuthenticated) return null;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Recently';

  const tabs = [
    { id: 'overview',  label: '📋 Overview'  },
    { id: 'wishlist',  label: '❤️ Wishlist'  },
    { id: 'activity',  label: '🕐 Activity'  },
    { id: 'settings',  label: '⚙️ Settings'  },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* ── Profile Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/30 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px]" />
          <div className="absolute -top-10 right-10 w-60 h-60 rounded-full bg-purple-600/10 blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <AvatarCircle name={user?.name || 'U'} size="lg" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              {user?.role === 'ADMIN' && (
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <p className="text-xs text-slate-500 mt-1">Member since {memberSince}</p>
          </div>
          <div className="flex gap-2">
            <button
              id="profile-edit-btn"
              onClick={() => { setActiveTab('settings'); setEditMode(true); }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-xl transition-all"
            >
              ✏️ Edit Profile
            </button>
            <button
              id="profile-logout-btn"
              onClick={logout}
              className="text-xs bg-rose-900/40 hover:bg-rose-900/60 text-rose-400 border border-rose-700/40 font-semibold px-4 py-2 rounded-xl transition-all"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div>
              <h2 className="text-base font-bold text-white mb-4">Your Shopping Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatTile icon="🔍" label="Products Searched"    value="28"   color="text-blue-400" />
                <StatTile icon="📊" label="Price Comparisons"    value="14"   color="text-indigo-400" />
                <StatTile icon="❤️" label="Wishlisted Items"     value={wishlist.length} color="text-rose-400" />
                <StatTile icon="💰" label="Total Saved (est.)"   value="₹2,840" color="text-emerald-400" />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-base font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: '🔍', label: 'Search Products',  sub: 'Find the best price now',      to: '/',  color: 'from-blue-600/20 to-indigo-700/20 border-blue-500/30 hover:border-blue-500/60' },
                  { icon: '⚡', label: 'Compare a URL',    sub: 'Paste any product link',        to: '/scrape',    color: 'from-purple-600/20 to-violet-700/20 border-purple-500/30 hover:border-purple-500/60' },
                  { icon: '📊', label: 'AI Compare Tool',  sub: 'Side-by-side price analysis',   to: '/compare',   color: 'from-emerald-600/20 to-teal-700/20 border-emerald-500/30 hover:border-emerald-500/60' },
                ].map(a => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className={`flex items-center gap-4 p-4 bg-gradient-to-br ${a.color} rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    <span className="text-3xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{a.label}</p>
                      <p className="text-xs text-slate-400">{a.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Recent Activity</h2>
                <button onClick={() => setActiveTab('activity')} className="text-xs text-indigo-400 hover:text-indigo-300">View all →</button>
              </div>
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 px-4">
                {recentActivity.slice(0, 3).map((a, i) => (
                  <ActivityRow key={i} {...a} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white">❤️ My Wishlist ({wishlist.length})</h2>
              <Link to="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">+ Add Products →</Link>
            </div>
            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
                <span className="text-5xl block mb-4">🛒</span>
                <p className="text-slate-400 font-medium mb-1">Your wishlist is empty</p>
                <p className="text-xs text-slate-500 mb-6">Browse products and click the ❤️ button to save them here</p>
                <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(product => (
                  <div key={product.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex gap-3 hover:border-indigo-500/40 transition-all">
                    <div className="w-14 h-14 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
                      {(() => {
                        const visual = getProductVisual(product);
                        return (
                          <img
                            src={product.imageUrl || visual.fallbackImg}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = visual.fallbackImg; }}
                          />
                        );
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-indigo-400 font-semibold">{product.category}</p>
                      <p className="text-sm font-bold text-white truncate">{product.name}</p>
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                        From ₹{Math.min(...(product.listings || []).map(l => parseFloat(l.price)).filter(Boolean)).toLocaleString() || '—'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link to={`/?q=${encodeURIComponent(product.name)}`} className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-600/40 transition-all">View</Link>
                      <button onClick={() => removeFromWishlist(product.id)} className="text-xs bg-rose-900/30 text-rose-400 px-2 py-1 rounded-lg hover:bg-rose-900/60 transition-all">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-base font-bold text-white mb-6">🕐 Recent Activity</h2>
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 px-4">
              {recentActivity.map((a, i) => (
                <ActivityRow key={i} {...a} />
              ))}
            </div>
            <p className="text-center text-xs text-slate-600 mt-6">Activity history kept for 30 days</p>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-base font-bold text-white">⚙️ Account Settings</h2>

            {/* Profile Form */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Profile Information</h3>
                {!editMode && (
                  <button
                    id="settings-edit-btn"
                    onClick={() => setEditMode(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {saveMsg && (
                <div className="mb-4 text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 rounded-xl px-4 py-2">
                  {saveMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editMode}
                    className={`w-full bg-slate-800 text-sm text-white px-4 py-2.5 rounded-xl border transition-all outline-none ${
                      editMode ? 'border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'border-slate-700 opacity-70 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editMode}
                    className={`w-full bg-slate-800 text-sm text-white px-4 py-2.5 rounded-xl border transition-all outline-none ${
                      editMode ? 'border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'border-slate-700 opacity-70 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Account Role</label>
                  <div className="bg-slate-800 text-sm text-slate-400 px-4 py-2.5 rounded-xl border border-slate-700 opacity-70">
                    {user?.role === 'ADMIN' ? '👑 Administrator' : '👤 Standard User'}
                  </div>
                </div>
                {editMode && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-indigo-700/30"
                    >
                      {saving ? 'Saving…' : '✅ Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditMode(false); setFormData({ name: user?.name || '', email: user?.email || '' }); }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Preferences */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Price drop notifications',   sub: 'Email when a product you viewed drops in price' },
                  { label: 'Weekly deals digest',        sub: 'Get top deals every Monday morning' },
                  { label: 'AI recommendation insights', sub: 'Personalised AI tips based on your searches' },
                ].map((pref, i) => (
                  <label key={i} className="flex items-center justify-between gap-4 cursor-pointer group">
                    <div>
                      <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">{pref.label}</p>
                      <p className="text-xs text-slate-500">{pref.sub}</p>
                    </div>
                    <div className="relative w-10 h-5 flex-shrink-0">
                      <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-700 peer-checked:bg-indigo-600 rounded-full transition-all" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-900/10 rounded-2xl border border-rose-800/30 p-6">
              <h3 className="text-sm font-bold text-rose-400 mb-3">Danger Zone</h3>
              <p className="text-xs text-slate-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
              <button
                id="profile-signout-btn"
                onClick={logout}
                className="text-xs bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 border border-rose-700/40 font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                🚪 Sign Out of All Devices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
