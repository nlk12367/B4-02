import React from 'react';

export default function PixelGrass({ className = "" }) {
  const GRASS_PIXELS = [
    ".........g..............",
    "....d...dg.......g......",
    "...gd...gg...d..dg..d...",
    "..dgg..dgg..dg..gg..gg..",
    "..ggg..ggg.dgg..gg.dgg..",
    ".gggg.gggg.ggg.ggg.ggg..",
    ".ggggggggggggggggggggg..",
    "ggggggggggggggggggggggg."
  ];

  const colorMap = {
    'g': '#5c9e31', // grass light (matches island)
    'd': '#3f701d', // grass shadow
    '.': 'transparent'
  };

  return (
    <div 
      className={`pixel-grass ${className}`} 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(24, 1fr)',
        aspectRatio: '24/8'
      }}
    >
      {GRASS_PIXELS.join('').split('').map((char, index) => (
        <div key={index} style={{ backgroundColor: colorMap[char] }}></div>
      ))}
    </div>
  );
}
