import React from 'react';
import { 
  ShieldCheck, Route, Zap, TrendingUp, Award, 
  CheckCircle2, ArrowRight, Layers, Truck, Train, Plane 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* HERO / STORY */}
      <div className="border-b border-cr-border pb-8 text-center space-y-4">
        <span className="text-xs font-mono font-bold text-cr-red uppercase tracking-widest">
          SYSTEM ARCHITECTURE & PRODUCT VISION
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-cr-text tracking-tight">
          Architecting the Future of Multimodal Freight
        </h1>
        <p className="text-base text-cr-muted max-w-2xl mx-auto leading-relaxed">
          CargoRoute was engineered to solve the multi-billion dollar inefficiencies of fragmented Indian road freight by orchestrating synchronized rail corridors, real-time intermediate cargo consolidation, and dynamic unit economics.
        </p>
      </div>

      {/* PROBLEM VS SOLUTION MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="cr-card rounded-xl p-6 border-l-4 border-l-rose-600 space-y-4">
          <span className="text-xs font-mono font-bold text-rose-700 uppercase">THE INDUSTRY PROBLEM</span>
          <h3 className="text-xl font-bold text-cr-text">Fragmented, High-Cost Fleet Operations</h3>
          <ul className="space-y-3 text-xs text-cr-muted leading-relaxed font-mono">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>35%+ Empty Deadhead Miles:</strong> Trucks returning empty or half-filled on long return corridors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Underutilized Rail Corridors:</strong> Indian Railways DFCC freight capacity remains untapped by road fleet operators.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Static Pricing Models:</strong> Inability to adjust for fluctuating diesel prices, driver allowances, and dynamic FASTag tolls.</span>
            </li>
          </ul>
        </div>

        <div className="cr-card rounded-xl p-6 border-l-4 border-l-emerald-600 space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase">THE CARGOROUTE SOLUTION</span>
          <h3 className="text-xl font-bold text-cr-text">Algorithmic Multimodal Logistics Mesh</h3>
          <ul className="space-y-3 text-xs text-cr-muted leading-relaxed font-mono">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Dual-Constraint Headroom Engine:</strong> Ingests high-margin intermediate consignments along active transit paths.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>CONCOR Rail + Road Sync:</strong> 38% carbon reduction and 25% lower ton-kilometer freight costs via rail modal shift.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>What-If Scenario Simulation:</strong> Instant EBITDA stress-testing and margin sensitivity analysis for institutional investors.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SCALE BENCHMARKS */}
      <div className="cr-card rounded-xl p-8 bg-[#111111] text-white space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-cr-yellow font-bold uppercase tracking-wider">
            PERFORMANCE BENCHMARKS
          </span>
          <h3 className="text-2xl font-black">Proven Operational Efficiency Across India</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
            <span className="text-3xl font-black text-emerald-400 block">+73.8%</span>
            <span className="text-xs text-slate-300 mt-1 block">Incremental Backhaul Margin</span>
          </div>
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
            <span className="text-3xl font-black text-white block">14 Hubs</span>
            <span className="text-xs text-slate-300 mt-1 block">Dedicated National Nodes</span>
          </div>
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
            <span className="text-3xl font-black text-cr-yellow block">98.2%</span>
            <span className="text-xs text-slate-300 mt-1 block">On-Time Delivery SLA</span>
          </div>
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/60">
            <span className="text-3xl font-black text-emerald-400 block">-38%</span>
            <span className="text-xs text-slate-300 mt-1 block">CO₂ Emissions Reduction</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6 space-y-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-cr-red hover:bg-cr-red-dark text-white font-black text-sm tracking-tight shadow-xl transition-all"
        >
          <span>Launch Executive Command Platform</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
