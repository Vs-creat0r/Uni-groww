import React from 'react';
import { Tier } from '../../types/index.ts';
import { Award, Shield, Trophy, Sparkles } from 'lucide-react';

interface TierBadgeProps {
  tier: Tier;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  score,
  showScore = false,
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (tier) {
      case 'Platinum':
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          dot: 'bg-indigo-600',
          icon: <Sparkles className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 text-indigo-600'} />,
          gradient: 'from-blue-600 to-indigo-600',
          label: 'Platinum',
        };
      case 'Gold':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          icon: <Trophy className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 text-amber-600'} />,
          gradient: 'from-amber-500 to-orange-500',
          label: 'Gold',
        };
      case 'Silver':
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          dot: 'bg-slate-400',
          icon: <Award className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 text-slate-600'} />,
          gradient: 'from-slate-500 to-slate-700',
          label: 'Silver',
        };
      case 'Bronze':
      default:
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-800',
          dot: 'bg-orange-600',
          icon: <Shield className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 text-orange-700'} />,
          gradient: 'from-orange-700 to-amber-800',
          label: 'Bronze',
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium whitespace-nowrap shrink-0 shadow-xs ${style.bg} ${sizeClasses}`}
      title={`${tier} Tier (${tier === 'Platinum' ? '≥ 80%' : tier === 'Gold' ? '60-79%' : tier === 'Silver' ? '40-59%' : '< 40%'})`}
    >
      {style.icon}
      <span>{style.label}</span>
      {showScore && score !== undefined && (
        <span className="font-mono tabular-nums opacity-85">({score}%)</span>
      )}
    </span>
  );
};
