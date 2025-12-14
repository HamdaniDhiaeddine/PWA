import React from 'react';
interface BotanicalPatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}
export function BotanicalPattern({
  className = '',
  opacity = 0.05,
  color = 'currentColor'
}: BotanicalPatternProps) {
  return <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{
    opacity
  }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="leaf-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M20,20 Q30,5 40,20 T60,20" fill="none" stroke={color} strokeWidth="1" />
            <path d="M20,20 Q10,35 20,50 T40,50" fill="none" stroke={color} strokeWidth="1" />
            <path d="M60,60 Q70,45 80,60 T100,60" fill="none" stroke={color} strokeWidth="1" />
            <path d="M60,60 Q50,75 60,90 T80,90" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="30" cy="35" r="2" fill={color} />
            <circle cx="70" cy="75" r="2" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      </svg>
    </div>;
}