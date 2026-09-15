import React from 'react';

export const RoyalBikesMark = ({ width = 36, height = 'auto', color = '#ffffff', className = '' }) => {
  return (
    <svg 
      viewBox="25 45 250 100" 
      width={width} 
      height={height}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={color} stroke={color}>
        {/* Top Aerodynamic Bike Fairing & Handlebar Windshield */}
        <path 
          d="M210 52 C215 48, 235 56, 255 75 C242 78, 230 76, 218 70 C210 65, 206 58, 210 52 Z" 
          fill={color}
        />
        <path 
          d="M250 82 C262 90, 268 98, 258 102 C242 106, 222 98, 208 90 C222 84, 238 82, 250 82 Z" 
          fill={color}
        />
        
        {/* Tail Cowl & Rider Seat Swoop */}
        <path 
          d="M38 56 C70 56, 95 72, 102 96 C86 94, 60 84, 42 70 C36 65, 34 60, 38 56 Z" 
          fill={color}
        />

        {/* Main Top Body Curve Arch */}
        <path 
          d="M100 94 C130 68, 178 64, 215 88 C175 78, 140 86, 116 102 C108 100, 104 97, 100 94 Z" 
          fill={color}
        />

        {/* Center Fuel Tank & Chassis Mid Swoop */}
        <path 
          d="M115 106 C145 92, 190 95, 230 114 C205 108, 168 108, 138 120 C125 116, 118 110, 115 106 Z" 
          fill={color}
        />

        {/* Front Wheel / Fork Lower Dynamic Arch */}
        <path 
          d="M200 118 C225 114, 252 125, 266 142 C248 144, 226 138, 206 128 C202 124, 200 120, 200 118 Z" 
          fill={color}
        />

        {/* Rear Wheel Lower Dynamic Arch */}
        <path 
          d="M48 116 C68 98, 98 100, 122 122 C98 118, 74 122, 54 136 C48 132, 46 124, 48 116 Z" 
          fill={color}
        />

        {/* Mid Lower Connection Flow */}
        <path 
          d="M118 124 C140 134, 175 132, 202 122 C178 138, 142 140, 118 124 Z" 
          fill={color}
        />
      </g>
    </svg>
  );
};

export const RoyalBikesLogo = ({ width = 220, height = 'auto', color = '#0f172a', className = '' }) => {
  return (
    <div className={`royal-bikes-logo-wrap ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg 
        viewBox="0 0 320 230" 
        width={width} 
        height={height}
        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={color} stroke={color}>
          {/* Top Aerodynamic Bike Fairing & Handlebar Windshield */}
          <path 
            d="M210 52 C215 48, 235 56, 255 75 C242 78, 230 76, 218 70 C210 65, 206 58, 210 52 Z" 
            fill={color}
          />
          <path 
            d="M250 82 C262 90, 268 98, 258 102 C242 106, 222 98, 208 90 C222 84, 238 82, 250 82 Z" 
            fill={color}
          />
          
          {/* Tail Cowl & Rider Seat Swoop */}
          <path 
            d="M38 56 C70 56, 95 72, 102 96 C86 94, 60 84, 42 70 C36 65, 34 60, 38 56 Z" 
            fill={color}
          />

          {/* Main Top Body Curve Arch */}
          <path 
            d="M100 94 C130 68, 178 64, 215 88 C175 78, 140 86, 116 102 C108 100, 104 97, 100 94 Z" 
            fill={color}
          />

          {/* Center Fuel Tank & Chassis Mid Swoop */}
          <path 
            d="M115 106 C145 92, 190 95, 230 114 C205 108, 168 108, 138 120 C125 116, 118 110, 115 106 Z" 
            fill={color}
          />

          {/* Front Wheel / Fork Lower Dynamic Arch */}
          <path 
            d="M200 118 C225 114, 252 125, 266 142 C248 144, 226 138, 206 128 C202 124, 200 120, 200 118 Z" 
            fill={color}
          />

          {/* Rear Wheel Lower Dynamic Arch */}
          <path 
            d="M48 116 C68 98, 98 100, 122 122 C98 118, 74 122, 54 136 C48 132, 46 124, 48 116 Z" 
            fill={color}
          />

          {/* Mid Lower Connection Flow */}
          <path 
            d="M118 124 C140 134, 175 132, 202 122 C178 138, 142 140, 118 124 Z" 
            fill={color}
          />
        </g>

        {/* 'ROYAL' Main Wordmark */}
        <text 
          x="160" 
          y="182" 
          textAnchor="middle" 
          fontFamily="'Times New Roman', Times, 'Cinzel', 'Playfair Display', serif" 
          fontSize="48" 
          fontWeight="900" 
          letterSpacing="4" 
          fill={color}
        >
          ROYAL
        </text>

        {/* Left Dividing Line */}
        <line 
          x1="18" 
          y1="202" 
          x2="95" 
          y2="202" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="square" 
        />

        {/* 'BIKES' Sub-Wordmark */}
        <text 
          x="160" 
          y="212" 
          textAnchor="middle" 
          fontFamily="'Times New Roman', Times, 'Cinzel', 'Playfair Display', serif" 
          fontSize="24" 
          fontWeight="900" 
          letterSpacing="5" 
          fill={color}
        >
          BIKES
        </text>

        {/* Right Dividing Line */}
        <line 
          x1="225" 
          y1="202" 
          x2="302" 
          y2="202" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="square" 
        />
      </svg>
    </div>
  );
};

export default RoyalBikesLogo;
