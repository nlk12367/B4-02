import React from 'react';
import PixelEgg from './PixelEgg';

/**
 * IsometricGrid - 島嶼養成視覺元件
 * 
 * 設計策略：放棄數學座標拼接（因為素材不是標準等距菱形），
 * 改用「視覺堆疊法」— 每個等級對應一組手動配置的圖層。
 * 蛋/吉祥物永遠置中在島嶼的草地表面上。
 */
export default function IsometricGrid({ level, petState, emotion }) {

  // 依據情緒改變吉祥物的 CSS 濾鏡
  const getMascotFilter = (emotion) => {
    switch (emotion) {
      case 'Sad': return 'hue-rotate(180deg) saturate(0.5) brightness(0.9)';
      case 'Anxious': return 'hue-rotate(90deg) saturate(1.5)';
      case 'Joyful': return 'saturate(2) brightness(1.1) drop-shadow(0 0 15px rgba(255,200,0,0.8))';
      default: return 'none';
    }
  };

  // 每個等級的島嶼圖層配置
  // x, y = 相對於容器中心的百分比偏移
  // scale = 縮放比例 (越小越遠)
  // z = 疊放順序 (前方島嶼 z 越大)
  const levelConfigs = {
    1: {
      tiles: [
        // 主島 — 居中
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1.0, z: 3 }
      ],
      entityX: 0,
      entityY: -13,
    },
    2: {
      tiles: [
        // 後左島 — 往左上退後，縮小模擬景深
        { img: 'tile_center.png', x: -40, y: -25, scale: 0.72, z: 1 },
        // 主島 — 前景居中
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1.0, z: 3 },
      ],
      entityX: 0,
      entityY: -13,
    },
    3: {
      tiles: [
        // 後右島 — 往右上退後
        { img: 'corner_outer.png', x: 42, y: -26, scale: 0.68, z: 1 },
        // 後左島 — 往左上退後
        { img: 'tile_center.png', x: -42, y: -26, scale: 0.68, z: 1 },
        // 前右小島 — 右前方，略小
        { img: 'tile_rock.png', x: 32, y: 20, scale: 0.58, z: 2 },
        // 主島 — 最前景居中，z最高
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1.0, z: 3 },
      ],
      entityX: 0,
      entityY: -13,
    }
  };

  const config = levelConfigs[level] || levelConfigs[1];
  
  // 島嶼圖塊基礎尺寸 (在手機上的渲染大小)
  const BASE_SIZE = 220;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
      {/* 島嶼容器 - 固定大小，所有內容相對於此定位 */}
      <div 
        className="relative"
        style={{ width: `${BASE_SIZE * 1.8}px`, height: `${BASE_SIZE * 1.8}px` }}
      >
        {/* 渲染島嶼圖塊 */}
        {config.tiles.map((tile, i) => (
          <img
            key={`${level}-${i}`}
            src={`/isometric/${tile.img}?v=5`}
            alt={tile.img}
            className="absolute pointer-events-auto transition-all duration-700 ease-out drop-shadow-lg hover:brightness-110"
            style={{
              width: `${BASE_SIZE * tile.scale}px`,
              height: `${BASE_SIZE * tile.scale}px`,
              objectFit: 'contain',
              left: `calc(50% + ${tile.x}%)`,
              top: `calc(50% + ${tile.y}%)`,
              transform: 'translate(-50%, -50%)',
              zIndex: tile.z,
            }}
          />
        ))}

        {/* 蛋 或 吉祥物 — 永遠在島嶼草地表面的中央 */}
        <div
          className="absolute z-50 pointer-events-auto"
          style={{
            left: `calc(50% + ${config.entityX}%)`,
            top: `calc(50% + ${config.entityY}%)`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {petState === 'egg' ? (
            <div className="relative flex flex-col items-center">
              {/* 蛋本體 */}
              <div style={{ width: `${BASE_SIZE * 0.45}px` }}>
                <PixelEgg className="w-full drop-shadow-xl" />
              </div>
              {/* 接觸陰影 (Contact Shadow) — 讓蛋自然融入草地 */}
              <div
                style={{
                  width: `${BASE_SIZE * 0.32}px`,
                  height: `${BASE_SIZE * 0.07}px`,
                  background: 'radial-gradient(ellipse, rgba(60,80,40,0.35), transparent 70%)',
                  borderRadius: '50%',
                  marginTop: `-${BASE_SIZE * 0.06}px`,
                  filter: 'blur(4px)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ) : (
            <div className="relative flex justify-center items-center">
              <img
                src="/isometric/mascot_flag.png?v=5"
                alt="Mascot"
                style={{
                  width: `${BASE_SIZE * 0.55}px`,
                  height: 'auto',
                  filter: getMascotFilter(emotion),
                }}
                className="drop-shadow-2xl transition-all duration-1000"
              />
              {/* 孵化後的柔和發光特效 */}
              <div 
                className="absolute rounded-full -z-10 animate-pulse"
                style={{
                  width: `${BASE_SIZE * 0.4}px`,
                  height: `${BASE_SIZE * 0.2}px`,
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)',
                  filter: 'blur(12px)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
