import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ScraperPage from './pages/ScraperPage';
import ComparePage from './pages/ComparePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PriceAlertsPage from './pages/PriceAlertsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main User Site Routes */}
          <Route path="/" element={<Layout />}>
            {/* Index Route — Main ShopWise AI Search & Catalog */}
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Product detail */}
            <Route path="product/:id" element={<ProductDetailPage />} />

            {/* Dedicated Internal Comparison Routes (Section 2 & 3: Compare stays inside ShopWise) */}
            <Route path="compare/:productId" element={<ComparePage />} />
            <Route path="compare" element={<ComparePage />} />

            {/* Wishlist page */}
            <Route path="wishlist" element={<WishlistPage />} />

            {/* Scrape / URL Comparison Tool */}
            <Route path="scrape" element={<ScraperPage />} />

            {/* Protected App Pages (Require Login) */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="alerts"
              element={
                <ProtectedRoute>
                  <PriceAlertsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Completely Separated Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
