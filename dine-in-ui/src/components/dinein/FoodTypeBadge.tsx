import React from 'react';

interface FoodTypeBadgeProps {
  type: 'VEG' | 'NON_VEG' | 'VEGAN';
}

const FoodTypeBadge: React.FC<FoodTypeBadgeProps> = ({ type }) => {
  if (type === 'VEGAN') {
    return <span className="text-[10px]" title="Vegan">🌿</span>;
  }

  const isVeg = type === 'VEG';
  
  return (
    <div 
      className={`w-3 h-3 flex items-center justify-center border-2 rounded-sm ${
        isVeg ? 'border-emerald-600' : 'border-rose-600'
      }`}
      title={type}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
    </div>
  );
};

export default FoodTypeBadge;
