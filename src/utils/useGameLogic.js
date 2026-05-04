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

    // 邏輯 1：島嶼擴張 (每天擴張一次島嶼，初始為 Lv.1，第一天變 Lv.2)
    setIslandLevel(Math.min(newDays + 1, 3));

    // 邏輯 2：吉祥物孵化 (第 3 天時，如果還是蛋，就會孵化)
    if (newDays >= 3 && petState === 'egg') {
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
