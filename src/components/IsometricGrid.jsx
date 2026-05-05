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
  // x, y 是相對於容器中心的百分比偏移 (0,0 = 中心)
  // scale 控制大小, z 控制疊放順序
  const levelConfigs = {
    1: {
      tiles: [
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1, z: 1 }
      ],
      // 蛋/吉祥物相對於容器中心的位置 (百分比)
      entityX: 0,
      entityY: -12,  // 往上偏移，讓它坐在草地表面
    },
    2: {
      tiles: [
        { img: 'tile_center.png', x: -22, y: 12, scale: 0.85, z: 1 },
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1, z: 2 },
        { img: 'tile_rock.png', x: 18, y: 10, scale: 0.7, z: 0 },
      ],
      entityX: 0,
      entityY: -12,
    },
    3: {
      tiles: [
        { img: 'corner_outer.png', x: -28, y: -5, scale: 0.75, z: 1 },
        { img: 'edge_straight.png', x: 22, y: -5, scale: 0.75, z: 1 },
        { img: 'tile_center.png', x: -22, y: 18, scale: 0.8, z: 2 },
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1, z: 3 },
        { img: 'tile_rock.png', x: 24, y: 16, scale: 0.65, z: 2 },
      ],
      entityX: 0,
      entityY: -12,
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
            <div style={{ width: `${BASE_SIZE * 0.45}px` }}>
              <PixelEgg className="w-full drop-shadow-xl" />
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
