import { useState, useEffect } from 'react';
import { analyzeEmotion } from './aiService';

export function useEmotion() {
  const [emotion, setEmotion] = useState('Calm'); // Calm, Anxious, Joyful, Sad
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasChatHistory, setHasChatHistory] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchEmotion() {
      const saved = localStorage.getItem('come_talk_messages');
      if (saved) {
        const messages = JSON.parse(saved);
        // 如果只有預設的第一則訊息，代表使用者還沒說過話
        if (messages.length > 1) {
          if (mounted) setHasChatHistory(true);
          
          const cached = localStorage.getItem('come_talk_emotion_cache');
          const cacheTime = localStorage.getItem('come_talk_emotion_time');
          const lastMsgTime = messages[messages.length - 1].time;
          
          if (cached && cacheTime === lastMsgTime) {
            if (mounted) setEmotion(cached);
            return;
          }

          if (mounted) setIsAnalyzing(true);
          try {
            const result = await analyzeEmotion(messages);
            if (mounted) {
              setEmotion(result);
              localStorage.setItem('come_talk_emotion_cache', result);
              localStorage.setItem('come_talk_emotion_time', lastMsgTime);
            }
          } catch (err) {
            console.error(err);
          } finally {
            if (mounted) setIsAnalyzing(false);
          }
        } else {
          if (mounted) setHasChatHistory(false);
        }
      } else {
        if (mounted) setHasChatHistory(false);
      }
    }
    fetchEmotion();

    return () => {
      mounted = false;
    };
  }, []);

  return { emotion, isAnalyzing, hasChatHistory };
}
