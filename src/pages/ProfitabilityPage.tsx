import React from 'react';
import { 
  TrendingUp, DollarSign, Award, ArrowUpRight, 
  BarChart2, ShieldCheck, Truck, Route 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR, formatPercentage } from '../utils/formatters';

export const ProfitabilityPage: React.FC = () => {
  const { kpis, vehicles, shipments } = useLogistics();

  const corridorProfits = [
    { corridor: 'Hyderabad → Delhi (Multimodal NH44/DFCC)', trips: 48, revenue: 1680000, opex: 1140000, profit: 540000, margin: 32.1 },
    { corridor: 'Mumbai → Bengaluru (Direct 32FT)', trips: 42, revenue: 1420000, opex: 990000, profit: 430000, margin: 30.2 },
    { corridor: 'Chennai → Kolkata (Dedicated Container)', trips: 36, revenue: 1290000, opex: 920000, profit: 370000, margin: 28.6 },
    { corridor: 'Nagpur → Bhopal (Smart Ingest Backhaul)', trips: 28, revenue: 420000, opex: 110000, profit: 310000, margin: 73.8 }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-cr-border pb-5">
        <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
          UNIT ECONOMICS & EBITDA RECONCILIATION
        </span>
        <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
          Profitability & Corridor Analytics
        </h1>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cr-card rounded-lg p-6 bg-[#111111] text-white">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Consolidated Fleet Profit</span>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            +{formatINR(kpis.totalProfit)}
          </div>
          <span className="text-xs font-mono text-slate-300 mt-1 block">
            Net Margin: {kpis.profitMarginPct}%
          </span>
        </div>

        <div className="cr-card rounded-lg p-6">
          <span className="text-xs font-mono text-cr-muted uppercase font-bold">EBITDA Realization</span>
          <div className="text-3xl font-black text-cr-text mt-2">
            34.2%
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold mt-1 block">
            +6.8% above industry benchmark
          </span>
        </div>

        <div className="cr-card rounded-lg p-6">
          <span className="text-xs font-mono text-cr-muted uppercase font-bold">Intermediate Ingest Surplus</span>
          <div className="text-3xl font-black text-amber-600 mt-2">
            +₹3.42L
          </div>
          <span className="text-xs font-mono text-cr-muted mt-1 block">
            Generated via zero-deadhead filling
          </span>
        </div>
      </div>

      {/* CORRIDOR PROFITABILITY RANKINGS */}
      <div className="cr-card rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cr-border pb-3">
          <div>
            <h3 className="font-extrabold text-base text-cr-text">Freight Corridor Unit Economics</h3>
            <p className="text-xs text-cr-muted font-mono">Ranked by Contribution Margin %</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F8F6] border-b border-cr-border text-cr-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Freight Corridor</th>
                <th className="py-3 px-4">Trips Completed</th>
                <th className="py-3 px-4 text-right">Revenue (₹)</th>
                <th className="py-3 px-4 text-right">OPEX (₹)</th>
                <th className="py-3 px-4 text-right">Net Profit (₹)</th>
                <th className="py-3 px-4 text-right">Contribution Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border bg-white">
              {corridorProfits.map((c, idx) => (
                <tr key={idx} className="hover:bg-cr-gray/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cr-text">
                    {c.corridor}
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">{c.trips}</td>
                  <td className="py-3.5 px-4 text-right font-bold">{formatINR(c.revenue)}</td>
                  <td className="py-3.5 px-4 text-right text-cr-muted">{formatINR(c.opex)}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                    +{formatINR(c.profit)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {c.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
