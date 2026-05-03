/**
 * knowledge.js — L1/L2/L3 知識層生成器
 * 使用 AI 從解析後的文件生成三層知識表示
 */

/**
 * 生成 L1/L2/L3 知識層
 * @param {object} doc
 * @param {object} apiKeys
 * @returns {Promise<{ L1, L2, L3 }>}
 */
async function generateKnowledge(doc, apiKeys) {
    const sectionsText = (doc.sections || [])
        .slice(0, 12)
        .map(s => `【${s.title}】\n${s.content?.substring(0, 500)}`)
        .join('\n\n');

    const prompt = `你是一個文件知識編譯AI。請分析以下文件，生成三層結構化知識表示。

===【文件基本資訊】===
檔案類型：${doc.document_type}
解析路線：${doc.route_used}
原始文字長度：${doc.raw_text?.length || 0} 字

===【原始文字（前3000字）】===
${doc.raw_text?.substring(0, 3000)}

===【章節結構】===
${sectionsText || '無明顯章節'}

===【提取的關鍵事實】===
${(doc.key_facts || []).join('\n') || '無'}

請以下列JSON格式回應（只輸出JSON，不要有其他任何文字）：
{
  "L1": {
    "summary": "一段話精確概括文件的核心內容與主旨（80-150字，繁體中文）",
    "topic": "文件主題的簡短標籤（5字以內）",
    "keywords": ["關鍵詞1", "關鍵詞2", "關鍵詞3", "關鍵詞4", "關鍵詞5"]
  },
  "L2": [
    {
      "fact": "具體、可驗證的事實或資訊陳述（不超過60字）",
      "source_section": "此事實來源的章節標題",
      "confidence": 0.95
    }
  ],
  "L3": [
    {
      "evidence": "直接從原文提取的相關段落或引用（不超過120字，儘量保持原文）",
      "page": 1,
      "section_title": "所屬章節標題"
    }
  ]
}

規則：
- L2 提供 5-10 條事實，每條 confidence 在 0.5-1.0 之間
- L3 提供 3-8 條證據，儘量保留原文措辭
- 所有內容使用繁體中文`;

    try {
        if (apiKeys.GEMINI_API_KEY) {
            return await callGemini(prompt, apiKeys.GEMINI_API_KEY);
        }
        if (apiKeys.OPENAI_API_KEY) {
            return await callOpenAI(prompt, apiKeys.OPENAI_API_KEY);
        }
    } catch (err) {
        console.error('知識層生成失敗，使用回退方案:', err.message);
    }

    // 回退：基本提取
    return buildFallbackKnowledge(doc);
}

async function callGemini(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini 回傳空內容');

    return JSON.parse(text);
}

async function callOpenAI(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.2
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

function buildFallbackKnowledge(doc) {
    const summary = doc.raw_text?.substring(0, 150) || '無法生成摘要';
    return {
        L1: {
            summary,
            topic: '未分類',
            keywords: doc.key_facts?.slice(0, 5) || []
        },
        L2: (doc.key_facts || []).slice(0, 5).map(fact => ({
            fact,
            source_section: doc.sections?.[0]?.title || '內容',
            confidence: 0.6
        })),
        L3: (doc.sections || []).slice(0, 5).map(s => ({
            evidence: s.content?.substring(0, 120) || '',
            page: 1,
            section_title: s.title || '內容'
        }))
    };
}

/**
 * 針對文件進行問答
 * @param {object} doc - 完整文件 JSON
 * @param {string} question - 使用者問題
 * @param {object} apiKeys
 * @returns {Promise<string>}
 */
async function queryDocument(doc, question, apiKeys) {
    const l2Facts = (doc.knowledge?.L2 || [])
        .map((f, i) => `${i + 1}. [${(f.confidence * 100).toFixed(0)}%] ${f.fact}`)
        .join('\n');

    const l3Evidence = (doc.knowledge?.L3 || [])
        .map((e, i) => `[引用${i + 1}｜${e.section_title}] ${e.evidence}`)
        .join('\n\n');

    const prompt = `你是一個文件問答AI，請根據以下文件知識回答問題。請優先使用 L2 事實與 L3 原文證據，若文件中找不到答案請誠實告知。

═══ L1 文件摘要 ═══
${doc.knowledge?.L1?.summary || '無摘要'}
主題：${doc.knowledge?.L1?.topic || '未知'}
關鍵詞：${(doc.knowledge?.L1?.keywords || []).join('、')}

═══ L2 核心事實 ═══
${l2Facts || '無'}

═══ L3 原文證據 ═══
${l3Evidence || '無'}

═══ 原始內容（前2000字）═══
${doc.raw_text?.substring(0, 2000) || ''}

━━━━━━━━━━━━━━━━━━━━━━━━
問題：${question}
━━━━━━━━━━━━━━━━━━━━━━━━

請用繁體中文回答，回答後若有引用原文請標出【來源：章節名稱】。`;

    try {
        if (apiKeys.GEMINI_API_KEY) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeys.GEMINI_API_KEY}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4 }
                })
            });
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '無法生成回答';
        }

        if (apiKeys.OPENAI_API_KEY) {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKeys.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.4
                })
            });
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '無法生成回答';
        }
    } catch (err) {
        console.error('文件問答失敗:', err.message);
    }

    return '無可用的 API Key，或問答過程發生錯誤。';
}

module.exports = { generateKnowledge, queryDocument };
