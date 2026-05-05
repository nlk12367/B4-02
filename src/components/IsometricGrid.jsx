import React from 'react';
import PixelEgg from './PixelEgg';

/**
 * IsometricGrid - 無上限島嶼養成視覺元件
 * 
 * 接收 islands 陣列，每座島嶼有自己的圖塊、蛋/吉祥物狀態。
 * 位置由 getPosition(index) 動態生成，無島嶼數量上限。
 */

// 預定義前10座島嶼的視覺位置（x/y 為相對容器中心的百分比，scale 控制遠近感）
const ISLAND_POSITIONS = [
  { x: 0,   y: 0,   scale: 1.00, z: 5 }, // 0: 主島（前景中央）
  { x: -44, y: -28, scale: 0.72, z: 3 }, // 1: 後左
  { x: 44,  y: -28, scale: 0.72, z: 3 }, // 2: 後右
  { x: 36,  y: 24,  scale: 0.62, z: 4 }, // 3: 前右
  { x: -36, y: 24,  scale: 0.62, z: 4 }, // 4: 前左
  { x: 0,   y: -52, scale: 0.60, z: 1 }, // 5: 正後遠景
  { x: -65, y: -12, scale: 0.54, z: 2 }, // 6: 遠左
  { x: 65,  y: -12, scale: 0.54, z: 2 }, // 7: 遠右
  { x: -22, y: 44,  scale: 0.50, z: 4 }, // 8: 近前左
  { x: 22,  y: 44,  scale: 0.50, z: 4 }, // 9: 近前右
];

// 第10座之後：黃金角螺旋排列，確保不重疊
const getPosition = (index) => {
  if (index < ISLAND_POSITIONS.length) return ISLAND_POSITIONS[index];
  const extra = index - ISLAND_POSITIONS.length;
  const angle = extra * 137.508 * (Math.PI / 180); // 黃金角
  const radius = 55 + extra * 9;
  const scale = Math.max(0.36, 0.48 - extra * 0.018);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.4 - 18,
    scale,
    z: 1,
  };
};

// 每座吉祥物依 island.id 取得不同的色調（CSS hue-rotate）
const getMascotFilter = (islandId, emotion) => {
  // 主島（id=0）跟隨情緒
  if (islandId === 0) {
    switch (emotion) {
      case 'Sad':     return 'hue-rotate(180deg) saturate(0.5) brightness(0.9)';
      case 'Anxious': return 'hue-rotate(90deg) saturate(1.5)';
      case 'Joyful':  return 'saturate(2) brightness(1.1) drop-shadow(0 0 15px rgba(255,200,0,0.8))';
      default:        return 'none';
    }
  }
  // 次要吉祥物：依 id 旋轉色調，產生不同顏色的角色
  const hues = [0, 45, 90, 140, 200, 260, 310, 30, 170, 220];
  const hue = hues[islandId % hues.length];
  return `hue-rotate(${hue}deg) saturate(1.3)`;
};

export default function IsometricGrid({ islands = [], emotion }) {
  const BASE_SIZE = 220;

  const eggClipHeight = BASE_SIZE * 0.72; // 裁掉底部粉紫陰影

  // 雙層 AO 暈影（可依尺寸縮放）
  const AOShadow = ({ size }) => (
    <div style={{ position: 'relative', height: 0, width: `${size}px` }}>
      <div style={{
        position: 'absolute', left: '50%', top: 0,
        transform: 'translate(-50%, -50%)',
        width: `${size * 0.92}px`, height: `${size * 0.10}px`,
        background: 'radial-gradient(ellipse, rgba(30,70,15,0.28) 0%, transparent 72%)',
        borderRadius: '50%', filter: 'blur(6px)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: 0,
        transform: 'translate(-50%, -50%)',
        width: `${size * 0.58}px`, height: `${size * 0.055}px`,
        background: 'radial-gradient(ellipse, rgba(15,50,8,0.55) 0%, transparent 68%)',
        borderRadius: '50%', filter: 'blur(3px)',
      }} />
    </div>
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
      <div
        className="relative"
        style={{ width: `${BASE_SIZE * 2.0}px`, height: `${BASE_SIZE * 2.0}px` }}
      >
        {islands.map((island) => {
          const pos = getPosition(island.id);
          const tileSize = BASE_SIZE * pos.scale;
          const eggSize = tileSize * 0.45;
          const mascotSize = tileSize * 0.55;

          return (
            <div
              key={`island-${island.id}`}
              className="absolute transition-all duration-700 ease-out"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                left: `calc(50% + ${pos.x}%)`,
                top: `calc(50% + ${pos.y}%)`,
                transform: 'translate(-50%, -50%)',
                zIndex: pos.z,
              }}
            >
              {/* 島嶼圖塊 */}
              <img
                src={`/isometric/${island.tileImg}?v=5`}
                alt={island.tileImg}
                className="w-full h-full pointer-events-auto drop-shadow-lg hover:brightness-110 transition-all duration-300"
                style={{ objectFit: 'contain' }}
              />

              {/* 蛋 或 吉祥物（坐在島嶼草地表面）*/}
              <div
                className="absolute pointer-events-auto"
                style={{
                  left: '50%',
                  top: '47%',
                  transform: 'translate(-50%, -100%)',
                  zIndex: 10,
                }}
              >
                {island.petState === 'egg' ? (
                  <div className="relative flex flex-col items-center">
                    {/* 裁掉 egg.png 自帶底部粉紫陰影 */}
                    <div style={{
                      width: `${eggSize}px`,
                      height: `${eggSize * 0.72}px`,
                      overflow: 'hidden',
                    }}>
                      <PixelEgg className="w-full" />
                    </div>
                    <AOShadow size={eggSize} />
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center">
                    <img
                      src="/isometric/mascot_flag.png?v=5"
                      alt="Mascot"
                      style={{
                        width: `${mascotSize}px`,
                        height: 'auto',
                        filter: getMascotFilter(island.id, emotion),
                      }}
                      className="drop-shadow-2xl transition-all duration-1000"
                    />
                    {/* 孵化發光暈 */}
                    <div style={{
                      width: `${mascotSize * 0.6}px`,
                      height: `${mascotSize * 0.12}px`,
                      background: 'radial-gradient(ellipse, rgba(255,255,255,0.45), transparent)',
                      filter: 'blur(8px)',
                      marginTop: `-${mascotSize * 0.08}px`,
                    }} className="animate-pulse rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
