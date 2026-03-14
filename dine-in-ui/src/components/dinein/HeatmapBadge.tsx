import React from 'react';

interface HeatmapBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  rate: number;
}

const HeatmapBadge: React.FC<HeatmapBadgeProps> = ({ level, rate }) => {
  const config = {
    LOW: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Quiet', dot: 'bg-emerald-500' },
    MEDIUM: { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Busy', dot: 'bg-amber-500' },
    HIGH: { color: 'text-rose-600 bg-rose-50 border-rose-100', label: 'Very Busy', dot: 'bg-rose-500' },
  };

  const { color, label, dot } = config[level];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${color}`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${dot}`} />
      {label}
    </div>
  );
};

export default HeatmapBadge;
