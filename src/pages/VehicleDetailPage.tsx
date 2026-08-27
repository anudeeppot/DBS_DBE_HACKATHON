import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Truck, MapPin, User, ShieldCheck, Fuel, Wrench, 
  ArrowLeft, Clock, DollarSign, Activity, CheckCircle 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { CapacityVisualizer } from '../components/CapacityVisualizer';
import { formatINR, formatWeight, formatVolume, formatDistance } from '../utils/formatters';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVehicleById, shipments } = useLogistics();

  const vehicle = getVehicleById(id || 'veh-01') || getVehicleById('TS09AB1234');

  if (!vehicle) {
    return (
      <div className="cr-card rounded-lg p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-cr-text">Vehicle Asset Not Found</h2>
        <Link to="/fleet" className="text-cr-red hover:underline text-xs font-mono font-bold">
          ← Return to Fleet Directory
        </Link>
      </div>
    );
  }

  const assignedShipments = shipments.filter(s => s.assignedVehicleId === vehicle.id || s.assignedVehicleReg === vehicle.regNumber);
  const tripProfit = vehicle.totalTripRevenue - vehicle.totalTripCost;
  const tripMarginPct = vehicle.totalTripRevenue > 0 ? ((tripProfit / vehicle.totalTripRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-cr-border pb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/fleet"
            className="p-2 rounded hover:bg-cr-gray text-cr-muted hover:text-cr-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cr-muted uppercase">{vehicle.type}</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                vehicle.status === 'In Transit' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
              {vehicle.regNumber}
            </h1>
          </div>
        </div>

        <Link
          to="/live-tracking"
          className="px-4 py-2 rounded bg-slate-900 text-white font-bold text-xs flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Live GPS Position</span>
        </Link>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Speed & Coordinates</span>
          <div className="text-xl font-black text-cr-text mt-1">{vehicle.currentLocation.speedKmph} km/h</div>
          <span className="text-[10px] text-cr-muted">{vehicle.currentLocation.lat.toFixed(4)}°N, {vehicle.currentLocation.lng.toFixed(4)}°E</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Trip Progress</span>
          <div className="text-xl font-black text-cr-text mt-1">{formatDistance(vehicle.distanceCoveredKm)}</div>
          <span className="text-[10px] text-cr-muted">{formatDistance(vehicle.distanceRemainingKm)} remaining</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Realized Trip Profit</span>
          <div className="text-xl font-black text-emerald-700 mt-1">+{formatINR(tripProfit)}</div>
          <span className="text-[10px] text-emerald-600 font-bold">{tripMarginPct}% Margin</span>
        </div>
        <div className="cr-card rounded p-4">
          <span className="text-[10px] text-cr-muted uppercase font-bold">Asset Health Score</span>
          <div className="text-xl font-black text-cr-text mt-1">{vehicle.healthScore} / 100</div>
          <span className="text-[10px] text-cr-muted">Next Service: in {vehicle.serviceDueInKm} km</span>
        </div>
      </div>

      {/* CAPACITY & ROUTE PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <CapacityVisualizer
            maxWeightTons={vehicle.maxWeightTons}
            currentWeightTons={vehicle.currentWeightTons}
            maxVolumeM3={vehicle.maxVolumeM3}
            currentVolumeM3={vehicle.currentVolumeM3}
            title="Real-Time Container Fill Telemetry"
            show3DBox={true}
          />

          {/* DRIVER PROFILE */}
          <div className="cr-card rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <h3 className="font-extrabold text-sm text-cr-text">Assigned Commercial Pilot</h3>
              <Link to="/drivers" className="text-xs font-bold text-cr-red hover:underline font-mono">
                Driver Roster →
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {vehicle.driverName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0 font-mono text-xs">
                <h4 className="font-extrabold text-sm text-cr-text">{vehicle.driverName}</h4>
                <p className="text-cr-muted">Contact: {vehicle.driverPhone}</p>
                <p className="text-emerald-700 font-semibold mt-0.5">Safety Rating: 4.9 ★ • Zero Violations</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE PROGRESS WAYPOINTS & ASSIGNED CARGO */}
        <div className="lg:col-span-6 space-y-6">
          {/* Stops */}
          <div className="cr-card rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <h3 className="font-extrabold text-sm text-cr-text">Scheduled Route Progress Stops</h3>
              <span className="text-xs font-mono text-cr-muted">{vehicle.origin} → {vehicle.destination}</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cr-border">
              {vehicle.routeStops.map((stop, sIdx) => (
                <div key={sIdx} className="relative font-mono text-xs">
                  <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                    stop.status === 'completed' ? 'bg-cr-red border-cr-red' :
                    stop.status === 'current' ? 'bg-cr-yellow border-slate-900 animate-pulse' :
                    'bg-white border-cr-border'
                  }`} />
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-cr-text block">{stop.city}, {stop.state}</span>
                      <span className="text-[10px] text-cr-muted">
                        {stop.distanceFromStartKm} km • Status: {stop.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-cr-text">
                      {stop.actualArrival || stop.eta || 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Freight Cargo in Container */}
          <div className="cr-card rounded-lg p-5 space-y-3 font-mono text-xs">
            <h3 className="font-extrabold text-sm text-cr-text font-sans">Active Consignments Inside Container</h3>
            {assignedShipments.map(s => (
              <div key={s.id} className="p-3 rounded bg-[#F8F8F6] border border-cr-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-cr-red block">{s.trackingNumber}</span>
                  <span className="text-cr-muted text-[11px]">{s.customerName} • {formatWeight(s.weightTons)}</span>
                </div>
                <span className="font-extrabold text-emerald-700">+{formatINR(s.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
