const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// === 靜態檔案 ===
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '20mb' }));

// === 模組載入 ===
const guardrails = require('./src/utils/guardrails');
const schema = require('./src/utils/schema');
const router = require('./src/utils/router');
const parser = require('./src/utils/parser');
const knowledge = require('./src/utils/knowledge');
const validator = require('./src/utils/validator');
const storage = require('./src/utils/storage');

// === Multer 設定（記憶體儲存，最大 15MB）===
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        const allowed = /image\/(jpeg|jpg|png|gif|webp)|text\/.+|application\/(json)/;
        if (allowed.test(file.mimetype) || file.originalname.match(/\.(txt|md|csv|json)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('不支援的檔案類型，請上傳圖片或文字文件'));
        }
    }
});

// === 工具函式：讀取 API Keys ===
function getApiKeys() {
    const keys = {};

    if (process.env.GEMINI_API_KEY) keys['GEMINI_API_KEY'] = process.env.GEMINI_API_KEY;
    if (process.env.OPENAI_API_KEY) keys['OPENAI_API_KEY'] = process.env.OPENAI_API_KEY;

    const keyFilePath = path.join(__dirname, 'api_key.txt');
    if (fs.existsSync(keyFilePath)) {
        const lines = fs.readFileSync(keyFilePath, 'utf-8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                let [name, ...rest] = trimmed.split('=');
                const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
                if (!keys[name.trim()]) keys[name.trim()] = val;
            }
        }
    }

    return keys;
}

// =====================================================
// 原有 API（保留相容性）
// =====================================================

app.get('/api/keys', (req, res) => {
    const keys = getApiKeys();
    if (Object.keys(keys).length > 0) {
        res.json({ success: true, keys });
    } else {
        res.status(400).json({ error: '找不到 API Key' });
    }
});

app.get('/api/prompt/:name', (req, res) => {
    const promptPath = path.join(__dirname, 'docs', req.params.name + '.md');
    if (!fs.existsSync(promptPath)) {
        return res.status(404).json({ error: `找不到 ${req.params.name}.md` });
    }
    res.json({ success: true, prompt: fs.readFileSync(promptPath, 'utf-8') });
});

app.post('/api/guardrails/process', async (req, res) => {
    const { text, context } = req.body;
    if (!text || text.trim() === '') return res.json({ success: true, sanitizedText: '' });

    try {
        const classificationResult = await guardrails.classifyText(text, context);
        if (!classificationResult.isSafe) {
            return res.json({ success: false, reason: classificationResult.reason });
        }
        const cleanText = guardrails.sanitizeText(text);
        res.json({ success: true, sanitizedText: cleanText });
    } catch (err) {
        res.status(500).json({ success: false, reason: '內部安檢伺服器錯誤' });
    }
});

// =====================================================
// 文件知識編譯 API
// =====================================================

/**
 * POST /api/document/upload
 * 上傳並處理文件（路由 → 解析 → 知識生成 → 驗證 → 儲存）
 */
app.post('/api/document/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '請上傳文件' });
    }

    const apiKeys = getApiKeys();

    try {
        const { originalname, mimetype, buffer } = req.file;

        // Step 1: 路由判斷
        const route = router.determineRoute(originalname, mimetype);
        const docType = router.getDocumentType(originalname, mimetype);

        // Step 2: 建立文件基礎結構
        const doc = schema.createDocument({
            filename: originalname,
            route_used: route,
            document_type: docType
        });

        // Step 3: 解析文件
        let parsed;
        if (route === 'text') {
            const text = buffer.toString('utf-8');
            parsed = parser.parseText(text, originalname);
        } else {
            const base64 = buffer.toString('base64');
            parsed = await parser.parseWithVision(base64, mimetype, apiKeys);
            if (parsed.document_type) doc.document_type = parsed.document_type;
        }

        doc.raw_text = parsed.raw_text || '';
        doc.sections = parsed.sections || [];
        doc.tables = parsed.tables || [];
        doc.key_facts = parsed.key_facts || [];
        doc.source_pages = [...new Set((parsed.sections || []).map(s => s.page || 1))];

        // Step 4: L1/L2/L3 知識層生成
        const knowledgeResult = await knowledge.generateKnowledge(doc, apiKeys);
        doc.knowledge = knowledgeResult;

        // 若 key_facts 尚空，從 L2 補充
        if (doc.key_facts.length === 0 && knowledgeResult.L2) {
            doc.key_facts = knowledgeResult.L2.map(f => f.fact);
        }

        // Step 5: 驗證
        const validationResult = validator.validate(doc);
        doc.validation = validationResult.validation;
        doc.confidence = validationResult.confidence;
        doc.needs_review = validationResult.needs_review;

        // Step 6: 儲存
        storage.save(doc);

        res.json({ success: true, document: doc });

    } catch (err) {
        console.error('文件處理失敗:', err);
        res.status(500).json({ error: '文件處理失敗：' + err.message });
    }
});

/**
 * GET /api/documents
 * 列出所有已處理文件（索引資訊）
 */
app.get('/api/documents', (req, res) => {
    res.json({ success: true, documents: storage.list() });
});

/**
 * GET /api/document/:id
 * 取得文件完整 JSON
 */
app.get('/api/document/:id', (req, res) => {
    const doc = storage.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: '找不到文件' });
    res.json({ success: true, document: doc });
});

/**
 * GET /api/document/:id/knowledge
 * 僅取得知識層（L1/L2/L3）
 */
app.get('/api/document/:id/knowledge', (req, res) => {
    const doc = storage.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: '找不到文件' });
    res.json({ success: true, knowledge: doc.knowledge });
});

/**
 * POST /api/document/:id/query
 * 針對文件進行 AI 問答，使用 L2+L3 作為上下文
 */
app.post('/api/document/:id/query', async (req, res) => {
    const doc = storage.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: '找不到文件' });

    const { question } = req.body;
    if (!question || !question.trim()) {
        return res.status(400).json({ error: '請輸入問題' });
    }

    const apiKeys = getApiKeys();

    try {
        const answer = await knowledge.queryDocument(doc, question, apiKeys);
        res.json({ success: true, answer, question });
    } catch (err) {
        console.error('文件問答失敗:', err);
        res.status(500).json({ error: '問答失敗：' + err.message });
    }
});

/**
 * DELETE /api/document/:id
 * 刪除文件
 */
app.delete('/api/document/:id', (req, res) => {
    const ok = storage.deleteById(req.params.id);
    if (!ok) return res.status(404).json({ error: '找不到文件' });
    res.json({ success: true });
});

// =====================================================
// 啟動伺服器
// =====================================================
app.listen(PORT, () => {
    const apiKeys = getApiKeys();
    console.log(`\n🔬 文件知識編譯系統已啟動`);
    console.log(`   → http://localhost:${PORT}`);
    console.log(`   → API Keys: ${Object.keys(apiKeys).join(', ') || '未設定'}\n`);
});
