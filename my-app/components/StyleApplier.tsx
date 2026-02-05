'use client';

import { useStyle } from '@/context/StyleContext';
import { ReactNode } from 'react';

export function StyleApplier({ children }: { children: ReactNode }) {
  const { styleSettings } = useStyle();
  const { ux_mode, theme, typography, layout_adjustments } = styleSettings;

  // Convert settings to CSS variables
  const cssVariables = {
    '--bg': theme.background_color,
    '--text': theme.text_color,
    '--primary': theme.primary_color,
    '--secondary': theme.secondary_color,
    '--border': theme.border_color,
    '--base-font-size': `${typography.base_font_size_px}px`,
    '--heading-scale': typography.heading_scale.toString(),
    '--line-height': typography.line_height.toString(),
    '--letter-spacing': `${typography.letter_spacing_em}em`,
    '--font-family': typography.font_family,
    '--button-padding': `${layout_adjustments.button_padding_px}px`,
    '--button-min-height': `${layout_adjustments.button_min_height_px}px`,
    '--spacing-scale': layout_adjustments.spacing_scale.toString(),
  } as React.CSSProperties;

  return (
    <div className={`accessibility-wrapper ${ux_mode}`} style={cssVariables}>
      {children}
    </div>
  );
}
