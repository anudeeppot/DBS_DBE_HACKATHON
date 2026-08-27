import React, { useState } from 'react';
import { 
  Wrench, AlertTriangle, CheckCircle2, Plus, 
  Calendar, ShieldCheck, DollarSign, X 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { MaintenanceRecord } from '../types';
import { formatINR } from '../utils/formatters';

export const MaintenancePage: React.FC = () => {
  const { maintenance, addMaintenanceRecord, vehicles } = useLogistics();
  const [showModal, setShowModal] = useState(false);

  const [selectedReg, setSelectedReg] = useState(vehicles[0]?.regNumber || 'TS09AB1234');
  const [serviceType, setServiceType] = useState<MaintenanceRecord['serviceType']>('Preventive');
  const [cost, setCost] = useState(14500);
  const [workshop, setWorkshop] = useState('Tata Motors Authorized Workshop');
  const [mechanicNotes, setMechanicNotes] = useState('Scheduled preventive overhaul and lubrication');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(veh => veh.regNumber === selectedReg);
    addMaintenanceRecord({
      vehicleId: v?.id || 'veh-01',
      vehicleReg: selectedReg,
      serviceType,
      scheduledDate: new Date().toISOString().split('T')[0],
      odometerKm: v?.odometerKm || 124000,
      cost,
      status: 'In Maintenance',
      workshop,
      mechanicNotes,
      nextServiceKm: (v?.odometerKm || 124000) + 15000
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            FLEET RELIABILITY & PREVENTIVE OVERHAUL
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Maintenance & Service Records
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Work Order</span>
        </button>
      </div>

      {/* MAINTENANCE WORK ORDERS TABLE */}
      <div className="cr-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F8F6] border-b border-cr-border text-cr-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Vehicle #</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Cost (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border bg-white">
              {maintenance.map((m) => (
                <tr key={m.id} className="hover:bg-cr-gray/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cr-text">
                    <span className="text-cr-red font-black">{m.vehicleReg}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cr-text">
                    {m.serviceType}
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">
                    {m.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">
                    {m.odometerKm.toLocaleString('en-IN')} km
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">
                    {m.workshop}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'Good' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      m.status === 'In Maintenance' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-cr-text">
                    {formatINR(m.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE WORK ORDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 border border-cr-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <h3 className="font-extrabold text-base text-cr-text">Log Maintenance Work Order</h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-cr-gray text-cr-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-cr-muted block mb-1">Select Vehicle Asset</label>
                <select
                  value={selectedReg}
                  onChange={(e) => setSelectedReg(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.regNumber}>{v.regNumber} ({v.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                >
                  <option value="Preventive">Preventive Inspection & Lube</option>
                  <option value="Tyre Replacement">Tyre Replacement & Alignment</option>
                  <option value="Brake System">Brake System Overhaul</option>
                  <option value="Engine Overhaul">Engine & Transmission Overhaul</option>
                  <option value="Oil & Filter">Oil & Air Filter Replacement</option>
                  <option value="Electrical">Electrical & Battery Diagnostic</option>
                </select>
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Estimated Workshop Cost (₹)</label>
                <input
                  type="number"
                  required
                  value={cost}
                  onChange={(e) => setCost(parseInt(e.target.value))}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text font-bold"
                />
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Authorized Workshop / Center</label>
                <input
                  type="text"
                  required
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-cr-gray text-cr-text font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-cr-red text-white font-bold text-xs shadow-sm hover:bg-cr-red-dark"
              >
                Log Work Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
