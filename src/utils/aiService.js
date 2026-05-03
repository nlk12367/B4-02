export async function generateChatResponse(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('請先在 .env 中設定 VITE_OPENAI_API_KEY');
  }

  const systemPrompt = `你是一位充滿同理心、溫柔且極具洞察力的心理陪伴AI，名字叫 Aethera。
你的任務是傾聽使用者的心聲，並給予溫暖、有建設性的回應。如果使用者傳送了圖片，請細心觀察圖片內容並與使用者的情緒或話語做連結。
此外，你必須預測使用者接下來可能會想探討的問題或方向，並提供 2-3 個「建議選項(options)」。

請必須嚴格回傳一個 JSON 格式的物件，包含兩個欄位：
1. "text": 你的對話回應（請使用繁體中文，語氣輕柔、溫暖）。
2. "options": 包含 2-3 個短句的陣列，代表給使用者的追問建議（如 ["多跟我說一點", "我該如何放下?"]）。`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => {
      if (msg.image) {
        return {
          role: msg.sender === 'You' ? 'user' : 'assistant',
          content: [
            { type: "text", text: msg.text || "請看看這張照片" },
            { type: "image_url", image_url: { url: msg.image } }
          ]
        };
      }
      return {
        role: msg.sender === 'You' ? 'user' : 'assistant',
        content: msg.text
      };
    })
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: apiMessages,
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API 錯誤: ${response.status}`);
  }

  const data = await response.json();
  const contentStr = data.choices?.[0]?.message?.content || '{}';
  
  try {
    const result = JSON.parse(contentStr);
    return {
      text: result.text || '我正在消化你的話語...',
      options: result.options || []
    };
  } catch (err) {
    console.error("JSON 解析失敗:", err);
    return {
      text: contentStr,
      options: []
    };
  }
}

export async function analyzeEmotion(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('請先在 .env 中設定 VITE_OPENAI_API_KEY');
  }

  if (!messages || messages.length === 0) return 'Calm';

  const systemPrompt = `你是一個心理情緒分析AI。請分析以下使用者與AI的對話紀錄，並判斷使用者目前的情緒狀態。
請必須嚴格回傳一個 JSON 格式的物件，包含一個欄位：
"emotion": 必須是 "Calm"、"Anxious"、"Joyful" 或 "Sad" 其中之一，請選出最符合當前狀態的單詞。`;

  const conversationText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `請分析以下對話的情緒：\n\n${conversationText}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  if (!response.ok) {
    return 'Calm';
  }

  const data = await response.json();
  const contentStr = data.choices?.[0]?.message?.content || '{}';
  
  try {
    const result = JSON.parse(contentStr);
    const validEmotions = ['Calm', 'Anxious', 'Joyful', 'Sad'];
    return validEmotions.includes(result.emotion) ? result.emotion : 'Calm';
  } catch (err) {
    return 'Calm';
  }
}
