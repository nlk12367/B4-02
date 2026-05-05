import { useState } from 'react';

// 次要島嶼的圖塊池（循環使用）
const TILE_POOL = [
  'tile_center.png',
  'corner_outer.png',
  'edge_straight.png',
  'tile_rock.png',
  'tile_center.png',
  'corner_outer.png',
];

const HATCH_DAYS = 3; // 蛋出現後幾天孵化

const INITIAL_ISLANDS = [
  { id: 0, tileImg: 'tile_grass.png', petState: 'egg', bornDay: 0 }
];

export function useGameLogic() {
  const [daysPassed, setDaysPassed] = useState(0);
  const [islands, setIslands] = useState(INITIAL_ISLANDS);
  const [emotionHistory, setEmotionHistory] = useState([]);

  const simulateChat = (emotion) => {
    const newDays = daysPassed + 1;
    setDaysPassed(newDays);
    setEmotionHistory(prev => [...prev, emotion]);

    setIslands(prev => {
      let next = prev.map(island => {
        // 每顆蛋在 bornDay + HATCH_DAYS 天後孵化
        if (island.petState === 'egg' && newDays - island.bornDay >= HATCH_DAYS) {
          return { ...island, petState: 'mascot' };
        }
        return island;
      });

      // 每 2 天新增一座島嶼（帶著一顆新蛋）
      if (newDays % 2 === 0) {
        const newId = next.length;
        next = [...next, {
          id: newId,
          tileImg: TILE_POOL[(newId - 1) % TILE_POOL.length],
          petState: 'egg',
          bornDay: newDays,
        }];
      }

      return next;
    });
  };

  const resetGame = () => {
    setDaysPassed(0);
    setIslands(INITIAL_ISLANDS);
    setEmotionHistory([]);
  };

  // 向後相容：主島資訊
  const mainIsland = islands[0];

  return {
    daysPassed,
    islands,
    petState: mainIsland.petState,      // 主島蛋狀態（供進度條使用）
    islandLevel: islands.length,         // 向後相容
    simulateChat,
    resetGame,
    emotionHistory,
  };
}
