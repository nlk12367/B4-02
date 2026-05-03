export async function generateChatResponse(messages, currentDoc) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('請先在 .env 中設定 VITE_OPENAI_API_KEY');
  }

  // 系統預設提示詞
  let systemPrompt = `你是一位充滿同理心、溫柔且極具洞察力的心理陪伴AI，名字叫 Aethera。
你的任務是傾聽使用者的心聲，並給予溫暖、有建設性的回應。
此外，你必須預測使用者接下來可能會想探討的問題或方向，並提供 2-3 個「建議選項(options)」。

請必須嚴格回傳一個 JSON 格式的物件，包含兩個欄位：
1. "text": 你的對話回應（請使用繁體中文，語氣輕柔、溫暖）。
2. "options": 包含 2-3 個短句的陣列，代表給使用者的追問建議（如 ["多跟我說一點", "我該如何放下?"]）。`;

  // 如果有掛載文件，將文件上下文加入 Prompt
  if (currentDoc && currentDoc.knowledge) {
    systemPrompt += `\n\n【目前使用者正在參考一份名為 ${currentDoc.filename} 的文件】
以下是該文件的核心知識提取：
- L1 摘要: ${currentDoc.knowledge.L1?.summary || '無'}
- L2 事實: ${(currentDoc.knowledge.L2 || []).map(f => f.fact).join('; ')}
- L3 證據: ${(currentDoc.knowledge.L3 || []).map(e => e.evidence).join('; ')}

請參考上述文件資訊來回答使用者關於此文件的問題，並在建議選項中引導使用者探索文件中的其他事實。`;
  }

  // 組合訊息歷史
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.sender === 'You' ? 'user' : 'assistant',
      content: msg.text
    }))
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
