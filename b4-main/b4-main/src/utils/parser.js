/**
 * parser.js — 雙路解析器
 * 文字路線（本地解析） + GPT Vision 路線（AI 解析）
 */

/**
 * 從 Markdown/純文字中提取章節結構
 * @param {string} text
 * @param {string} filename
 * @returns {{ raw_text, sections, tables, key_facts }}
 */
function parseText(text, filename) {
    const ext = (filename || '').split('.').pop().toLowerCase();

    // CSV 特殊處理
    if (ext === 'csv') {
        return parseCsv(text);
    }

    // JSON 特殊處理
    if (ext === 'json') {
        return parseJson(text);
    }

    // Markdown / 純文字
    return parseMarkdown(text);
}

function parseMarkdown(text) {
    const lines = text.split('\n');
    const sections = [];
    const tables = [];
    let currentTitle = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

        if (headingMatch) {
            // 儲存前一節
            if (currentTitle !== null) {
                const content = currentContent.join('\n').trim();
                if (content) {
                    sections.push({ title: currentTitle, content, page: 1 });
                }
            }
            currentTitle = headingMatch[2].trim();
            currentContent = [];
        } else {
            currentContent.push(line);

            // 偵測 Markdown 表格
            if (line.includes('|') && line.trim().startsWith('|')) {
                const tableBlock = extractTable(lines, i);
                if (tableBlock) {
                    tables.push({ ...tableBlock, page: 1 });
                }
            }
        }
    }

    // 儲存最後一節
    if (currentTitle !== null) {
        const content = currentContent.join('\n').trim();
        if (content) sections.push({ title: currentTitle, content, page: 1 });
    } else if (sections.length === 0) {
        // 無標題：整份當一節
        sections.push({ title: '內容', content: text.trim(), page: 1 });
    }

    return { raw_text: text, sections, tables, key_facts: [] };
}

function parseCsv(text) {
    const rows = text.split('\n').map(r => r.split(',').map(c => c.trim()));
    if (rows.length === 0) return { raw_text: text, sections: [], tables: [], key_facts: [] };

    const headers = rows[0];
    const dataRows = rows.slice(1).filter(r => r.some(c => c));

    const tables = [{ headers, rows: dataRows, page: 1 }];
    const sections = [{ title: 'CSV 資料表', content: text, page: 1 }];

    return { raw_text: text, sections, tables, key_facts: [] };
}

function parseJson(text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = {}; }

    const pretty = JSON.stringify(parsed, null, 2);
    const sections = [{ title: 'JSON 結構', content: pretty, page: 1 }];
    const key_facts = Object.keys(parsed).slice(0, 10).map(k => `${k}: ${JSON.stringify(parsed[k]).substring(0, 80)}`);

    return { raw_text: text, sections, tables: [], key_facts };
}

function extractTable(lines, startIdx) {
    // 找出連續的 | 行作為一個表格
    const tableLine = lines[startIdx];
    if (!tableLine || !tableLine.trim().startsWith('|')) return null;

    const cells = tableLine.split('|').filter(c => c.trim() !== '').map(c => c.trim());

    // 下一行如果是分隔符（-|---|-），代表這是表格標題行
    const nextLine = lines[startIdx + 1] || '';
    if (nextLine.match(/^\|[-\s|:]+\|$/)) {
        return { headers: cells, rows: [], page: 1 };
    }

    return null;
}

/**
 * 使用 AI Vision 解析圖片文件
 * @param {string} imageBase64
 * @param {string} mimeType
 * @param {object} apiKeys
 * @returns {Promise<object>}
 */
async function parseWithVision(imageBase64, mimeType, apiKeys) {
    const prompt = `你是一個專業的文件分析AI。請仔細分析這張圖片中的文件，提取所有文字與結構資訊。

請以下列JSON格式輸出（只輸出JSON，不要有其他文字）：
{
  "raw_text": "圖片中所有文字的完整提取，保持原始段落結構",
  "sections": [{"title": "章節或段落標題", "content": "段落內容", "page": 1}],
  "tables": [{"headers": ["欄位名稱1", "欄位名稱2"], "rows": [["值1", "值2"]], "page": 1}],
  "key_facts": ["重要事實或數據1", "重要事實或數據2"],
  "document_type": "text或table或image或mixed"
}

注意：
- 若圖片中沒有表格，tables 設為空陣列
- 若文字無明顯章節分隔，用內容的自然段落作為一個 section
- key_facts 提取 3-8 個最重要的事實或數字`;

    if (apiKeys.GEMINI_API_KEY) {
        return await callGeminiVision(prompt, imageBase64, mimeType, apiKeys.GEMINI_API_KEY);
    }
    if (apiKeys.OPENAI_API_KEY) {
        return await callOpenAIVision(prompt, imageBase64, mimeType, apiKeys.OPENAI_API_KEY);
    }
    throw new Error('無可用的 API Key，無法執行視覺解析');
}

async function callGeminiVision(prompt, base64, mimeType, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: base64 } }
                ]
            }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1
            }
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini Vision API 錯誤: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text);
}

async function callOpenAIVision(prompt, base64, mimeType, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
                ]
            }],
            response_format: { type: 'json_object' },
            temperature: 0.1
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI Vision API 錯誤: ${err}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

module.exports = { parseText, parseWithVision };
