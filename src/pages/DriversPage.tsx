import React, { useState } from 'react';
import { 
  Users, Search, ShieldCheck, Award, AlertCircle, 
  DollarSign, CheckCircle2, Phone, Calendar 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR } from '../utils/formatters';

export const DriversPage: React.FC = () => {
  const { drivers } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.assignedVehicleReg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            COMMERCIAL PILOT ROSTER
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Driver & Compliance Management
          </h1>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-cr-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search driver name, ID code, vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-cr-border rounded-md pl-9 pr-3 py-2 text-xs font-mono text-cr-text focus:outline-none focus:border-cr-red"
        />
      </div>

      {/* DRIVERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((d) => (
          <div key={d.id} className="cr-card rounded-lg p-5 space-y-4 hover:border-slate-400 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cr-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {d.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-cr-text">{d.name}</h3>
                  <span className="text-[10px] font-mono text-cr-muted">{d.code} • {d.experienceYears} yrs exp</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                d.status === 'On Duty' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800'
              }`}>
                {d.status}
              </span>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs font-mono bg-[#F8F8F6] rounded border border-cr-border">
              <div>
                <span className="text-[10px] text-cr-muted block">SAFETY</span>
                <strong className="text-cr-text font-bold">{d.safetyScore}/100</strong>
              </div>
              <div>
                <span className="text-[10px] text-cr-muted block">ON-TIME</span>
                <strong className="text-emerald-700 font-bold">{d.onTimeDeliveryRate}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-cr-muted block">RATING</span>
                <strong className="text-amber-700 font-bold">{d.rating} ★</strong>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-cr-muted">Assigned Truck:</span>
                <strong className="text-cr-red">{d.assignedVehicleReg}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-cr-muted">Commercial License:</span>
                <strong className="text-cr-text">{d.licenseNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-cr-muted">License Expiry:</span>
                <span className="text-cr-muted">{d.licenseExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cr-muted">Monthly Base Wages:</span>
                <strong className="text-cr-text">{formatINR(d.baseSalaryMonthly)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
