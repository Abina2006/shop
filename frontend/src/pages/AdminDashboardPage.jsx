import React, { useState, useEffect } from 'react';
import { getProductVisual } from '../utils/productImages';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', createdAt: '2026-08-24' },
    { id: '2', name: 'Admin User', email: 'admin@shopwise.ai', role: 'ADMIN', createdAt: '2026-08-24' },
    { id: '3', name: 'abina', email: 'abinaa059@gmail.com', role: 'USER', createdAt: '2026-08-24' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
    setLoading(false);
  };

  const totalListings = products.reduce((acc, p) => acc + (p.listings?.length || 0), 0);
  const totalReviews = products.reduce((acc, p) => acc + (p.listings?.reduce((a, l) => a + (l.reviews?.length || 0), 0) || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
            <span>🛡️</span> System Administrator Panel
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Control Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage database records, registered users, scraped catalogs, and system health.</p>
        </div>

        <button
          onClick={fetchData}
          className="self-start sm:self-center bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
        >
          <span>🔄</span> Refresh Data
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-lg">📦</span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{products.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Live in PostgreSQL</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Seller Listings</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-lg">🏪</span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{totalListings}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across Amazon, Meesho, Flipkart</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Registered Users</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl text-lg">👤</span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{users.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Database user accounts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Scraped Reviews</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl text-lg">⭐</span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{totalReviews}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Extracted buyer feedbacks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          📦 Scraped Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          👤 User Accounts ({users.length})
        </button>
      </div>

      {/* Tab Content: Scraped Catalog */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Live Scraped Products Table</h3>
            <span className="text-xs text-slate-500">PostgreSQL Data Store</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-indigo-400 animate-pulse">Loading catalog records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Sellers / Stores</th>
                    <th className="p-4">Lowest Price</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((p) => {
                    const minPrice = p.listings?.length > 0 ? Math.min(...p.listings.map(l => parseFloat(l.price) || 0)) : 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-semibold text-white flex items-center gap-3">
                          {(() => {
                            const visual = getProductVisual(p);
                            return (
                              <img
                                src={p.imageUrl || visual.fallbackImg}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                                onError={(e) => { e.target.src = visual.fallbackImg; }}
                              />
                            );
                          })()}
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4"><span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-lg">{p.category}</span></td>
                        <td className="p-4 text-slate-400">{p.brand}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {p.listings?.map((l, i) => (
                              <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-[10px]">
                                {l.sellerName}: ₹{l.price}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-emerald-400">₹{minPrice.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <a href={`/compare?ids=${p.id}`} className="text-indigo-400 hover:underline">
                            View Specs ↗
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Registered System Users</h3>
            <span className="text-xs text-slate-500">PostgreSQL `users` Table</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
