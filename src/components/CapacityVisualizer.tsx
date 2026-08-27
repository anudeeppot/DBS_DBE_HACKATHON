import React from 'react';
import { motion } from 'framer-motion';
import { Weight, Box, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatWeight, formatVolume, formatPercentage } from '../utils/formatters';

interface Props {
  maxWeightTons: number;
  currentWeightTons: number;
  maxVolumeM3: number;
  currentVolumeM3: number;
  simulatedAdditionWeight?: number;
  simulatedAdditionVolume?: number;
  title?: string;
  show3DBox?: boolean;
}

export const CapacityVisualizer: React.FC<Props> = ({
  maxWeightTons,
  currentWeightTons,
  maxVolumeM3,
  currentVolumeM3,
  simulatedAdditionWeight = 0,
  simulatedAdditionVolume = 0,
  title = 'Capacity Telemetry',
  show3DBox = true
}) => {
  const currentWeightPct = Math.min(100, (currentWeightTons / maxWeightTons) * 100);
  const simWeightPct = Math.min(100, ((currentWeightTons + simulatedAdditionWeight) / maxWeightTons) * 100);
  const remainingWeight = Math.max(0, maxWeightTons - (currentWeightTons + simulatedAdditionWeight));

  const currentVolPct = Math.min(100, (currentVolumeM3 / maxVolumeM3) * 100);
  const simVolPct = Math.min(100, ((currentVolumeM3 + simulatedAdditionVolume) / maxVolumeM3) * 100);
  const remainingVol = Math.max(0, maxVolumeM3 - (currentVolumeM3 + simulatedAdditionVolume));

  const isOverweight = (currentWeightTons + simulatedAdditionWeight) > maxWeightTons;
  const isOvervolume = (currentVolumeM3 + simulatedAdditionVolume) > maxVolumeM3;
  const isCompatible = !isOverweight && !isOvervolume;

  return (
    <div className="cr-card rounded-lg p-5">
      <div className="flex items-center justify-between border-b border-cr-border pb-3 mb-4">
        <div>
          <h4 className="font-bold text-cr-text text-sm tracking-tight">{title}</h4>
          <p className="text-xs text-cr-muted font-mono">Dual-Constraint Weight & Volume Engine</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isCompatible ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Compatible Load
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Overload Constraint
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-cr-text">
              <Weight className="w-4 h-4 text-cr-red" /> Gross Weight
            </span>
            <span className="font-mono text-cr-muted">
              {formatWeight(currentWeightTons + simulatedAdditionWeight)} / {formatWeight(maxWeightTons)}
            </span>
          </div>

          <div className="relative h-4 w-full bg-cr-gray rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentWeightPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${currentWeightPct > 90 ? 'bg-rose-600' : currentWeightPct > 75 ? 'bg-cr-red' : 'bg-slate-800'}`}
            />
            {simulatedAdditionWeight > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${simWeightPct - currentWeightPct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ left: `${currentWeightPct}%` }}
                className="absolute top-0.5 bottom-0.5 rounded-r-full bg-cr-yellow"
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-cr-muted pt-1">
            <span>{formatPercentage(simWeightPct)} Utilized</span>
            <span className="font-semibold text-cr-text">{formatWeight(remainingWeight)} Available</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-cr-text">
              <Box className="w-4 h-4 text-amber-600" /> Cubicle Volume
            </span>
            <span className="font-mono text-cr-muted">
              {formatVolume(currentVolumeM3 + simulatedAdditionVolume)} / {formatVolume(maxVolumeM3)}
            </span>
          </div>

          <div className="relative h-4 w-full bg-cr-gray rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentVolPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-amber-500"
            />
            {simulatedAdditionVolume > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${simVolPct - currentVolPct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ left: `${currentVolPct}%` }}
                className="absolute top-0.5 bottom-0.5 rounded-r-full bg-amber-300"
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-cr-muted pt-1">
            <span>{formatPercentage(simVolPct)} Utilized</span>
            <span className="font-semibold text-cr-text">{formatVolume(remainingVol)} Available</span>
          </div>
        </div>
      </div>

      {show3DBox && (
        <div className="mt-5 pt-4 border-t border-cr-border bg-[#F8F8F6] rounded-lg p-3">
          <div className="flex items-center justify-between text-xs font-mono text-cr-muted mb-2">
            <span>32FT TRUCK CONTAINER SIMULATED FILL</span>
            <span className="text-cr-text font-bold">Space Status: {100 - Math.round(Math.max(simWeightPct, simVolPct))}% Free</span>
          </div>
          <div className="grid grid-cols-12 gap-1 h-8">
            {Array.from({ length: 12 }).map((_, idx) => {
              const boxPct = (idx + 1) * (100 / 12);
              const isOccupied = boxPct <= currentWeightPct;
              const isSimulated = boxPct > currentWeightPct && boxPct <= simWeightPct;
              return (
                <div
                  key={idx}
                  className={`rounded-sm transition-all duration-300 ${
                    isOccupied
                      ? 'bg-slate-700'
                      : isSimulated
                      ? 'bg-cr-yellow border border-amber-500'
                      : 'bg-cr-gray/70 border border-cr-border'
                  }`}
                  title={isOccupied ? 'Base Cargo' : isSimulated ? 'Intermediate Load Cargo' : 'Empty Headroom'}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
