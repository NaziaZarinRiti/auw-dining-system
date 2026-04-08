// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DiningSignup from './pages/DiningSignup';
import WeeklyMenu from './pages/WeeklyMenu';
import MyTokens from './pages/MyTokens';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';
import UserGuide from './pages/UserGuide';
import Notifications from './pages/Notifications';

function PrivateLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loading-spinner" style={{ width: 44, height: 44, borderWidth: 3 }} />
        <div style={{ marginTop: 14, color: 'var(--gray-400)', fontFamily: 'var(--font-display)' }}>AUW Dining System</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
      <Route path="/dining" element={<PrivateLayout><DiningSignup /></PrivateLayout>} />
      <Route path="/menu" element={<PrivateLayout><WeeklyMenu /></PrivateLayout>} />
      <Route path="/tokens" element={<PrivateLayout><MyTokens /></PrivateLayout>} />
      <Route path="/payment" element={<PrivateLayout><Payment /></PrivateLayout>} />
      <Route path="/feedback" element={<PrivateLayout><Feedback /></PrivateLayout>} />
      <Route path="/guide" element={<PrivateLayout><UserGuide /></PrivateLayout>} />
      <Route path="/notifications" element={<PrivateLayout><Notifications /></PrivateLayout>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
