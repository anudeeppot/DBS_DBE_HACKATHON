import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LogisticsProvider } from './context/LogisticsContext';
import { DashboardLayout } from './components/DashboardLayout';
import { useLogistics } from './context/LogisticsContext';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RouteOptimizerPage } from './pages/RouteOptimizerPage';
import { CapacityOptimizerPage } from './pages/CapacityOptimizerPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { FleetPage } from './pages/FleetPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { DriversPage } from './pages/DriversPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ProfitabilityPage } from './pages/ProfitabilityPage';
import { InvestorPage } from './pages/InvestorPage';
import { ReportsPage } from './pages/ReportsPage';
import { AboutPage } from './pages/AboutPage';

/** Full-screen overlay shown while the API is loading */
const LoadingScreen: React.FC = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#F5F5F2', gap: '1rem'
  }}>
    <div style={{
      width: 48, height: 48, border: '4px solid #E5E5E1',
      borderTop: '4px solid #C92A1D', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6B6B6B', letterSpacing: 2 }}>
      LOADING DATA FROM DATABASE…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/** Full-screen error shown when the API cannot be reached */
const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#F5F5F2', gap: '1rem', padding: 32
  }}>
    <div style={{ fontSize: 40 }}>⚠️</div>
    <h2 style={{ fontFamily: 'monospace', color: '#C92A1D', margin: 0 }}>Backend Not Reachable</h2>
    <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6B6B6B', textAlign: 'center', maxWidth: 480 }}>
      {message}
    </p>
    <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#9B9B9B' }}>
      Run <strong>cd server &amp;&amp; node index.js</strong> and refresh.
    </p>
  </div>
);

/** Inner wrapper that reads loading state from context */
const AppRoutes: React.FC = () => {
  const { isLoading, loadError } = useLogistics();

  if (isLoading) return <LoadingScreen />;
  if (loadError) return <ErrorScreen message={loadError} />;

  return (
    <Routes>
      {/* Public Marketing Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard Shell with Nested Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"          element={<DashboardPage />} />
        <Route path="/route-optimizer"    element={<RouteOptimizerPage />} />
        <Route path="/capacity-optimizer" element={<CapacityOptimizerPage />} />
        <Route path="/shipments"          element={<ShipmentsPage />} />
        <Route path="/fleet"              element={<FleetPage />} />
        <Route path="/fleet/:id"          element={<VehicleDetailPage />} />
        <Route path="/live-tracking"      element={<LiveTrackingPage />} />
        <Route path="/drivers"            element={<DriversPage />} />
        <Route path="/maintenance"        element={<MaintenancePage />} />
        <Route path="/expenses"           element={<ExpensesPage />} />
        <Route path="/profitability"      element={<ProfitabilityPage />} />
        <Route path="/investor"           element={<InvestorPage />} />
        <Route path="/reports"            element={<ReportsPage />} />
        <Route path="/about"              element={<AboutPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <LogisticsProvider>
      <AppRoutes />
    </LogisticsProvider>
  );
}

export default App;
