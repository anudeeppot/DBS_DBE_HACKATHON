import React, { useState } from 'react';
import { 
  Sparkles, Route, Truck, Train, Plane, Clock, DollarSign, 
  Leaf, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, 
  SlidersHorizontal, ChevronRight, Layers, AlertCircle, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAJOR_HUBS, generateRouteOptions } from '../data/routes';
import { RouteOption, TransportMode, GoodsType } from '../types';
import { formatINR, formatWeight, formatVolume, formatDistance } from '../utils/formatters';
import { useLogistics } from '../context/LogisticsContext';

export const RouteOptimizerPage: React.FC = () => {
  const { createShipment } = useLogistics();
  const [origin, setOrigin] = useState('Hyderabad');
  const [destination, setDestination] = useState('Delhi');
  const [weightTons, setWeightTons] = useState(8.5);
  const [volumeM3, setVolumeM3] = useState(32.0);
  const [goodsType, setGoodsType] = useState<GoodsType>('Electronics');
  const [preferredMode, setPreferredMode] = useState<TransportMode>('Multimodal');

  // Optimization sequence state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [routeResults, setRouteResults] = useState<RouteOption[] | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [bookedRouteId, setBookedRouteId] = useState<string | null>(null);

  const optimizationSteps = [
    'Parsing Origin & Destination Node Coordinates...',
    'Querying Indian Railways CONCOR Freight Timetables...',
    'Scanning Active Fleet Headroom & Empty Backhaul Corridors...',
    'Calculating Dynamic Tolls (FASTag) & Fuel Consumption Matrices...',
    'Running Dual Weight & Volume Container Packing Simulation...',
    'Optimizing Multimodal Transfer Windows & Hub Turnaround Times...',
    'Synthesizing Ranked Route Recommendations...'
  ];

  const handlePlanRoute = () => {
    setIsOptimizing(true);
    setCurrentStepIndex(0);
    setRouteResults(null);
    setSelectedRouteId(null);
    setBookedRouteId(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < optimizationSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsOptimizing(false);
        const results = generateRouteOptions(origin, destination, weightTons, volumeM3, goodsType, preferredMode);
        setRouteResults(results);
        setSelectedRouteId(results[0]?.id || null);
      }
    }, 450);
  };

  const handleBookRoute = (route: RouteOption) => {
    createShipment({
      origin,
      destination,
      weightTons,
      volumeM3,
      goodsType,
      transportMode: route.mode,
      revenue: route.suggestedCustomerPrice,
      priority: 'Express'
    });
    setBookedRouteId(route.id);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-cr-border pb-5">
        <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
          ALGORITHMIC MULTIMODAL LOGISTICS
        </span>
        <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
          Route & Multimodal Optimizer
        </h1>
        <p className="text-sm text-cr-muted mt-1">
          Simulate and rank Rail + Road + Air freight combinations using dual weight/volume constraints and live hub schedules.
        </p>
      </div>

      {/* PLANNER INPUT FORM */}
      <div className="cr-card rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Origin */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-cr-muted uppercase">Origin Hub</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-[#F8F8F6] border border-cr-border rounded-md px-3 py-2 text-sm font-semibold text-cr-text focus:outline-none focus:border-cr-red"
            >
              {MAJOR_HUBS.map(hub => (
                <option key={hub} value={hub} disabled={hub === destination}>{hub}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-cr-muted uppercase">Destination Hub</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#F8F8F6] border border-cr-border rounded-md px-3 py-2 text-sm font-semibold text-cr-text focus:outline-none focus:border-cr-red"
            >
              {MAJOR_HUBS.map(hub => (
                <option key={hub} value={hub} disabled={hub === origin}>{hub}</option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-mono font-bold text-cr-muted uppercase">Cargo Weight (Tons)</label>
              <span className="font-mono font-bold text-cr-text">{weightTons} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              value={weightTons}
              onChange={(e) => setWeightTons(parseFloat(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-mono font-bold text-cr-muted uppercase">Volume (m³)</label>
              <span className="font-mono font-bold text-cr-text">{volumeM3} m³</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="70.0"
              step="1.0"
              value={volumeM3}
              onChange={(e) => setVolumeM3(parseFloat(e.target.value))}
              className="w-full accent-cr-red h-2 bg-cr-gray rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-cr-border">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-cr-muted uppercase">Commodity Category</label>
            <select
              value={goodsType}
              onChange={(e) => setGoodsType(e.target.value as GoodsType)}
              className="w-full bg-[#F8F8F6] border border-cr-border rounded-md px-3 py-2 text-xs font-semibold text-cr-text focus:outline-none focus:border-cr-red"
            >
              <option value="Electronics">Electronics (High Value / Fragile)</option>
              <option value="Pharmaceuticals">Pharmaceuticals (Cold-chain priority)</option>
              <option value="Automotive Parts">Automotive Parts (Just-in-Time)</option>
              <option value="General Cargo">General Industrial Cargo</option>
              <option value="FMCG">FMCG & Consumer Packaged Goods</option>
              <option value="Textiles">Textiles & Garments</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-cr-muted uppercase">Preferred Mode Bias</label>
            <select
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value as TransportMode)}
              className="w-full bg-[#F8F8F6] border border-cr-border rounded-md px-3 py-2 text-xs font-semibold text-cr-text focus:outline-none focus:border-cr-red"
            >
              <option value="Multimodal">Multimodal (Cost + Speed Balanced)</option>
              <option value="Truck">Pure Direct Road Freight (No transfers)</option>
              <option value="Train">Rail Freight (Low Carbon / High Weight)</option>
              <option value="Flight">Air Express (Urgent & High Margin)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePlanRoute}
              disabled={isOptimizing}
              className="w-full py-2.5 rounded-md bg-cr-red hover:bg-cr-red-dark disabled:bg-cr-muted text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cr-yellow" />
                  <span>Optimizing Multimodal Network...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cr-yellow" />
                  <span>Compute Optimal Corridors</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* OPTIMIZATION RUNNING SEQUENCE */}
      {isOptimizing && (
        <div className="cr-card rounded-lg p-6 bg-slate-900 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-cr-yellow font-bold">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>CARGOROUTE ENGINE: OPTIMIZATION IN PROGRESS</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Step {currentStepIndex + 1} of {optimizationSteps.length}
            </span>
          </div>

          <div className="space-y-2">
            {optimizationSteps.map((stepText, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs font-mono transition-opacity duration-200 ${
                  idx === currentStepIndex
                    ? 'text-white font-bold'
                    : idx < currentStepIndex
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {idx < currentStepIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : idx === currentStepIndex ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cr-yellow border-t-transparent animate-spin shrink-0"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                )}
                <span>{stepText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RANKED ROUTE RESULTS */}
      {routeResults && !isOptimizing && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cr-border pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-cr-text tracking-tight">
                Recommended Transport Corridors ({origin} → {destination})
              </h2>
              <p className="text-xs font-mono text-cr-muted mt-0.5">
                Evaluated across {weightTons}T / {volumeM3}m³ payload against 14 national hubs
              </p>
            </div>
            <span className="text-xs font-mono bg-cr-gray px-3 py-1 rounded text-cr-text font-bold">
              {routeResults.length} Feasible Routes Found
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routeResults.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const isBooked = bookedRouteId === route.id;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`cr-card rounded-lg p-5 cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-cr-red shadow-lg bg-white' : 'border-cr-border hover:border-slate-400 bg-[#FCFCFA]'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between border-b border-cr-border pb-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          route.badge === 'RECOMMENDED' ? 'bg-cr-red text-white' : 'bg-cr-gray text-slate-800'
                        }`}>
                          {route.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          {route.matchScore}% Match Score
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-cr-text">{route.title}</h3>
                      <p className="text-xs text-cr-muted font-mono mt-0.5">{route.corridor}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-cr-text">{formatINR(route.suggestedCustomerPrice)}</div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 block">
                        +{formatINR(route.expectedProfit)} profit ({route.profitMargin}%)
                      </span>
                    </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-4 gap-2 py-3 bg-[#F7F7F5] rounded p-2 text-center text-xs font-mono mb-4 border border-cr-border">
                    <div>
                      <span className="text-cr-muted text-[10px] block">TRANSIT TIME</span>
                      <strong className="text-cr-text font-bold">{route.totalDurationHours} hrs</strong>
                    </div>
                    <div>
                      <span className="text-cr-muted text-[10px] block">DISTANCE</span>
                      <strong className="text-cr-text font-bold">{formatDistance(route.totalDistanceKm)}</strong>
                    </div>
                    <div>
                      <span className="text-cr-muted text-[10px] block">TRANSFERS</span>
                      <strong className="text-cr-text font-bold">{route.numberOfTransfers} Hubs</strong>
                    </div>
                    <div>
                      <span className="text-cr-muted text-[10px] block">CO₂ FOOTPRINT</span>
                      <strong className="text-emerald-700 font-bold">{route.co2Kg} kg</strong>
                    </div>
                  </div>

                  {/* Named Service Legs */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-[11px] font-mono font-bold text-cr-muted uppercase">Corridor Legs & Assigned Services</h4>
                    {route.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="p-2.5 rounded bg-white border border-cr-border text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0">
                            {leg.mode === 'Train' ? (
                              <Train className="w-4 h-4 text-emerald-700" />
                            ) : leg.mode === 'Flight' ? (
                              <Plane className="w-4 h-4 text-blue-700" />
                            ) : (
                              <Truck className="w-4 h-4 text-cr-red" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-cr-text block">{leg.service.serviceName}</span>
                            <span className="text-[10px] font-mono text-cr-muted">
                              {leg.from} → {leg.to} ({leg.distanceKm} km • {leg.durationHours}h)
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cr-text">
                          {formatINR(leg.service.cost)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Booking Action */}
                  <div className="pt-3 border-t border-cr-border flex items-center justify-between">
                    <div className="text-xs text-cr-muted font-mono">
                      Operating Cost: {formatINR(route.estimatedCost)}
                    </div>

                    {isBooked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 text-white font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Route Active & Booked
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookRoute(route);
                        }}
                        className="px-4 py-1.5 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Dispatch & Book Shipment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
