import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, Zap, ChevronRight, Check } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { formatINR } from '../utils/formatters';
import confetti from 'canvas-confetti';

export const NotificationDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { alerts, markAlertRead, markAllAlertsRead, opportunities, acceptIntermediateShipment } = useLogistics();

  const handleAccept = (oppId: string) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    acceptIntermediateShipment(oppId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 border-l border-cr-border shadow-2xl flex flex-col"
          >
            <div className="h-16 px-6 border-b border-cr-border flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-cr-text text-base">Command Center Feed</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cr-gray text-cr-muted">
                  {alerts.length} Total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAlertsRead}
                  className="text-xs font-semibold text-cr-muted hover:text-cr-text hover:underline"
                >
                  Mark all read
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-cr-gray text-cr-muted hover:text-cr-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cr-muted uppercase tracking-wider">
                  ACTIONABLE INTERMEDIATE CARGO INGESTION
                </h4>
                {opportunities.filter(o => !o.isAccepted).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-lg bg-amber-50/70 border border-amber-300 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cr-yellow text-slate-900 mb-1">
                          <Zap className="w-3 h-3 fill-slate-900" /> {opp.routeCompatibilityScore}% Route Fit
                        </span>
                        <h5 className="font-bold text-sm text-cr-text">{opp.shipmentTitle}</h5>
                        <p className="text-xs text-cr-muted font-mono">{opp.origin} → {opp.destination}</p>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-700">
                        +{formatINR(opp.netAdditionalProfit)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2 rounded border border-amber-200">
                      <div><span className="text-cr-muted">Payload:</span> <strong className="text-cr-text">{opp.weightTons}T / {opp.volumeM3}m³</strong></div>
                      <div><span className="text-cr-muted">Target:</span> <strong className="text-cr-text">{opp.targetVehicleReg}</strong></div>
                      <div><span className="text-cr-muted">Revenue:</span> <strong className="text-cr-text">{formatINR(opp.offeredRevenue)}</strong></div>
                      <div><span className="text-cr-muted">Margin:</span> <strong className="text-emerald-600">{opp.incrementalMarginPct}%</strong></div>
                    </div>

                    <button
                      onClick={() => handleAccept(opp.id)}
                      className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ingest Cargo to {opp.targetVehicleReg}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-cr-border">
                <h4 className="text-xs font-mono font-bold text-cr-muted uppercase tracking-wider">
                  TELEMETRY & LOGISTICS EVENTS
                </h4>
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => markAlertRead(alert.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      alert.read ? 'bg-[#FAFAF8] border-cr-border opacity-70' : 'bg-white border-cr-border shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : alert.severity === 'opportunity' ? (
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-xs text-cr-text truncate">{alert.title}</h6>
                          <span className="text-[10px] font-mono text-cr-muted shrink-0">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-cr-muted mt-1 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
