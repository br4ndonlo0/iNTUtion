'use client';

import { useStyle } from '@/context/StyleContext';

interface AdaptiveCardProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdaptiveCard({ id, children, className = '' }: AdaptiveCardProps) {
  const { styleSettings } = useStyle();
  const { layout_adjustments } = styleSettings;
  
  const isHighlighted = id && layout_adjustments.highlighted_action_ids.includes(id);

  return (
    <div
      id={id}
      className={`adaptive-card ${isHighlighted ? 'highlighted-action' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
