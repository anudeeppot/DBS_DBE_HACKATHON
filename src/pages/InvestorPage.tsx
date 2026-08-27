import React from 'react';
import { 
  Sliders, TrendingUp, DollarSign, Calculator, 
  RotateCcw, ShieldCheck, PieChart as PieIcon, ArrowRight 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR, formatPercentage } from '../utils/formatters';

export const InvestorPage: React.FC = () => {
  const { scenarioParams, updateScenarioParam, resetScenarioParams, kpis } = useLogistics();

  const capexFleetAssets = scenarioParams.fleetSize * 2800000;
  const annualEbitda = kpis.totalProfit * 12;
  const roiPct = capexFleetAssets > 0 ? ((annualEbitda / capexFleetAssets) * 100).toFixed(1) : '0';
  const paybackYears = annualEbitda > 0 ? (capexFleetAssets / annualEbitda).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            INSTITUTIONAL INVESTOR PORTAL
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            What-If Scenario Simulator & ROI Engine
          </h1>
        </div>
        <button
          onClick={resetScenarioParams}
          className="px-4 py-2 rounded bg-white border border-cr-border text-cr-text font-bold text-xs flex items-center gap-2 hover:bg-cr-gray transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Base Parameters</span>
        </button>
      </div>

      {/* 4 SCENARIO SLIDERS */}
      <div className="cr-card rounded-lg p-6 space-y-6">
        <div className="border-b border-cr-border pb-3">
          <h3 className="font-extrabold text-base text-cr-text">Macro Parameter Simulation Sliders</h3>
          <p className="text-xs text-cr-muted font-mono">
            Adjust variables to immediately stress-test company EBITDA, payback horizons, and fuel cost impacts across the application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Diesel Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cr-muted font-bold">Diesel Price (₹/L)</span>
              <strong className="text-cr-red font-black">₹{scenarioParams.dieselPricePerL} / L</strong>
            </div>
            <input
              type="range"
              min="75"
              max="130"
              step="1"
              value={scenarioParams.dieselPricePerL}
              onChange={(e) => updateScenarioParam('dieselPricePerL', parseInt(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-cr-muted">
              <span>₹75</span>
              <span>₹130</span>
            </div>
          </div>

          {/* Slider 2: Freight Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cr-muted font-bold">Customer Rate (₹/km)</span>
              <strong className="text-cr-text font-black">₹{scenarioParams.freightRatePerKm} / km</strong>
            </div>
            <input
              type="range"
              min="30"
              max="65"
              step="1"
              value={scenarioParams.freightRatePerKm}
              onChange={(e) => updateScenarioParam('freightRatePerKm', parseInt(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-cr-muted">
              <span>₹30</span>
              <span>₹65</span>
            </div>
          </div>

          {/* Slider 3: Fleet Utilization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cr-muted font-bold">Fleet Utilization %</span>
              <strong className="text-emerald-700 font-black">{scenarioParams.fleetUtilizationPct}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              step="0.5"
              value={scenarioParams.fleetUtilizationPct}
              onChange={(e) => updateScenarioParam('fleetUtilizationPct', parseFloat(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-cr-muted">
              <span>50%</span>
              <span>98%</span>
            </div>
          </div>

          {/* Slider 4: Fleet Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cr-muted font-bold">Fleet Asset Count</span>
              <strong className="text-cr-text font-black">{scenarioParams.fleetSize} Trucks</strong>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="2"
              value={scenarioParams.fleetSize}
              onChange={(e) => updateScenarioParam('fleetSize', parseInt(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-cr-muted">
              <span>10 Trucks</span>
              <span>200 Trucks</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC FINANCIAL OUTPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="cr-card rounded-lg p-5 bg-[#111111] text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Projected Monthly EBITDA</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            +{formatINR(kpis.totalProfit)}
          </div>
          <span className="text-[10px] text-slate-300 mt-0.5 block">{kpis.profitMarginPct}% Net Margin</span>
        </div>

        <div className="cr-card rounded-lg p-5">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Annualized ROI</span>
          <div className="text-2xl font-black text-cr-text mt-1">{roiPct}%</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">EBITDA ÷ Asset CAPEX</span>
        </div>

        <div className="cr-card rounded-lg p-5">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Payback Period</span>
          <div className="text-2xl font-black text-cr-text mt-1">{paybackYears} Years</div>
          <span className="text-[10px] text-cr-muted mt-0.5 block">Capital Recovery Horizon</span>
        </div>

        <div className="cr-card rounded-lg p-5">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Simulated Fleet CAPEX</span>
          <div className="text-2xl font-black text-cr-text mt-1">{formatINR(capexFleetAssets)}</div>
          <span className="text-[10px] text-cr-muted mt-0.5 block">@ ₹28L / Commercial Truck</span>
        </div>
      </div>
    </div>
  );
};
