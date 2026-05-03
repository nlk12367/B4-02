import React from 'react';

export default function PixelTuft({ className = "", style = {}, type = "short" }) {
  const pixelsShort = [
    "..g...",
    ".gg.g.",
    "gggggg"
  ];
  const pixelsTall = [
    "g.....",
    "g..g..",
    "gg.gg.",
    "gggggg",
    "gggggg"
  ];
  
  const pixels = type === 'tall' ? pixelsTall : pixelsShort;
  const cols = 6;
  const rows = pixels.length;

  return (
    <div 
      className={`pixel-tuft ${className}`} 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        aspectRatio: `${cols}/${rows}`,
        ...style
      }}
    >
      {pixels.join('').split('').map((char, index) => (
        <div key={index} style={{ backgroundColor: char === 'g' ? '#5c9e31' : 'transparent' }}></div>
      ))}
    </div>
  );
}
