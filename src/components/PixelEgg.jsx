import React, { useState, useEffect } from 'react';

export default function PixelEgg({ className = "" }) {
  const [isWobbling, setIsWobbling] = useState(false);

  useEffect(() => {
    let timeout;
    
    const triggerWobble = () => {
      setIsWobbling(true);
      // 晃動動畫持續 1 秒後重置狀態
      setTimeout(() => {
        setIsWobbling(false);
        // 隨機等待 2 到 7 秒後進行下一次晃動
        const nextWobbleDelay = 2000 + Math.random() * 5000;
        timeout = setTimeout(triggerWobble, nextWobbleDelay);
      }, 1000);
    };

    // 初始隨機延遲 1 到 4 秒後開始第一次晃動
    const initialDelay = 1000 + Math.random() * 3000;
    timeout = setTimeout(triggerWobble, initialDelay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <img 
      src="/isometric/egg.png?v=5" 
      alt="Mysterious Egg"
      className={`pixel-egg ${className} ${isWobbling ? 'wobble-active' : ''}`} 
      style={{ transformOrigin: 'bottom center' }}
    />
  );
}
