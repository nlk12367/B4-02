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
  
  // 圖塊基礎寬高 (需配合您切圖的比例微調)
  const tileWidth = 140; 
  const tileHeight = 70; 

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center pointer-events-none mt-16 z-10">
      <div className="relative">
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
                  className="w-[140px] sm:w-[160px] drop-shadow-xl pointer-events-auto hover:-translate-y-2 transition-transform duration-300" 
                />
                
                {/* 將蛋或吉祥物放在核心原點圖塊 (0,0) 的上方 */}
                {x === 0 && y === 0 && (
                  <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                    {petState === 'egg' ? (
                      <PixelEgg className="w-[80px] drop-shadow-xl" />
                    ) : (
                      <div className="relative">
                        <img src="/isometric/mascot_flag.png" className="w-[100px] drop-shadow-2xl animate-bounce" alt="Mascot" />
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
