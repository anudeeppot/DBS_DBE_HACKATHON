import React, { useState } from 'react';
import { 
  Boxes, Zap, CheckCircle2, ArrowRight, TrendingUp, 
  Weight, Box, Truck, ShieldAlert, Sparkles, Check 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { CapacityVisualizer } from '../components/CapacityVisualizer';
import { formatINR, formatWeight, formatVolume, formatPercentage } from '../utils/formatters';
import confetti from 'canvas-confetti';

export const CapacityOptimizerPage: React.FC = () => {
  const { vehicles, opportunities, acceptIntermediateShipment } = useLogistics();
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');

  const activeOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];
  const targetVehicle = vehicles.find(v => v.id === activeOpp?.targetVehicleId) || vehicles[0];

  const handleAccept = (oppId: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    acceptIntermediateShipment(oppId);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-cr-border pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            REACTIVE BACKHAUL & HEADROOM ENGINE
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cr-yellow text-slate-900 font-bold">
            DUAL-CONSTRAINT OPTIMIZER
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
          Intermediate Cargo Ingestion & Capacity Matcher
        </h1>
        <p className="text-sm text-cr-muted mt-1 max-w-3xl">
          Monitors active transit trucks along their scheduled stops. Automatically pairs empty headspace with intermediate hub demands, yielding up to 70%+ incremental profit margins.
        </p>
      </div>

      {/* CORE INTERACTIVE SIMULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: OPPORTUNITY SELECTOR & FINANCIAL SIMULATION (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cr-card rounded-lg p-5">
            <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
              <h3 className="font-extrabold text-cr-text text-sm tracking-tight">
                Live Intermediate Cargo Opportunities
              </h3>
              <span className="text-xs font-mono text-cr-muted">
                {opportunities.filter(o => !o.isAccepted).length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => {
                const isSelected = selectedOppId === opp.id;
                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOppId(opp.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cr-red bg-white shadow-md'
                        : opp.isAccepted
                        ? 'border-emerald-200 bg-emerald-50/50 opacity-75'
                        : 'border-cr-border bg-[#FAFAF8] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cr-yellow text-slate-900">
                            {opp.routeCompatibilityScore}% FIT
                          </span>
                          {opp.isAccepted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white">
                              ACCEPTED
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-cr-text">{opp.shipmentTitle}</h4>
                        <p className="text-xs font-mono text-cr-muted">{opp.origin} → {opp.destination}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-700 block">
                          +{formatINR(opp.netAdditionalProfit)}
                        </span>
                        <span className="text-[10px] font-mono text-cr-muted">
                          {opp.incrementalMarginPct}% Margin
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-cr-border/60 text-[11px] font-mono text-cr-muted">
                      <div>Payload: <strong className="text-cr-text">{opp.weightTons}T</strong></div>
                      <div>Volume: <strong className="text-cr-text">{opp.volumeM3}m³</strong></div>
                      <div>Target: <strong className="text-cr-text">{opp.targetVehicleReg}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* UNIT ECONOMICS OF SELECTED OPPORTUNITY */}
          {activeOpp && (
            <div className="cr-card rounded-lg p-5 bg-[#111111] text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-mono text-cr-yellow font-bold uppercase tracking-wider">
                  INCREMENTAL MARGIN BREAKDOWN
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  +{activeOpp.incrementalMarginPct}% REALIZED
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Offered Customer Freight:</span>
                  <span className="font-bold text-white">+{formatINR(activeOpp.offeredRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Additional Fuel (Minor Detour & Inertia):</span>
                  <span className="text-rose-400">-{formatINR(activeOpp.additionalFuelCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Allowance & Handling:</span>
                  <span className="text-rose-400">-{formatINR(activeOpp.additionalDriverCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Maintenance & Wear Surcharge:</span>
                  <span className="text-rose-400">-{formatINR(activeOpp.additionalMaintenanceCost)}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-300">Net Incremental Trip Profit:</span>
                  <span className="font-black text-emerald-400">+{formatINR(activeOpp.netAdditionalProfit)}</span>
                </div>
              </div>

              <div className="pt-2">
                {activeOpp.isAccepted ? (
                  <div className="w-full py-2.5 rounded bg-emerald-800/60 border border-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Shipment Ingested & Global State Updated</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAccept(activeOpp.id)}
                    className="w-full py-3 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-cr-yellow" />
                    <span>ACCEPT SHIPMENT & INGEST CARGO</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CAPACITY TELEMETRY & 3D VISUALIZATION (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {targetVehicle && activeOpp && (
            <>
              {/* VEHICLE PROFILE HEADER */}
              <div className="cr-card rounded-lg p-5">
                <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                      {targetVehicle.regNumber.substring(0, 4)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-cr-text">{targetVehicle.regNumber}</h3>
                      <p className="text-xs text-cr-muted font-mono">
                        {targetVehicle.type} • Driver: {targetVehicle.driverName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-cr-muted block">Scheduled Route</span>
                    <strong className="text-cr-text font-bold">{targetVehicle.origin} → {targetVehicle.destination}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-[#F8F8F6] p-3 rounded border border-cr-border text-center">
                  <div>
                    <span className="text-cr-muted text-[10px] block">CURRENT WEIGHT</span>
                    <strong className="text-cr-text font-bold">{formatWeight(targetVehicle.currentWeightTons)}</strong>
                  </div>
                  <div>
                    <span className="text-cr-muted text-[10px] block">CURRENT VOLUME</span>
                    <strong className="text-cr-text font-bold">{formatVolume(targetVehicle.currentVolumeM3)}</strong>
                  </div>
                  <div>
                    <span className="text-cr-muted text-[10px] block">TRIP PROFIT</span>
                    <strong className="text-emerald-700 font-bold">{formatINR(targetVehicle.totalTripRevenue - targetVehicle.totalTripCost)}</strong>
                  </div>
                </div>
              </div>

              {/* DUAL CAPACITY TELEMETRY VISUALIZER WITH SIMULATED PAYLOAD */}
              <CapacityVisualizer
                maxWeightTons={targetVehicle.maxWeightTons}
                currentWeightTons={targetVehicle.currentWeightTons}
                maxVolumeM3={targetVehicle.maxVolumeM3}
                currentVolumeM3={targetVehicle.currentVolumeM3}
                simulatedAdditionWeight={activeOpp.isAccepted ? 0 : activeOpp.weightTons}
                simulatedAdditionVolume={activeOpp.isAccepted ? 0 : activeOpp.volumeM3}
                title={`Target Asset Telemetry: ${targetVehicle.regNumber}`}
                show3DBox={true}
              />

              {/* ROUTE PROGRESS STOPS MAP */}
              <div className="cr-card rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-cr-border pb-3">
                  <h4 className="font-extrabold text-sm text-cr-text">Corridor Intermediate Hub Waypoints</h4>
                  <span className="text-xs font-mono text-cr-muted">Stop-by-Stop Telemetry</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cr-border">
                  {targetVehicle.routeStops.map((stop, sIdx) => {
                    const isPickup = stop.city === activeOpp.origin;
                    const isDrop = stop.city === activeOpp.destination;

                    return (
                      <div key={sIdx} className="relative">
                        <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                          stop.status === 'completed'
                            ? 'bg-cr-red border-cr-red'
                            : stop.status === 'current'
                            ? 'bg-cr-yellow border-slate-900 animate-pulse'
                            : isPickup || isDrop
                            ? 'bg-amber-400 border-amber-600 ring-2 ring-amber-300'
                            : 'bg-white border-cr-border'
                        }`} />

                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-cr-text">{stop.city}, {stop.state}</span>
                              {isPickup && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cr-yellow text-slate-900 font-bold">
                                  INGEST PICKUP NODE
                                </span>
                              )}
                              {isDrop && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                                  DELIVERY DROP NODE
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-cr-muted">
                              {stop.distanceFromStartKm} km from origin • Status: {stop.status.toUpperCase()}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-cr-muted font-bold">
                            {stop.actualArrival || stop.eta || 'Scheduled'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
