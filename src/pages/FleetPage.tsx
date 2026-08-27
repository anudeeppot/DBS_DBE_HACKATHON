import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, Search, Filter, ArrowRight, ShieldCheck, 
  MapPin, Fuel, Wrench, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR, formatWeight, formatPercentage } from '../utils/formatters';

export const FleetPage: React.FC = () => {
  const { vehicles, kpis } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            COMMERCIAL TRANSPORT ASSETS
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Fleet Asset Management
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/live-tracking"
            className="px-4 py-2 rounded bg-slate-900 hover:bg-black text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-2 transition-all"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Open Live GPS Telemetry Map</span>
          </Link>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Total Commercial Assets</span>
          <div className="text-2xl font-black text-cr-text mt-1">{kpis.totalVehicles}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">96.4% Operational Readiness</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">In Transit</span>
          <div className="text-2xl font-black text-cr-red mt-1">
            {vehicles.filter(v => v.status === 'In Transit').length}
          </div>
          <span className="text-[10px] text-cr-muted">Avg Speed: 62 km/h</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Idle / Available for Load</span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {vehicles.filter(v => v.status === 'Idle').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Dispatch</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Scheduled Maintenance</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {vehicles.filter(v => v.status === 'Maintenance').length}
          </div>
          <span className="text-[10px] text-cr-muted">Workshop In-Progress</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cr-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle reg, driver, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-cr-border rounded-md pl-9 pr-3 py-2 text-xs font-mono text-cr-text focus:outline-none focus:border-cr-red"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'In Transit', 'Loading', 'Idle', 'Maintenance'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-cr-border text-cr-muted hover:text-cr-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* FLEET TABLE */}
      <div className="cr-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F8F6] border-b border-cr-border text-cr-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Registration #</th>
                <th className="py-3 px-4">Type & Spec</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Current Corridor</th>
                <th className="py-3 px-4">Payload Fill</th>
                <th className="py-3 px-4">Health / Odo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border bg-white">
              {filteredVehicles.map((v) => {
                const weightPct = Math.round((v.currentWeightTons / v.maxWeightTons) * 100);
                return (
                  <tr key={v.id} className="hover:bg-cr-gray/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-cr-text">
                      <Link to={`/fleet/${v.id}`} className="text-cr-red hover:underline font-black">
                        {v.regNumber}
                      </Link>
                      <span className="block text-[10px] text-cr-muted font-normal">{v.makeModel}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cr-muted">
                      {v.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-cr-text block">{v.driverName}</span>
                      <span className="text-[10px] text-cr-muted">{v.driverPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cr-muted">
                      {v.origin} → {v.destination}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-cr-gray h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${weightPct > 80 ? 'bg-cr-red' : 'bg-slate-800'}`}
                            style={{ width: `${weightPct}%` }}
                          />
                        </div>
                        <span className="font-bold">{weightPct}%</span>
                      </div>
                      <span className="text-[10px] text-cr-muted">
                        {formatWeight(v.currentWeightTons)} / {formatWeight(v.maxWeightTons)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-cr-text font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{v.healthScore}/100</span>
                      </div>
                      <span className="text-[10px] text-cr-muted">{v.odometerKm.toLocaleString('en-IN')} km</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'In Transit' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        v.status === 'Idle' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        v.status === 'Maintenance' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/fleet/${v.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EFEFEA] hover:bg-cr-gray text-cr-text font-bold text-[11px] transition-colors"
                      >
                        <span>Telemetry</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
