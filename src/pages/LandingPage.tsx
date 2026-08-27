import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Zap, TrendingUp, Boxes, 
  Truck, Train, Plane, MapPin, Sparkles, CheckCircle2, 
  BarChart3, Activity, Layers, ChevronRight, Route 
} from 'lucide-react';
import { IsometricLogisticsWorld } from '../components/IsometricLogisticsWorld';
import { SimulationBadge } from '../components/SimulationBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cr-bg text-cr-text font-sans antialiased selection:bg-cr-red selection:text-white">
      {/* GLOBAL TOP MARKETING NAV */}
      <nav className="h-16 border-b border-cr-border bg-white/90 backdrop-blur sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cr-red flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-sm">
            CR
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-cr-text leading-none">CARGOROUTE</span>
            <span className="text-[9px] font-mono tracking-widest text-cr-muted uppercase mt-0.5">Enterprise Freight Optimization</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-tight text-cr-muted">
          <a href="#solutions" className="hover:text-cr-text transition-colors">Solutions</a>
          <a href="#network" className="hover:text-cr-text transition-colors">National Corridor Mesh</a>
          <a href="#interactive-world" className="hover:text-cr-text transition-colors">Live Simulation</a>
          <Link to="/about" className="hover:text-cr-text transition-colors">Architecture</Link>
        </div>

        <div className="flex items-center gap-3">
          <SimulationBadge label="Interactive Demo" />
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION WITH ISOMETRIC LOGISTICS WORLD */}
      <section className="px-6 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EFEFEA] border border-cr-border text-xs font-mono font-bold text-cr-muted">
              <span className="w-2 h-2 rounded-full bg-cr-red animate-ping"></span>
              <span>ENTERPRISE MULTIMODAL TRANSPORTATION SUITE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cr-text tracking-tight leading-[1.08]">
              Move Smarter. <br />
              Deliver Further. <br />
              <span className="text-cr-red">Maximize Every Route.</span>
            </h1>

            <p className="text-base text-cr-muted leading-relaxed max-w-xl">
              Next-generation freight logistics engine uniting Rail, Dedicated Road, and Air express into synchronized, high-margin multimodal corridors with zero deadhead empty-miles.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-sm tracking-tight shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Enter Executive Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/route-optimizer"
                className="px-6 py-3.5 rounded bg-white hover:bg-cr-gray border border-cr-border text-cr-text font-bold text-sm tracking-tight transition-all cursor-pointer"
              >
                <span>Test Route Optimizer</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cr-border text-xs font-mono">
              <div>
                <strong className="text-xl font-black text-cr-text block">14+ Hubs</strong>
                <span className="text-cr-muted text-[11px]">National Dedicated Mesh</span>
              </div>
              <div>
                <strong className="text-xl font-black text-emerald-700 block">+73.8%</strong>
                <span className="text-cr-muted text-[11px]">Backhaul Margin Surplus</span>
              </div>
              <div>
                <strong className="text-xl font-black text-cr-text block">-38% CO₂</strong>
                <span className="text-cr-muted text-[11px]">Rail Modal Shift Eco</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive 3D Isometric Logistics World */}
          <div id="interactive-world" className="lg:col-span-6">
            <div className="cr-card rounded-2xl p-4 shadow-xl border-2 border-cr-border bg-white">
              <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-3 px-2">
                <div className="flex items-center gap-2 font-mono text-xs text-cr-muted">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-cr-text">NATIONAL MULTIMODAL GRID SIMULATOR</span>
                </div>
                <span className="text-[10px] font-mono bg-cr-gray px-2 py-0.5 rounded text-cr-muted">
                  Click nodes to inspect
                </span>
              </div>
              <IsometricLogisticsWorld />
            </div>
          </div>
        </div>
      </section>

      {/* CORE DIFFERENTIATING CAPABILITIES */}
      <section id="solutions" className="bg-[#FFFFFF] border-y border-cr-border py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cr-red uppercase tracking-widest">
              END-TO-END CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cr-text tracking-tight">
              Engineered for Enterprise Multimodal Scale
            </h2>
            <p className="text-sm text-cr-muted">
              Discover how CargoRoute transforms traditional fragmented fleet operations into a high-margin algorithmic logistics network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="cr-card rounded-xl p-6 space-y-4 hover:border-cr-red transition-all">
              <div className="w-12 h-12 rounded-lg bg-cr-red/10 text-cr-red flex items-center justify-center">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-cr-text">Multimodal Route Planner</h3>
              <p className="text-xs text-cr-muted leading-relaxed">
                Seamlessly combines Indian Railways CONCOR freight trains, dedicated multi-axle trucks, and air cargo with live timetable synchronization.
              </p>
              <Link to="/route-optimizer" className="inline-flex items-center gap-1 text-xs font-bold text-cr-red hover:underline font-mono">
                Explore Planner <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="cr-card rounded-xl p-6 space-y-4 hover:border-cr-red transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-cr-text">Intermediate Cargo Ingestion</h3>
              <p className="text-xs text-cr-muted leading-relaxed">
                Smart algorithm detects vacant weight & volume headroom along in-transit trucks, pairing midway pickups to yield 70%+ incremental profit.
              </p>
              <Link to="/capacity-optimizer" className="inline-flex items-center gap-1 text-xs font-bold text-cr-red hover:underline font-mono">
                Ingest Opportunities <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="cr-card rounded-xl p-6 space-y-4 hover:border-cr-red transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-cr-text">Satellite Live GPS Radar</h3>
              <p className="text-xs text-cr-muted leading-relaxed">
                Interactive Leaflet map with simulated real-time GPS telemetry, waypoint checkpoint progression, and live driver speed monitors.
              </p>
              <Link to="/live-tracking" className="inline-flex items-center gap-1 text-xs font-bold text-cr-red hover:underline font-mono">
                Launch Radar <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="cr-card rounded-xl p-6 space-y-4 hover:border-cr-red transition-all">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-cr-text">What-If Scenario Simulator</h3>
              <p className="text-xs text-cr-muted leading-relaxed">
                Interactive macro sliders for diesel prices, freight rates, and fleet utilization to instantly stress-test EBITDA and ROI projections.
              </p>
              <Link to="/investor" className="inline-flex items-center gap-1 text-xs font-bold text-cr-red hover:underline font-mono">
                Simulate Scenarios <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cr-border bg-[#F7F7F5] py-12 px-6 lg:px-12 text-xs font-mono text-cr-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cr-text">CARGOROUTE</span>
            <span>• Multimodal Freight & Fleet Optimization Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-cr-text">About</Link>
            <Link to="/dashboard" className="hover:text-cr-text">Executive Dashboard</Link>
            <Link to="/reports" className="hover:text-cr-text">Reports & Export</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
