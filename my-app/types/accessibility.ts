export type UxMode =
  | 'default'
  | 'high_contrast'
  | 'text_only'
  | 'dyslexia_friendly'
  | 'motor_impaired';

export interface ThemeSettings {
  background_color: string;
  text_color: string;
  primary_color: string;
  secondary_color: string;
  border_color: string;
}

export interface TypographySettings {
  base_font_size_px: number;
  heading_scale: number;
  line_height: number;
  letter_spacing_em: number;
  font_family: string;
}

export interface LayoutAdjustments {
  hide_images: boolean;
  hide_decorative_elements: boolean;
  button_padding_px: number;
  button_min_height_px: number;
  spacing_scale: number;
  highlighted_action_ids: string[];
}

export interface AccessibilityProfile {
  ux_mode: UxMode;
  theme: ThemeSettings;
  typography: TypographySettings;
  layout_adjustments: LayoutAdjustments;
}

export const DEFAULT_PROFILE: AccessibilityProfile = {
  ux_mode: 'default',
  theme: {
    background_color: '#ffffff',
    text_color: '#000000',
    primary_color: '#3b82f6',
    secondary_color: '#6b7280',
    border_color: '#e5e7eb',
  },
  typography: {
    base_font_size_px: 16,
    heading_scale: 1.5,
    line_height: 1.6,
    letter_spacing_em: 0,
    font_family: 'system-ui, sans-serif',
  },
  layout_adjustments: {
    hide_images: false,
    hide_decorative_elements: false,
    button_padding_px: 14,
    button_min_height_px: 44,
    spacing_scale: 1,
    highlighted_action_ids: [],
  },
};
