'use client';

import { useStyle } from '@/context/StyleContext';
import { useEffect } from 'react';

interface AdaptiveButtonProps {
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function AdaptiveButton({ 
  id, 
  children, 
  onClick, 
  variant = 'primary',
  className = '' 
}: AdaptiveButtonProps) {
  const { styleSettings } = useStyle();
  const { layout_adjustments } = styleSettings;
  
  const isHighlighted = id && layout_adjustments.highlighted_action_ids.includes(id);
  
  return (
    <button
      id={id}
      onClick={onClick}
      className={`adaptive-button ${isHighlighted ? 'highlighted-action' : ''} ${className}`}
      style={{
        background: variant === 'primary' ? 'var(--primary)' : 'var(--secondary)',
      }}
    >
      {children}
    </button>
  );
}
