import React from 'react';
import PixelEgg from './PixelEgg';

export default function IsometricGrid({ level, petState, emotion }) {
  // 依據情緒改變吉祥物的顏色 (因為目前只有一張圖，我們用 CSS 濾鏡來產生不同角色)
  const getMascotStyle = (emotion) => {
    switch(emotion) {
      case 'Sad': return 'hue-rotate-180 saturate-50 brightness-90'; // 憂鬱色調
      case 'Anxious': return 'hue-rotate-90 saturate-150'; // 焦慮色調
      case 'Joyful': return 'saturate-200 brightness-110 drop-shadow-[0_0_15px_rgba(255,200,0,0.8)]'; // 喜悅發光
      default: return '';
    }
  };
  // 定義不同等級的島嶼網格配置
  const grids = {
    1: [
      ['tile_center.png'] // 使用 tile_center 確保載入
    ],
    2: [
      ['tile_center.png', 'edge_straight.png'],
      ['edge_straight.png', 'tile_rock.png']
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
                  // 改變對齊點：對齊圖片的「頂部中心」，這樣不管底座岩石有多深，頂部的等距網格都能完美接合！
                  transform: 'translate(-50%, 0%)' 
                }}
              >
                {/* 島嶼圖塊 (加入 ?v=3 強制清除瀏覽器快取) */}
                <img 
                  src={`/isometric/${tileImage}?v=3`} 
                  alt="tile" 
                  className="drop-shadow-xl pointer-events-auto hover:-translate-y-2 transition-transform duration-300" 
                  style={{ width: '280px', height: 'auto' }}
                  onError={(e) => { e.target.style.border = '5px solid red'; console.error('Image load failed:', tileImage); }}
                />
                
                {/* 將蛋或吉祥物精準放在核心圖塊 (0,0) 的菱形表面正中心 */}
                {/* 280寬的菱形高度為140，中心點位於 top: 70px。因此將蛋的底部對齊 70px。 */}
                {x === 0 && y === 0 && (
                  <div className="absolute z-20 pointer-events-auto" style={{ top: '70px', left: '50%', transform: 'translate(-50%, -100%)' }}>
                    {petState === 'egg' ? (
                      <div style={{ width: '160px' }}>
                        <PixelEgg className="w-full drop-shadow-xl" />
                      </div>
                    ) : (
                      <div className="relative flex justify-center items-center">
                        <img 
                          src={`/isometric/mascot_flag.png?v=2`} 
                          className={`drop-shadow-2xl animate-bounce transition-all duration-1000 ${getMascotStyle(emotion)}`} 
                          style={{ width: '200px' }} 
                          alt="Mascot" 
                          onError={(e) => { e.target.style.border = '5px solid red'; }}
                        />
                        {/* 孵化時的發光特效 */}
                        <div className="absolute inset-0 bg-white/50 rounded-full blur-2xl animate-pulse -z-10"></div>
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
