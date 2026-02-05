'use client';

import { useStyle } from '@/context/StyleContext';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AdaptiveImage({ src, alt, className = '' }: AdaptiveImageProps) {
  const { styleSettings } = useStyle();
  const { layout_adjustments } = styleSettings;

  if (layout_adjustments.hide_images) {
    return <span className="text-sm italic">[Image: {alt}]</span>;
  }

  return <img src={src} alt={alt} className={className} />;
}
