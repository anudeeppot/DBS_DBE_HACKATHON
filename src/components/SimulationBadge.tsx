import React from 'react';

export const SimulationBadge: React.FC<{ label?: string }> = ({ label = 'Demo Simulation Mode • Reactive State' }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EFEFEA] border border-cr-border text-[11px] font-mono text-cr-muted select-none">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span className="font-semibold text-cr-text">{label}</span>
    </div>
  );
};
