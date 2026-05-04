import React from 'react';
import PixelEgg from './PixelEgg';

export default function IsometricGrid({ level, petState }) {
  // 定義不同等級的島嶼網格配置
  const grids = {
    1: [
      ['tile_grass.png']
    ],
    2: [
      ['tile_grass.png', 'tile_center.png'],
      ['tile_center.png', 'tile_rock.png']
    ],
    3: [
      ['corner_outer.png', 'edge_straight.png', 'edge_straight.png'],
      ['edge_straight.png', 'tile_center.png', 'tile_center.png'],
      ['edge_straight.png', 'tile_center.png', 'corner_inner_right.png']
    ]
  };

  const grid = grids[level] || grids[1];
  
  // 圖塊基礎寬高 (已放大一倍)
  const tileWidth = 280; 
  const tileHeight = 140; 

  return (
    <div className="relative w-full h-[400px] pointer-events-none mt-16 z-10">
      <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
        {grid.map((row, y) => 
          row.map((tileImage, x) => {
            if (!tileImage) return null;
            
            // 2.5D Isometric 座標轉換計算
            const px = (x - y) * (tileWidth / 2);
            const py = (x + y) * (tileHeight / 2);
            const zIndex = x + y; // 確保前面的圖塊會蓋住後面的圖塊

            return (
              <div 
                key={`${x}-${y}`} 
                className="absolute transition-all duration-1000 ease-in-out"
                style={{
                  left: `${px}px`,
                  top: `${py}px`,
                  zIndex: zIndex,
                  transform: 'translate(-50%, -50%)' // 將繪圖中心對齊座標點
                }}
              >
                {/* 島嶼圖塊 */}
                <img 
                  src={`/isometric/${tileImage}`} 
                  alt="tile" 
                  className="drop-shadow-xl pointer-events-auto hover:-translate-y-2 transition-transform duration-300" 
                  style={{ width: '280px', height: 'auto' }}
                />
                
                {/* 將蛋或吉祥物放在核心原點圖塊 (0,0) 的上方 */}
                {x === 0 && y === 0 && (
                  <div className="absolute z-20 pointer-events-auto" style={{ top: '-15%', left: '50%', transform: 'translateX(-50%)' }}>
                    {petState === 'egg' ? (
                      <div style={{ width: '160px' }}>
                        <PixelEgg className="w-full drop-shadow-xl" />
                      </div>
                    ) : (
                      <div className="relative flex justify-center">
                        <img src="/isometric/mascot_flag.png" className="drop-shadow-2xl animate-bounce" style={{ width: '200px' }} alt="Mascot" />
                        {/* 孵化時可以加個特效 */}
                        <div className="absolute inset-0 bg-white/50 rounded-full blur-xl animate-ping -z-10"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
