import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Truck, Navigation, AlertCircle, ArrowRight, 
  ShieldCheck, Activity, Gauge, MapPin 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Vehicle } from '../types';
import { formatINR, formatWeight, formatDistance } from '../utils/formatters';

// Custom SVG Leaflet marker icons
const createCustomIcon = (status: Vehicle['status'], isSelected: boolean) => {
  const bgColor = status === 'In Transit' ? '#C92A1D' : status === 'Idle' ? '#111111' : '#E7E7E4';
  const ring = isSelected ? 'ring: 3px solid #FFD400;' : '';
  
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
        ${ring}
      ">
        ▲
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const LiveTrackingPage: React.FC = () => {
  const { vehicles } = useLogistics();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            SATELLITE TELEMETRY & GPS MESH
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Live Fleet Radar & Corridors
          </h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-cr-text">Real-Time Simulation Feed Active</span>
        </div>
      </div>

      {/* MAP & SIDEBAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        {/* LEAFLET MAP CONTAINER (8 cols) */}
        <div className="lg:col-span-8 cr-card rounded-lg overflow-hidden relative shadow-md">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> Positron'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Render Vehicle Markers */}
            {vehicles.map((veh) => (
              <Marker
                key={veh.id}
                position={[veh.currentLocation.lat, veh.currentLocation.lng]}
                icon={createCustomIcon(veh.status, selectedVehicleId === veh.id)}
                eventHandlers={{
                  click: () => setSelectedVehicleId(veh.id)
                }}
              >
                <Popup>
                  <div className="p-2 font-mono text-xs space-y-1">
                    <strong className="text-cr-red block text-sm">{veh.regNumber}</strong>
                    <div>{veh.origin} → {veh.destination}</div>
                    <div>Speed: <strong>{veh.currentLocation.speedKmph} km/h</strong></div>
                    <div>Payload: {formatWeight(veh.currentWeightTons)}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Route Polyline for Selected Vehicle */}
            {selectedVehicle && selectedVehicle.routeStops.length > 1 && (
              <Polyline
                positions={selectedVehicle.routeStops.map(s => [s.latitude, s.longitude])}
                color="#C92A1D"
                weight={3}
                dashArray="5, 8"
                opacity={0.8}
              />
            )}
          </MapContainer>
        </div>

        {/* VEHICLE INSPECTION SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {selectedVehicle && (
            <div className="cr-card rounded-lg p-5 space-y-5">
              <div className="flex items-start justify-between border-b border-cr-border pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cr-muted uppercase">ACTIVE ASSET TELEMETRY</span>
                  <h3 className="font-black text-xl text-cr-text">{selectedVehicle.regNumber}</h3>
                  <p className="text-xs text-cr-muted font-mono">{selectedVehicle.makeModel}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                  {selectedVehicle.status}
                </span>
              </div>

              {/* Real-Time Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">SPEED</span>
                  <strong className="text-base text-cr-text font-bold">{selectedVehicle.currentLocation.speedKmph} km/h</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">CORRIDOR ETA</span>
                  <strong className="text-base text-cr-text font-bold">{selectedVehicle.eta}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">DISTANCE COVERED</span>
                  <strong className="text-cr-text font-bold">{formatDistance(selectedVehicle.distanceCoveredKm)}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">CURRENT PAYLOAD</span>
                  <strong className="text-cr-text font-bold">{formatWeight(selectedVehicle.currentWeightTons)}</strong>
                </div>
              </div>

              {/* DRIVER INFO */}
              <div className="p-3 rounded bg-white border border-cr-border text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-cr-muted">Driver:</span>
                  <strong className="text-cr-text">{selectedVehicle.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cr-muted">Contact:</span>
                  <strong className="text-cr-text">{selectedVehicle.driverPhone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cr-muted">Trip Margin:</span>
                  <strong className="text-emerald-700">+{formatINR(selectedVehicle.totalTripRevenue - selectedVehicle.totalTripCost)}</strong>
                </div>
              </div>

              {/* WAYPOINT PROGRESS */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold text-cr-muted uppercase">Route Checkpoints</h4>
                <div className="space-y-1.5 text-xs font-mono max-h-40 overflow-y-auto">
                  {selectedVehicle.routeStops.map((stop, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between p-2 rounded bg-[#F8F8F6]">
                      <span className="font-bold text-cr-text">{stop.city}</span>
                      <span className="text-[10px] text-cr-muted">{stop.status.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLEET ASSET LIST SELECTOR */}
          <div className="cr-card rounded-lg p-4 space-y-3">
            <h4 className="font-bold text-xs text-cr-text">All Tracked Vehicles</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedVehicleId === v.id ? 'bg-slate-900 text-white' : 'hover:bg-cr-gray text-cr-text'
                  }`}
                >
                  <span className="font-bold">{v.regNumber}</span>
                  <span className="text-[10px] opacity-75">{v.origin} → {v.destination}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
