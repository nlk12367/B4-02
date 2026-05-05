import React, { useMemo } from 'react';
import PixelEgg from './PixelEgg';

/**
 * IsometricGrid - 島嶼養成視覺元件
 * 
 * 設計策略：視覺堆疊法，每個等級對應手動配置的圖層。
 * 主蛋永遠在主島 (index 0) 上；孵化後，其餘島嶼有機率出現新蛋。
 */
export default function IsometricGrid({ level, petState, emotion }) {

  const getMascotFilter = (emotion) => {
    switch (emotion) {
      case 'Sad':     return 'hue-rotate(180deg) saturate(0.5) brightness(0.9)';
      case 'Anxious': return 'hue-rotate(90deg) saturate(1.5)';
      case 'Joyful':  return 'saturate(2) brightness(1.1) drop-shadow(0 0 15px rgba(255,200,0,0.8))';
      default:        return 'none';
    }
  };

  // 每個等級的島嶼圖層配置
  // mainTileIndex: 主蛋/吉祥物所在的圖塊 index（依照 tiles 陣列順序）
  const levelConfigs = {
    1: {
      tiles: [
        { img: 'tile_grass.png', x: 0, y: 0, scale: 1.0, z: 3 },
      ],
      mainTileIndex: 0,
    },
    2: {
      tiles: [
        { img: 'tile_grass.png', x: 0,   y: 0,   scale: 1.0, z: 3 },   // 主島（index 0）
        { img: 'tile_center.png', x: -40, y: -25, scale: 0.72, z: 1 }, // 後左島（index 1）
      ],
      mainTileIndex: 0,
    },
    3: {
      tiles: [
        { img: 'tile_grass.png',  x: 0,   y: 0,   scale: 1.0,  z: 3 },  // 主島（index 0）
        { img: 'tile_center.png', x: -42, y: -26,  scale: 0.68, z: 1 }, // 後左（index 1）
        { img: 'corner_outer.png', x: 42, y: -26,  scale: 0.68, z: 1 }, // 後右（index 2）
        { img: 'tile_rock.png',   x: 32,  y: 20,   scale: 0.58, z: 2 }, // 前右（index 3）
      ],
      mainTileIndex: 0,
    }
  };

  const config = levelConfigs[level] || levelConfigs[1];
  const BASE_SIZE = 220;

  // 決定次要島嶼上哪些有蛋（孵化後才有機率出現）
  // 用 level 作為 seed 確保穩定，不會每次重渲染都改變
  const secondaryEggSet = useMemo(() => {
    if (petState !== 'mascot') return new Set();
    const eggSet = new Set();
    config.tiles.forEach((_, i) => {
      if (i === config.mainTileIndex) return; // 主島跳過
      // 用 tile index 作為固定 seed，30% 機率出現蛋
      if ((i * 7 + level * 3) % 10 < 3) {
        eggSet.add(i);
      }
    });
    return eggSet;
  }, [petState, level]);

  // 次要蛋的尺寸比主蛋更小
  const secondaryEggSize = (tileScale) => BASE_SIZE * tileScale * 0.38;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
      <div
        className="relative"
        style={{ width: `${BASE_SIZE * 1.8}px`, height: `${BASE_SIZE * 1.8}px` }}
      >
        {/* 渲染所有島嶼圖塊 */}
        {config.tiles.map((tile, i) => (
          <div
            key={`tile-${level}-${i}`}
            className="absolute"
            style={{
              width: `${BASE_SIZE * tile.scale}px`,
              height: `${BASE_SIZE * tile.scale}px`,
              left: `calc(50% + ${tile.x}%)`,
              top: `calc(50% + ${tile.y}%)`,
              transform: 'translate(-50%, -50%)',
              zIndex: tile.z,
            }}
          >
            {/* 島嶼圖片 */}
            <img
              src={`/isometric/${tile.img}?v=5`}
              alt={tile.img}
              className="w-full h-full pointer-events-auto transition-all duration-700 ease-out drop-shadow-lg hover:brightness-110"
              style={{ objectFit: 'contain' }}
            />

            {/* 主島：蛋 或 吉祥物 */}
            {i === config.mainTileIndex && (
              <div
                className="absolute pointer-events-auto"
                style={{
                  left: '50%',
                  top: '47%',
                  transform: 'translate(-50%, -100%)',
                  zIndex: 20,
                }}
              >
                {petState === 'egg' ? (
                  <div className="relative flex flex-col items-center">
                    {/* 用 overflow:hidden 裁掉 egg.png 底部自帶的粉紫色陰影 (約佔圖高下方 28%) */}
                    <div style={{
                      width: `${BASE_SIZE * 0.45}px`,
                      height: `${BASE_SIZE * 0.45 * 0.72}px`,
                      overflow: 'hidden',
                    }}>
                      <PixelEgg className="w-full" />
                    </div>
                    {/* 
                      雙層環境光遮蔽 (AO) 暈影：
                      1. 內層 (核心)：深綠色、不透明度高 → 模擬物件緊貼地面的接觸區
                      2. 外層 (擴散)：更大、更淡 → 模擬光線散射到周圍草地的自然漸層
                    */}
                    <div style={{ position: 'relative', height: 0, width: `${BASE_SIZE * 0.45}px` }}>
                      {/* 外層擴散暈 */}
                      <div style={{
                        position: 'absolute',
                        left: '50%', top: 0,
                        transform: 'translate(-50%, -50%)',
                        width: `${BASE_SIZE * 0.42}px`,
                        height: `${BASE_SIZE * 0.10}px`,
                        background: 'radial-gradient(ellipse, rgba(30,70,15,0.28) 0%, transparent 72%)',
                        borderRadius: '50%',
                        filter: 'blur(6px)',
                      }} />
                      {/* 內層核心暗區 */}
                      <div style={{
                        position: 'absolute',
                        left: '50%', top: 0,
                        transform: 'translate(-50%, -50%)',
                        width: `${BASE_SIZE * 0.26}px`,
                        height: `${BASE_SIZE * 0.055}px`,
                        background: 'radial-gradient(ellipse, rgba(15,50,8,0.55) 0%, transparent 68%)',
                        borderRadius: '50%',
                        filter: 'blur(3px)',
                      }} />
                    </div>
                  </div>
                ) : (
                  <div className="relative flex justify-center items-end">
                    <img
                      src="/isometric/mascot_flag.png?v=5"
                      alt="Mascot"
                      style={{ width: `${BASE_SIZE * 0.55}px`, height: 'auto', filter: getMascotFilter(emotion) }}
                      className="drop-shadow-2xl transition-all duration-1000"
                    />
                    <div className="absolute rounded-full -z-10 animate-pulse" style={{
                      width: `${BASE_SIZE * 0.4}px`,
                      height: `${BASE_SIZE * 0.15}px`,
                      bottom: 0,
                      background: 'radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)',
                      filter: 'blur(10px)',
                    }} />
                  </div>
                )}
              </div>
            )}

            {/* 次要蛋：孵化後有機率出現在其他島嶼 */}
            {secondaryEggSet.has(i) && (
              <div
                className="absolute pointer-events-auto"
                style={{
                  left: '50%',
                  top: '47%',
                  transform: 'translate(-50%, -100%)',
                  zIndex: 10,
                }}
              >
                {/* 次要蛋：孵化後有機率出現，跟著島嶼一起浮動，套用和主蛋相同的隨機擺動 */}
                <div className="relative flex flex-col items-center">
                  {/* 裁掉 egg.png 自帶的粉紫色底部陰影 */}
                  <div style={{
                    width: `${secondaryEggSize(tile.scale)}px`,
                    height: `${secondaryEggSize(tile.scale) * 0.72}px`,
                    overflow: 'hidden',
                  }}>
                    <PixelEgg className="w-full" />
                  </div>
                  {/* 雙層 AO 暈影（縮放版） */}
                  <div style={{ position: 'relative', height: 0, width: `${secondaryEggSize(tile.scale)}px` }}>
                    <div style={{
                      position: 'absolute', left: '50%', top: 0,
                      transform: 'translate(-50%, -50%)',
                      width: `${secondaryEggSize(tile.scale) * 0.92}px`,
                      height: `${secondaryEggSize(tile.scale) * 0.10}px`,
                      background: 'radial-gradient(ellipse, rgba(30,70,15,0.28) 0%, transparent 72%)',
                      borderRadius: '50%', filter: 'blur(5px)',
                    }} />
                    <div style={{
                      position: 'absolute', left: '50%', top: 0,
                      transform: 'translate(-50%, -50%)',
                      width: `${secondaryEggSize(tile.scale) * 0.58}px`,
                      height: `${secondaryEggSize(tile.scale) * 0.055}px`,
                      background: 'radial-gradient(ellipse, rgba(15,50,8,0.55) 0%, transparent 68%)',
                      borderRadius: '50%', filter: 'blur(2.5px)',
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
