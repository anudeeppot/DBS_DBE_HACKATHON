import React, { useState } from 'react';
import { 
  Receipt, DollarSign, Fuel, Wrench, ShieldCheck, 
  CreditCard, Plus, ArrowRight, X 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR } from '../utils/formatters';

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, vehicles, kpis } = useLogistics();
  const [showModal, setShowModal] = useState(false);

  const [vehicleReg, setVehicleReg] = useState(vehicles[0]?.regNumber || 'TS09AB1234');
  const [category, setCategory] = useState<any>('Fuel');
  const [description, setDescription] = useState('Diesel refuel - HPCL Tanker Hub');
  const [amount, setAmount] = useState(18500);
  const [paymentMethod, setPaymentMethod] = useState<any>('Fuel Card');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(10000 + Math.random() * 90000)}`);

  const categoryTotals: Record<string, number> = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const opexBreakdownPie = [
    { name: 'Diesel Fuel', value: categoryTotals['Fuel'] || 142000, color: '#C92A1D' },
    { name: 'Driver Wages & Allowance', value: categoryTotals['Driver'] || 48000, color: '#111111' },
    { name: 'Preventive Maintenance', value: categoryTotals['Maintenance'] || 32000, color: '#FFD400' },
    { name: 'FASTag Tolls & Taxes', value: (categoryTotals['Toll'] || 0) + (categoryTotals['Permits & Taxes'] || 0) || 28000, color: '#6B6B6B' }
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      date: new Date().toISOString().split('T')[0],
      vehicleReg,
      category,
      description,
      amount,
      invoiceNumber,
      paymentMethod,
      approvedBy: 'Fleet Accounts Lead'
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            COST ACCOUNTING & OPEX TRACKER
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Expense Management & Fuel Logs
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense Voucher</span>
        </button>
      </div>

      {/* CHARTS & SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="cr-card rounded-lg p-5 flex flex-col justify-between">
          <div className="border-b border-cr-border pb-3 mb-2">
            <h3 className="font-extrabold text-sm text-cr-text">OPEX Distribution</h3>
            <span className="text-xs font-mono text-cr-muted">Total OPEX: {formatINR(kpis.totalOperatingCost)}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={opexBreakdownPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {opexBreakdownPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatINR(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FUEL FORMULA CARD */}
        <div className="lg:col-span-2 cr-card rounded-lg p-5 space-y-4">
          <div className="border-b border-cr-border pb-3">
            <h3 className="font-extrabold text-sm text-cr-text">Distance-Based Fuel Computation Engine</h3>
            <p className="text-xs font-mono text-cr-muted">
              Live Mathematical Formulation: Distance (km) ÷ Fuel Mileage (km/L) × Current Diesel Price (₹/L)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center bg-[#F8F8F6] p-3.5 rounded border border-cr-border">
            <div>
              <span className="text-cr-muted text-[10px] block">CURRENT DIESEL BENCHMARK</span>
              <strong className="text-base font-bold text-cr-text">₹95.00 / L</strong>
            </div>
            <div>
              <span className="text-cr-muted text-[10px] block">FLEET AVG MILEAGE</span>
              <strong className="text-base font-bold text-cr-text">4.2 km / L</strong>
            </div>
            <div>
              <span className="text-cr-muted text-[10px] block">ESTIMATED RUNNING ₹/KM</span>
              <strong className="text-base font-bold text-cr-red">₹22.62 / km</strong>
            </div>
          </div>
        </div>
      </div>

      {/* EXPENSES TABLE */}
      <div className="cr-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F8F6] border-b border-cr-border text-cr-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Vehicle #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border bg-white">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-cr-gray/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cr-text">{e.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-black text-cr-red">{e.vehicleReg}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFEFEA] text-cr-text">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">{e.description}</td>
                  <td className="py-3.5 px-4 text-cr-muted">{e.date}</td>
                  <td className="py-3.5 px-4 text-cr-muted">{e.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-cr-text">{formatINR(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 border border-cr-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <h3 className="font-extrabold text-base text-cr-text">Record Expense Voucher</h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-cr-gray text-cr-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-cr-muted block mb-1">Target Vehicle Asset</label>
                <select
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.regNumber}>{v.regNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                >
                  <option value="Fuel">Fuel (Diesel Refuel)</option>
                  <option value="Driver">Driver Wages & Daily Allowance</option>
                  <option value="Toll">FASTag Toll Surcharge</option>
                  <option value="Maintenance">Maintenance & Parts</option>
                  <option value="Handling">Handling & Transshipment</option>
                </select>
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Voucher Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>

              <div>
                <label className="text-cr-muted block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text font-bold"
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
                Record Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
