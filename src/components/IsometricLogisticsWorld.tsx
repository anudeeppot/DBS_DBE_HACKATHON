import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Train, Plane, Warehouse, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  interactive?: boolean;
  className?: string;
}

export const IsometricLogisticsWorld: React.FC<Props> = ({ interactive = true, className = '' }) => {
  const [selectedHub, setSelectedHub] = useState<string | null>('hyd');

  const hubs = [
    { id: 'hyd', name: 'Hyderabad Multimodal Central', x: 260, y: 380, load: '92% Utilized', type: 'Primary Freight Gate' },
    { id: 'ngp', name: 'Nagpur Transshipment Hub', x: 500, y: 270, load: '78% Utilized', type: 'Rail & Road Intermodal' },
    { id: 'del', name: 'Delhi NCR Consolidation Park', x: 740, y: 160, load: '88% Utilized', type: 'Northern Terminal' },
    { id: 'mum', name: 'Mumbai Port Logistics Terminal', x: 180, y: 220, load: '95% Utilized', type: 'Maritime & Air Cargo' }
  ];

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-cr-border bg-[#F3F3EF] p-4 select-none ${className}`}>
      {/* Simulation Grid Background */}
      <div className="absolute inset-0 bg-industrial-grid opacity-60 pointer-events-none" />

      {/* Header Info Tag */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-cr-border/80 pb-3 mb-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cr-text text-white tracking-wider uppercase">
            LIVE SIMULATION MATRIX
          </span>
          <span className="text-xs font-mono text-cr-muted">Corridor NH44 / DFCC Freight Grid</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 4 Active Corridors
          </span>
          <span className="text-cr-muted">Telemetry: 240Hz</span>
        </div>
      </div>

      {/* SVG Isometric World Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[500px] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full drop-shadow-sm"
          style={{ transform: 'scale(0.98)' }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A4A48" />
              <stop offset="100%" stopColor="#323230" />
            </linearGradient>
            <linearGradient id="railGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A8A86" />
              <stop offset="100%" stopColor="#5E5E5A" />
            </linearGradient>
            <linearGradient id="whGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5E5E1" />
            </linearGradient>
            <linearGradient id="redAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0382B" />
              <stop offset="100%" stopColor="#C92A1D" />
            </linearGradient>
            <pattern id="isoGrid" width="40" height="24" patternUnits="userSpaceOnUse">
              <path d="M 0 12 L 20 0 L 40 12 L 20 24 Z" fill="none" stroke="#E2E2DC" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Isometric Ground Base Plate */}
          <polygon
            points="500,20 960,250 500,530 40,280"
            fill="#ECECE7"
            stroke="#DCDCD6"
            strokeWidth="1.5"
          />
          <polygon
            points="500,20 960,250 500,530 40,280"
            fill="url(#isoGrid)"
            opacity="0.4"
          />
          <polygon
            points="40,280 500,530 500,545 40,295"
            fill="#D5D5CF"
          />
          <polygon
            points="500,530 960,250 960,265 500,545"
            fill="#C2C2BC"
          />

          {/* --- HIGHWAY SYSTEM (Asphalt Roads) --- */}
          {/* Main Corridor 1: Hyderabad to Nagpur (Road) */}
          <path
            d="M 260 380 L 500 270"
            stroke="#2B2B29"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 260 380 L 500 270"
            stroke="#FFD400"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />

          {/* Corridor 2: Mumbai to Nagpur */}
          <path
            d="M 180 220 L 500 270"
            stroke="#2B2B29"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 180 220 L 500 270"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />

          {/* Corridor 3: Dedicated Freight Railway Track: Nagpur to Delhi */}
          <path
            d="M 500 270 L 740 160"
            stroke="#4A4A46"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 500 270 L 740 160"
            stroke="#D4D4CE"
            strokeWidth="10"
            strokeDasharray="4 8"
          />

          {/* Flight Path Arc: Hyderabad to Delhi */}
          <path
            d="M 260 380 Q 500 100 740 160"
            fill="none"
            stroke="#C92A1D"
            strokeWidth="1.8"
            strokeDasharray="5 5"
            opacity="0.75"
          />

          {/* --- ANIMATED ASSETS (Vehicles & Trains) --- */}

          {/* 1. Animated Truck: Moving from Hyderabad towards Nagpur */}
          <motion.g
            animate={{
              x: [0, 240, 0],
              y: [0, -110, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Truck Shadow */}
            <ellipse cx="260" cy="385" rx="14" ry="7" fill="rgba(0,0,0,0.25)" />
            {/* Truck Cargo Box */}
            <polygon points="252,360 268,352 276,356 260,364" fill="#FFFFFF" stroke="#D1D1CB" strokeWidth="0.8" />
            <polygon points="268,352 276,356 276,370 268,366" fill="#DCDCD6" />
            <polygon points="252,360 260,364 260,378 252,374" fill="#E8E8E2" />
            {/* Truck Cabin (Red Accent) */}
            <polygon points="260,364 268,360 272,362 264,366" fill="#C92A1D" />
            <polygon points="260,364 264,366 264,374 260,372" fill="#9F2118" />
            {/* Cargo branding dot */}
            <circle cx="256" cy="367" r="1.5" fill="#FFD400" />
          </motion.g>

          {/* 2. Animated Train: Moving from Nagpur to Delhi */}
          <motion.g
            animate={{
              x: [0, 240, 0],
              y: [0, -110, 0]
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {/* Train Wagons (Concor Container Rake) */}
            <g transform="translate(480, 260)">
              <polygon points="0,10 24,-2 28,0 4,12" fill="#2E5B88" />
              <polygon points="24,-2 28,0 28,8 24,6" fill="#1C3D5C" />
              <polygon points="0,10 4,12 4,20 0,18" fill="#234A70" />
              
              <polygon points="12,4 36,-8 40,-6 16,6" fill="#C92A1D" />
              <polygon points="36,-8 40,-6 40,2 36,0" fill="#9F2118" />
              <polygon points="12,4 16,6 16,14 12,12" fill="#B02318" />
            </g>
          </motion.g>

          {/* 3. Animated Cargo Aircraft: Hyderabad to Delhi */}
          <motion.g
            animate={{
              x: [0, 480],
              y: [0, -220]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <g transform="translate(260, 360)">
              {/* Aircraft shape */}
              <ellipse cx="0" cy="0" rx="8" ry="3" fill="#FFFFFF" stroke="#C92A1D" strokeWidth="1" />
              <polygon points="-4,-2 0,-8 2,-8 -2,-2" fill="#111111" />
              <polygon points="-4,2 0,8 2,8 -2,2" fill="#111111" />
              <circle cx="6" cy="0" r="1.5" fill="#FFD400" />
            </g>
          </motion.g>

          {/* --- WAREHOUSES & HUBS --- */}

          {/* HUB 1: Hyderabad (Bottom Left) */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setSelectedHub('hyd')}
            transform="translate(200, 320)"
          >
            {/* Warehouse building 3D */}
            <polygon points="30,40 70,20 100,35 60,55" fill="#FFFFFF" stroke="#D1D1CB" strokeWidth="1" />
            <polygon points="60,55 100,35 100,70 60,90" fill="#D8D8D2" />
            <polygon points="30,40 60,55 60,90 30,75" fill="#EEEEEA" />
            {/* Roof Solar Panels & Red Stripes */}
            <polygon points="40,38 65,25 75,30 50,43" fill="#111111" />
            <line x1="60" y1="58" x2="60" y2="88" stroke="#C92A1D" strokeWidth="3" />
            {/* Hub Marker Flag */}
            <circle cx="60" cy="20" r="14" fill="#C92A1D" className="group-hover:scale-110 transition-transform origin-center" />
            <text x="60" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">HYD</text>
          </g>

          {/* HUB 2: Nagpur Transshipment Junction (Center) */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setSelectedHub('ngp')}
            transform="translate(450, 200)"
          >
            {/* Intermodal Hub Dual Warehouse */}
            <polygon points="20,40 60,20 85,32 45,52" fill="#FFFFFF" stroke="#D1D1CB" strokeWidth="1" />
            <polygon points="45,52 85,32 85,65 45,85" fill="#D8D8D2" />
            <polygon points="20,40 45,52 45,85 20,73" fill="#EEEEEA" />

            {/* Container Stacks (Yellow and Red) */}
            <polygon points="75,65 95,55 105,60 85,70" fill="#FFD400" />
            <polygon points="75,55 95,45 105,50 85,60" fill="#C92A1D" />

            {/* Hub Marker */}
            <circle cx="50" cy="15" r="14" fill="#111111" stroke="#FFD400" strokeWidth="2" className="group-hover:scale-110 transition-transform origin-center" />
            <text x="50" y="19" textAnchor="middle" fill="#FFD400" fontSize="9" fontWeight="bold" fontFamily="sans-serif">NGP</text>
          </g>

          {/* HUB 3: Delhi NCR Cargo Complex (Top Right) */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setSelectedHub('del')}
            transform="translate(700, 90)"
          >
            {/* Large Distribution Center */}
            <polygon points="10,45 60,20 110,45 60,70" fill="#FFFFFF" stroke="#D1D1CB" strokeWidth="1" />
            <polygon points="60,70 110,45 110,85 60,110" fill="#D8D8D2" />
            <polygon points="10,45 60,70 60,110 10,85" fill="#EEEEEA" />
            {/* Loading Docks */}
            <rect x="25" y="85" width="8" height="14" fill="#333333" />
            <rect x="40" y="92" width="8" height="14" fill="#333333" />
            {/* Hub Marker */}
            <circle cx="60" cy="15" r="14" fill="#C92A1D" className="group-hover:scale-110 transition-transform origin-center" />
            <text x="60" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">DEL</text>
          </g>

          {/* HUB 4: Mumbai Port Hub (Left) */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setSelectedHub('mum')}
            transform="translate(130, 160)"
          >
            <polygon points="20,35 55,18 80,30 45,47" fill="#FFFFFF" stroke="#D1D1CB" strokeWidth="1" />
            <polygon points="45,47 80,30 80,58 45,75" fill="#D8D8D2" />
            <polygon points="20,35 45,47 45,75 20,63" fill="#EEEEEA" />
            <circle cx="50" cy="12" r="13" fill="#111111" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="50" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">BOM</text>
          </g>

          {/* Dynamic Glowing Rings around Selected Hub */}
          {selectedHub === 'hyd' && (
            <circle cx="260" cy="380" r="28" fill="none" stroke="#C92A1D" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin origin-[260px_380px]" />
          )}
          {selectedHub === 'ngp' && (
            <circle cx="500" cy="270" r="28" fill="none" stroke="#FFD400" strokeWidth="2" strokeDasharray="4 4" className="animate-spin origin-[500px_270px]" />
          )}
          {selectedHub === 'del' && (
            <circle cx="760" cy="160" r="28" fill="none" stroke="#C92A1D" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin origin-[760px_160px]" />
          )}
        </svg>
      </div>

      {/* Interactive Hub Detail Strip */}
      {interactive && (
        <div className="mt-3 pt-3 border-t border-cr-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cr-muted uppercase tracking-wider">Active Node:</span>
            <span className="font-bold text-cr-text">
              {hubs.find(h => h.id === selectedHub)?.name}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[11px] font-semibold">
              {hubs.find(h => h.id === selectedHub)?.load}
            </span>
          </div>

          <div className="flex items-center gap-2 text-cr-muted">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cr-red rounded-sm"></span> Dedicated Fleet</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#4A4A46] rounded-sm"></span> Rail Freight</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cr-yellow rounded-sm"></span> Buffer Yard</span>
          </div>
        </div>
      )}
    </div>
  );
};
