import React from 'react';

export default function PixelEgg({ className = "" }) {
  const EGG_PIXELS = [
    ".....BBBBBB.....",
    "...BBWWWWWWBB...",
    "..BWWWWWWWWWWB..",
    ".BWWWWGWWWWWWWB.",
    ".BWWWGGGWWWWWWB.",
    "BWWWWGGGWWWWWWWB",
    "BWWWWWWWWWWWWGGB",
    "BGGWWWWWWWWWGGGB",
    "BGGWWWWWWWWWGGGB",
    "BWWWWWWWWWWWWGGB",
    "BWWWWGGWWWWWWWWB",
    "BWWWGGGGWWWWWbbB",
    ".BWWGGGGWWWWbbB.",
    ".BWWWGGWWWWbbB..",
    "..BBWWWWWWbbBB..",
    "....BBBBBBBB...."
  ];

  const colorMap = {
    'B': '#1f2937', // outline (Gray-800)
    'W': '#ffffff', // body (White)
    'G': '#14b8a6', // spots (Teal-500)
    'b': '#e5e7eb', // shadow (Gray-200)
    '.': 'transparent'
  };

  return (
    <div 
      className={`pixel-egg ${className}`} 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(16, 1fr)',
        aspectRatio: '1/1'
      }}
    >
      {EGG_PIXELS.join('').split('').map((char, index) => (
        <div key={index} style={{ backgroundColor: colorMap[char] }}></div>
      ))}
    </div>
  );
}
