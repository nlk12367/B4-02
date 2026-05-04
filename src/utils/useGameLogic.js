import { useState } from 'react';

export function useGameLogic() {
  const [daysPassed, setDaysPassed] = useState(0);
  const [islandLevel, setIslandLevel] = useState(1);
  const [petState, setPetState] = useState('egg'); // 'egg' or 'mascot'
  const [emotionHistory, setEmotionHistory] = useState([]);

  // 模擬使用者聊完一天的天數增加與情緒累積
  const simulateChat = (emotion) => {
    const newDays = daysPassed + 1;
    setDaysPassed(newDays);
    
    const newHistory = [...emotionHistory, emotion];
    setEmotionHistory(newHistory);

    // 邏輯 1：島嶼擴張 (每 2 天擴張一次島嶼，最大等級 3)
    if (newDays % 2 === 0) {
      setIslandLevel(prev => Math.min(prev + 1, 3));
    }

    // 邏輯 2：吉祥物孵化 (第 3 天時，如果還是蛋，就會孵化)
    // 這裡可以依據 emotionHistory 來決定孵化出哪一隻，目前預設孵化為 mascot_flag
    if (newDays >= 3 && petState === 'egg') {
      // 假設依據最高頻率的情緒孵化
      setPetState('mascot'); 
    }
  };

  const resetGame = () => {
    setDaysPassed(0);
    setIslandLevel(1);
    setPetState('egg');
    setEmotionHistory([]);
  };

  return { 
    daysPassed, 
    islandLevel, 
    petState, 
    simulateChat, 
    resetGame,
    emotionHistory
  };
}
