import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Truck, Package, DollarSign, 
  Fuel, ShieldCheck, ArrowRight, Zap, AlertCircle, Clock, 
  Boxes, BarChart3, Activity 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR, formatWeight, formatPercentage } from '../utils/formatters';
import { CapacityVisualizer } from '../components/CapacityVisualizer';

export const DashboardPage: React.FC = () => {
  const { kpis, vehicles, shipments, opportunities, acceptIntermediateShipment } = useLogistics();

  const financialTrendData = [
    { month: 'Apr', revenue: 980000, opex: 680000, profit: 300000 },
    { month: 'May', revenue: 1140000, opex: 790000, profit: 350000 },
    { month: 'Jun', revenue: 1280000, opex: 880000, profit: 400000 },
    { month: 'Jul', revenue: 1420000, opex: 960000, profit: 460000 },
    { month: 'Aug', revenue: kpis.totalRevenue, opex: kpis.totalOperatingCost, profit: kpis.totalProfit }
  ];

  const fleetStatusPie = [
    { name: 'In Transit', value: vehicles.filter(v => v.status === 'In Transit').length, color: '#C92A1D' },
    { name: 'Loading / Hub', value: vehicles.filter(v => v.status === 'Loading' || v.status === 'At Stop').length, color: '#111111' },
    { name: 'Idle / Available', value: vehicles.filter(v => v.status === 'Idle').length, color: '#FFD400' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, color: '#E7E7E4' }
  ];

  const topOpportunity = opportunities.find(o => !o.isAccepted);

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            OPERATIONAL INTELLIGENCE PLATFORM
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Executive Command Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/route-optimizer"
            className="px-4 py-2 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-2 transition-all"
          >
            <span>Launch Route Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* TOP NOTIFICATION / OPPORTUNITY BANNER */}
      {topOpportunity && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cr-yellow text-slate-900 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Zap className="w-4 h-4 fill-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-900 uppercase">
                  ACTIVE ROUTE BACKHAUL MATCH DETECTED
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-white text-emerald-800 border border-emerald-300 font-bold">
                  +{topOpportunity.incrementalMarginPct}% Margin
                </span>
              </div>
              <p className="text-xs text-cr-text font-medium mt-0.5">
                Truck <strong>{topOpportunity.targetVehicleReg}</strong> has available headroom on corridor <strong>{topOpportunity.origin} → {topOpportunity.destination}</strong>. Offered Cargo: {topOpportunity.weightTons}T ({formatINR(topOpportunity.offeredRevenue)}).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => acceptIntermediateShipment(topOpportunity.id)}
              className="w-full md:w-auto px-4 py-2 rounded bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Ingest & Earn {formatINR(topOpportunity.netAdditionalProfit)}
            </button>
            <Link
              to="/capacity-optimizer"
              className="text-xs font-bold text-cr-muted hover:text-cr-text whitespace-nowrap"
            >
              Inspect All
            </Link>
          </div>
        </div>
      )}

      {/* 11 TOP KPI METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-cr-red">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Total Revenue</span>
          <div className="text-lg font-black text-cr-text mt-1">{formatINR(kpis.totalRevenue)}</div>
          <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +14.2% MoM
          </span>
        </div>

        {/* Metric 2 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-slate-800">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Net Profit</span>
          <div className="text-lg font-black text-cr-text mt-1">{formatINR(kpis.totalProfit)}</div>
          <span className="text-[10px] font-mono text-cr-text font-bold mt-0.5 block">
            {kpis.profitMarginPct}% Margin
          </span>
        </div>

        {/* Metric 3 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-emerald-600">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Fleet Utilization</span>
          <div className="text-lg font-black text-cr-text mt-1">{formatPercentage(kpis.fleetUtilizationPct)}</div>
          <span className="text-[10px] font-mono text-emerald-600 font-semibold mt-0.5 block">
            Target: 80.0%
          </span>
        </div>

        {/* Metric 4 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-amber-500">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Available Payload</span>
          <div className="text-lg font-black text-cr-text mt-1">{formatWeight(kpis.availableWeightCapacityTons)}</div>
          <span className="text-[10px] font-mono text-cr-muted mt-0.5 block">
            {kpis.availableVolumeCapacityM3} m³ Cube
          </span>
        </div>

        {/* Metric 5 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-cr-yellow">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Active Fleet</span>
          <div className="text-lg font-black text-cr-text mt-1">{kpis.activeVehicles} / {kpis.totalVehicles}</div>
          <span className="text-[10px] font-mono text-cr-muted mt-0.5 block">
            {vehicles.filter(v => v.status === 'In Transit').length} En Route
          </span>
        </div>

        {/* Metric 6 */}
        <div className="cr-card rounded p-3.5 border-l-4 border-l-blue-600">
          <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">Avg Fuel ₹/KM</span>
          <div className="text-lg font-black text-cr-text mt-1">₹{kpis.avgFuelCostPerKm}</div>
          <span className="text-[10px] font-mono text-cr-muted mt-0.5 block">
            Diesel @ ₹{kpis.avgFuelCostPerKm > 22 ? '95/L' : '95/L'}
          </span>
        </div>
      </div>

      {/* CHARTS & TELEMETRY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs OPEX Trend Chart */}
        <div className="lg:col-span-2 cr-card rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
            <div>
              <h3 className="font-extrabold text-cr-text text-sm tracking-tight">Revenue vs. Operating Cost (OPEX)</h3>
              <p className="text-xs text-cr-muted font-mono">Consolidated Freight Financial Trajectory</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cr-red"></span> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span> OPEX</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C92A1D" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C92A1D" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E1" />
                <XAxis dataKey="month" stroke="#6B6B6B" fontSize={11} />
                <YAxis stroke="#6B6B6B" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']} />
                <Area type="monotone" dataKey="revenue" stroke="#C92A1D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="opex" stroke="#111111" strokeWidth={2} fillOpacity={1} fill="url(#colorOpex)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Distribution Pie & Health */}
        <div className="cr-card rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
              <h3 className="font-extrabold text-cr-text text-sm tracking-tight">Fleet Asset Distribution</h3>
              <span className="text-xs font-mono text-cr-muted">{kpis.totalVehicles} Assets</span>
            </div>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetStatusPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {fleetStatusPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-cr-border text-xs font-mono">
            {fleetStatusPie.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-cr-muted truncate">{item.name}:</span>
                <strong className="text-cr-text">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE CORRIDORS & CAPACITY AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Corridors Status */}
        <div className="lg:col-span-2 cr-card rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
            <div>
              <h3 className="font-extrabold text-cr-text text-sm tracking-tight">High-Density Freight Corridors</h3>
              <p className="text-xs text-cr-muted font-mono">Active Transit Nodes & P&L</p>
            </div>
            <Link to="/fleet" className="text-xs font-bold text-cr-red hover:underline flex items-center gap-1">
              <span>View All Fleet</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cr-border text-cr-muted uppercase text-[10px]">
                  <th className="pb-2">Vehicle</th>
                  <th className="pb-2">Corridor</th>
                  <th className="pb-2">Driver</th>
                  <th className="pb-2">Current Load</th>
                  <th className="pb-2">Speed</th>
                  <th className="pb-2 text-right">Trip Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cr-border">
                {vehicles.slice(0, 5).map((veh) => {
                  const loadPct = Math.round((veh.currentWeightTons / veh.maxWeightTons) * 100);
                  return (
                    <tr key={veh.id} className="hover:bg-cr-gray/40 transition-colors">
                      <td className="py-3 font-bold text-cr-text">
                        <Link to={`/fleet/${veh.id}`} className="hover:text-cr-red hover:underline">
                          {veh.regNumber}
                        </Link>
                      </td>
                      <td className="py-3 text-cr-muted">
                        {veh.origin} → {veh.destination}
                      </td>
                      <td className="py-3 text-cr-text">{veh.driverName}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{formatWeight(veh.currentWeightTons)}</span>
                          <span className="text-[10px] text-cr-muted">({loadPct}%)</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          {veh.currentLocation.speedKmph} km/h
                        </span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-emerald-700">
                        +{formatINR(veh.totalTripRevenue - veh.totalTripCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Vehicle Capacity Telemetry */}
        <div className="space-y-4">
          <CapacityVisualizer
            maxWeightTons={15.0}
            currentWeightTons={vehicles[0]?.currentWeightTons || 12.3}
            maxVolumeM3={60.0}
            currentVolumeM3={vehicles[0]?.currentVolumeM3 || 45.0}
            title={`${vehicles[0]?.regNumber || 'TS09AB1234'} Capacity`}
            show3DBox={true}
          />
        </div>
      </div>
    </div>
  );
};
