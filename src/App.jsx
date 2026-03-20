import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage     from './pages/rider/HomePage';
import PayoutsPage  from './pages/rider/PayoutsPage';
import CoveragePage from './pages/rider/CoveragePage';
import TaxSummaryPage from './pages/rider/TaxSummaryPage';
import ProfilePage  from './pages/rider/ProfilePage';
import AdminPage    from './pages/admin/AdminPage';

const PAGE_TITLES = {
  '/':         'Dashboard',
  '/payouts':  'Payouts',
  '/coverage': 'Coverage',
  '/tax':      'Tax Report',
  '/profile':  'Profile',
  '/admin':    'Admin Panel',
};

// Auth pages (no sidebar)
const AUTH_PATHS = ['/login', '/register'];

function AppShell({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAuth = AUTH_PATHS.includes(location.pathname);

  if (isAuth || !currentUser) return <>{children}</>;

  const title = PAGE_TITLES[location.pathname] || 'GigShield';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopBar title={title} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/payouts"  element={<ProtectedRoute><PayoutsPage /></ProtectedRoute>} />
            <Route path="/coverage" element={<ProtectedRoute><CoveragePage /></ProtectedRoute>} />
            <Route path="/tax"      element={<ProtectedRoute><TaxSummaryPage /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin"    element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A2235',
            color: '#F1F5F9',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
