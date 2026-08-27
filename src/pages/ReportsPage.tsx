import React from 'react';
import { 
  FileText, Download, Printer, Table, 
  CheckCircle2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { exportToCSV, triggerPrintReport } from '../utils/exportHelpers';

export const ReportsPage: React.FC = () => {
  const { shipments, vehicles, expenses, drivers } = useLogistics();

  const handleExportShipments = () => {
    exportToCSV('CargoRoute-Shipments-Report', shipments);
  };

  const handleExportFleet = () => {
    exportToCSV('CargoRoute-Fleet-Audit', vehicles);
  };

  const handleExportExpenses = () => {
    exportToCSV('CargoRoute-Expenses-Ledger', expenses);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            AUDIT REPORTS & DATA EXPORT
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Operational Verification & Downloads
          </h1>
        </div>
        <button
          onClick={triggerPrintReport}
          className="px-4 py-2 rounded bg-white border border-cr-border text-cr-text font-bold text-xs flex items-center gap-2 hover:bg-cr-gray transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Operational Dossier</span>
        </button>
      </div>

      {/* DOWNLOAD PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cr-card rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-cr-red/10 text-cr-red flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-cr-text">Shipments & Margins Ledger</h3>
              <span className="text-xs font-mono text-cr-muted">{shipments.length} Active Records</span>
            </div>
          </div>
          <p className="text-xs text-cr-muted leading-relaxed">
            Consolidated freight consigment data with full unit economics (diesel, wages, tolls, margin %).
          </p>
          <button
            onClick={handleExportShipments}
            className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Shipments CSV</span>
          </button>
        </div>

        <div className="cr-card rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-amber-100 text-amber-900 flex items-center justify-center">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-cr-text">Fleet Telemetry Audit</h3>
              <span className="text-xs font-mono text-cr-muted">{vehicles.length} Vehicle Assets</span>
            </div>
          </div>
          <p className="text-xs text-cr-muted leading-relaxed">
            Asset registration records, GPS telemetry, odometer readings, and payload utilization stats.
          </p>
          <button
            onClick={handleExportFleet}
            className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Fleet Assets CSV</span>
          </button>
        </div>

        <div className="cr-card rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-cr-text">Expense Vouchers & OPEX</h3>
              <span className="text-xs font-mono text-cr-muted">{expenses.length} Expense Records</span>
            </div>
          </div>
          <p className="text-xs text-cr-muted leading-relaxed">
            Detailed diesel receipts, FASTag road tolls, driver wage vouchers, and maintenance logs.
          </p>
          <button
            onClick={handleExportExpenses}
            className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download OPEX Ledger CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
