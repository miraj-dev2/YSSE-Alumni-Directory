import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

// Public & User Pages
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DirectoryPage = lazy(() => import('./pages/DirectoryPage').then((m) => ({ default: m.DirectoryPage })));
const AlumniProfilePage = lazy(() => import('./pages/AlumniProfilePage').then((m) => ({ default: m.AlumniProfilePage })));
const SessionsPage = lazy(() => import('./pages/SessionsPage').then((m) => ({ default: m.SessionsPage })));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage').then((m) => ({ default: m.MyProfilePage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminApprovalsPage = lazy(() => import('./pages/admin/AdminApprovalsPage').then((m) => ({ default: m.AdminApprovalsPage })));
const AdminAlumniPage = lazy(() => import('./pages/admin/AdminAlumniPage').then((m) => ({ default: m.AdminAlumniPage })));
const AdminSessionsPage = lazy(() => import('./pages/admin/AdminSessionsPage').then((m) => ({ default: m.AdminSessionsPage })));
const AdminImportPage = lazy(() => import('./pages/admin/AdminImportPage').then((m) => ({ default: m.AdminImportPage })));
const AdminStaleProfilesPage = lazy(() => import('./pages/admin/AdminStaleProfilesPage').then((m) => ({ default: m.AdminStaleProfilesPage })));
const AdminActivityPage = lazy(() => import('./pages/admin/AdminActivityPage').then((m) => ({ default: m.AdminActivityPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-8 h-8 border-2 border-border-strong border-t-accent rounded-full animate-spin" />
    <span className="font-mono text-[11px] uppercase text-muted tracking-wider">
      Loading YSSE Directory...
    </span>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public & Member Site Layout */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="alumni" element={<DirectoryPage />} />
                  <Route path="alumni/:id" element={<AlumniProfilePage />} />
                  <Route path="sessions" element={<SessionsPage />} />

                  {/* Account Settings (Member, Alumni, Admin) */}
                  <Route
                    path="account"
                    element={
                      <ProtectedRoute allowedRoles={['member', 'alumni', 'admin']}>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* My Profile (Alumni Only) */}
                  <Route
                    path="me"
                    element={
                      <ProtectedRoute allowedRoles={['alumni']}>
                        <MyProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Admin Portal Layout (Admin Only) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="approvals" element={<AdminApprovalsPage />} />
                  <Route path="alumni" element={<AdminAlumniPage />} />
                  <Route path="sessions" element={<AdminSessionsPage />} />
                  <Route path="import" element={<AdminImportPage />} />
                  <Route path="stale" element={<AdminStaleProfilesPage />} />
                  <Route path="activity" element={<AdminActivityPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
