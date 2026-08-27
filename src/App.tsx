import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LogisticsProvider } from './context/LogisticsContext';
import { DashboardLayout } from './components/DashboardLayout';

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

export function App() {
  return (
    <LogisticsProvider>
      <Routes>
        {/* Public Marketing Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Shell with Nested Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/route-optimizer" element={<RouteOptimizerPage />} />
          <Route path="/capacity-optimizer" element={<CapacityOptimizerPage />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/fleet/:id" element={<VehicleDetailPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/profitability" element={<ProfitabilityPage />} />
          <Route path="/investor" element={<InvestorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LogisticsProvider>
  );
}

export default App;
