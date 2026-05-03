/* ═══════════════════════════════════════════════
   DocCompiler — 前端主要邏輯
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // ── DOM References ──
    const uploadZone    = document.getElementById('uploadZone');
    const uploadInner   = document.getElementById('uploadInner');
    const fileInput     = document.getElementById('fileInput');
    const sidebarProc   = document.getElementById('sidebarProcessing');
    const spText        = document.getElementById('spText');
    const docList       = document.getElementById('docList');
    const docCountBadge = document.getElementById('docCountBadge');

    const welcomeState  = document.getElementById('welcomeState');
    const processingState = document.getElementById('processingState');
    const docViewer     = document.getElementById('docViewer');

    // Processing steps
    const steps = {
        route:     document.getElementById('step-route'),
        parse:     document.getElementById('step-parse'),
        knowledge: document.getElementById('step-knowledge'),
        validate:  document.getElementById('step-validate'),
    };

    // Doc viewer elements
    const docFileIcon   = document.getElementById('docFileIcon');
    const docFilename   = document.getElementById('docFilename');
    const routeBadge    = document.getElementById('routeBadge');
    const typeBadge     = document.getElementById('typeBadge');
    const reviewBadge   = document.getElementById('reviewBadge');
    const confBarFill   = document.getElementById('confBarFill');
    const confValue     = document.getElementById('confValue');
    const deleteDocBtn  = document.getElementById('deleteDocBtn');
    const tabContentArea = document.getElementById('tabContentArea');

    // Tab buttons
    const ktabs = document.querySelectorAll('.ktab');

    // Chat bar
    const queryInput    = document.getElementById('queryInput');
    const querySendBtn  = document.getElementById('querySendBtn');

    // Answer overlay
    const answerOverlay = document.getElementById('answerOverlay');
    const answerQuestion = document.getElementById('answerQuestion');
    const answerBody    = document.getElementById('answerBody');
    const answerCloseBtn = document.getElementById('answerCloseBtn');

    // Error toast
    const errorToast    = document.getElementById('errorToast');
    const errorToastMsg = document.getElementById('errorToastMsg');

    // Start upload btn in welcome
    const startUploadBtn = document.getElementById('startUploadBtn');

    // ── State ──
    let currentDoc   = null;
    let currentTab   = 'L1';
    let allDocuments = [];

    // ── Init ──
    async function init() {
        await loadDocumentList();
        setupUploadZone();
        setupTabs();
        setupChatBar();
    }

    // ══════════════════════════════════════
    // 文件列表
    // ══════════════════════════════════════
    async function loadDocumentList() {
        try {
            const res = await fetch('/api/documents');
            const data = await res.json();
            if (data.success) {
                allDocuments = data.documents;
                renderDocList(allDocuments);
            }
        } catch (e) {
            console.error('載入文件列表失敗', e);
        }
    }

    function renderDocList(docs) {
        docCountBadge.textContent = docs.length;
        if (docs.length === 0) {
            docList.innerHTML = `<div class="doc-empty-state">
                <span class="material-symbols-rounded">description</span>
                <span>尚無文件</span>
            </div>`;
            return;
        }

        docList.innerHTML = '';
        docs.forEach(doc => {
            const item = buildDocItem(doc);
            item.addEventListener('click', () => openDocument(doc.id));
            docList.appendChild(item);
        });
    }

    function buildDocItem(doc) {
        const div = document.createElement('div');
        div.className = 'doc-item fade-in';
        div.dataset.docId = doc.id;

        const conf = Math.round((doc.confidence || 0) * 100);
        const confClass = conf >= 80 ? 'high' : conf >= 50 ? 'mid' : 'low';
        const routeLabel = {
            text: '文字解析', gpt_vision: 'AI 視覺', hybrid: '混合'
        }[doc.route_used] || doc.route_used;

        const reviewHtml = doc.needs_review
            ? `<span class="di-review">⚠ 待審</span>`
            : '';

        div.innerHTML = `
            <div class="di-name" title="${doc.filename}">${doc.filename}</div>
            <div class="di-meta">
                <span class="di-route">${routeLabel}</span>
                <span class="di-conf ${confClass}">${conf}%</span>
                ${reviewHtml}
            </div>`;
        return div;
    }

    function setActiveDocItem(id) {
        document.querySelectorAll('.doc-item').forEach(el => {
            el.classList.toggle('active', el.dataset.docId === id);
        });
    }

    // ══════════════════════════════════════
    // 上傳文件
    // ══════════════════════════════════════
    function setupUploadZone() {
        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());
        startUploadBtn?.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => {
            if (e.target.files[0]) handleFileUpload(e.target.files[0]);
            fileInput.value = '';
        });

        // Drag & drop
        uploadZone.addEventListener('dragover', e => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        uploadZone.addEventListener('drop', e => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
        });

        // Main area drag-over
        document.querySelector('.main-content').addEventListener('dragover', e => {
            e.preventDefault();
        });
        document.querySelector('.main-content').addEventListener('drop', e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
        });
    }

    async function handleFileUpload(file) {
        // Show processing state
        showState('processing');
        setProcessingStep('route');
        sidebarProc.classList.remove('hidden');
        spText.textContent = `分析 ${file.name}...`;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate step progression visually
            const stepTimer1 = setTimeout(() => setProcessingStep('parse'), 800);
            const stepTimer2 = setTimeout(() => setProcessingStep('knowledge'), 2500);
            const stepTimer3 = setTimeout(() => setProcessingStep('validate'), 8000);

            const res = await fetch('/api/document/upload', {
                method: 'POST',
                body: formData
            });

            clearTimeout(stepTimer1);
            clearTimeout(stepTimer2);
            clearTimeout(stepTimer3);
            setProcessingStep('done');

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || '伺服器錯誤');
            }

            // 成功：加入列表，顯示文件
            sidebarProc.classList.add('hidden');
            await loadDocumentList();
            renderDocument(data.document);

        } catch (err) {
            console.error('上傳失敗:', err);
            sidebarProc.classList.add('hidden');
            showState(currentDoc ? 'viewer' : 'welcome');
            showError('上傳失敗：' + err.message);
        }
    }

    function setProcessingStep(step) {
        const order = ['route', 'parse', 'knowledge', 'validate'];
        const labels = {
            route: '路線判斷中...',
            parse: '文件解析中...',
            knowledge: '知識層生成中（L1/L2/L3）...',
            validate: '驗證與儲存...',
            done: '完成！'
        };

        if (step === 'done') {
            Object.values(steps).forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
            return;
        }

        const idx = order.indexOf(step);
        order.forEach((s, i) => {
            const el = steps[s];
            el.classList.remove('active', 'done');
            if (i < idx) el.classList.add('done');
            else if (i === idx) el.classList.add('active');
        });

        spText.textContent = labels[step] || '處理中...';
    }

    // ══════════════════════════════════════
    // 開啟文件（從列表點擊）
    // ══════════════════════════════════════
    async function openDocument(id) {
        try {
            const res = await fetch(`/api/document/${id}`);
            const data = await res.json();
            if (data.success) {
                renderDocument(data.document);
            }
        } catch (e) {
            showError('無法載入文件');
        }
    }

    // ══════════════════════════════════════
    // 渲染文件檢視器
    // ══════════════════════════════════════
    function renderDocument(doc) {
        currentDoc = doc;
        setActiveDocItem(doc.document_id);

        // File icon
        const iconMap = { image: 'image', table: 'table', mixed: 'auto_awesome', text: 'description' };
        docFileIcon.textContent = iconMap[doc.document_type] || 'description';

        // Header info
        docFilename.textContent = doc.filename;
        docFilename.title = doc.filename;

        const routeLabels = { text: '文字解析', gpt_vision: 'AI 視覺解析', hybrid: '混合解析' };
        routeBadge.textContent = routeLabels[doc.route_used] || doc.route_used;
        typeBadge.textContent = doc.document_type;

        if (doc.needs_review) {
            reviewBadge.classList.remove('hidden');
        } else {
            reviewBadge.classList.add('hidden');
        }

        // Confidence
        const confPct = Math.round((doc.confidence || 0) * 100);
        const confColor = confPct >= 80 ? '#10b981' : confPct >= 50 ? '#f59e0b' : '#ef4444';
        confBarFill.style.width = confPct + '%';
        confBarFill.style.background = confColor;
        confValue.textContent = confPct + '%';
        confValue.style.color = confColor;

        // Enable chat bar
        queryInput.disabled = false;
        queryInput.placeholder = `向 AI 詢問關於「${doc.filename}」的問題...`;
        checkQueryBtn();

        // Render default tab
        currentTab = 'L1';
        ktabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'L1'));
        renderTab('L1');

        showState('viewer');
    }

    // ══════════════════════════════════════
    // Tab 切換
    // ══════════════════════════════════════
    function setupTabs() {
        ktabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                currentTab = tab;
                ktabs.forEach(t => t.classList.toggle('active', t === btn));
                renderTab(tab);
            });
        });
    }

    function renderTab(tab) {
        if (!currentDoc) return;
        tabContentArea.innerHTML = '';

        const k = currentDoc.knowledge || {};

        if (tab === 'L1') renderL1(k.L1);
        else if (tab === 'L2') renderL2(k.L2);
        else if (tab === 'L3') renderL3(k.L3);
        else if (tab === 'raw') renderRaw(currentDoc);
    }

    // ── L1 摘要層 ──
    function renderL1(L1) {
        if (!L1) {
            tabContentArea.innerHTML = '<div class="l3-header">L1 摘要層尚未生成</div>';
            return;
        }

        const validationHtml = buildValidationPanel(currentDoc);

        const keywordsHtml = (L1.keywords || []).length > 0
            ? `<div class="l1-keywords-wrap">
                <div class="l1-kw-label">關鍵詞</div>
                <div class="keyword-pills">
                    ${L1.keywords.map(k => `<span class="kw-pill">${esc(k)}</span>`).join('')}
                </div>
               </div>`
            : '';

        tabContentArea.innerHTML = `
            ${validationHtml}
            <div class="l1-card fade-in">
                <div class="l1-topic-row">
                    <span class="l1-label">L1 摘要層</span>
                    ${L1.topic ? `<span class="l1-topic-badge">${esc(L1.topic)}</span>` : ''}
                </div>
                <div class="l1-summary">${esc(L1.summary || '摘要生成中...')}</div>
                ${keywordsHtml}
            </div>`;
    }

    // ── L2 事實層 ──
    function renderL2(L2) {
        if (!L2 || L2.length === 0) {
            tabContentArea.innerHTML = '<div class="l2-header">L2 事實層尚未生成</div>';
            return;
        }

        const validationHtml = buildValidationPanel(currentDoc);
        const factsHtml = L2.map((item, idx) => {
            const conf = item.confidence || 0;
            const pct = Math.round(conf * 100);
            const cls = pct >= 80 ? 'conf-high' : pct >= 55 ? 'conf-mid' : 'conf-low';

            return `<div class="${cls} fade-in" style="animation-delay:${idx * 0.04}s">
                <div class="fact-card">
                    <div class="fact-text">${esc(item.fact)}</div>
                    <div class="fact-footer">
                        <span class="fact-source">
                            ${item.source_section ? `📌 ${esc(item.source_section)}` : ''}
                        </span>
                        <div class="fact-conf-wrap">
                            <div class="fact-conf-bar">
                                <div class="fact-conf-fill" style="width:${pct}%"></div>
                            </div>
                            <span class="fact-conf-pct">${pct}%</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        tabContentArea.innerHTML = `
            ${validationHtml}
            <div class="l2-header">共 ${L2.length} 條事實 · 顏色深淺代表信心分數</div>
            ${factsHtml}`;
    }

    // ── L3 證據層 ──
    function renderL3(L3) {
        if (!L3 || L3.length === 0) {
            tabContentArea.innerHTML = '<div class="l3-header">L3 證據層尚未生成</div>';
            return;
        }

        const validationHtml = buildValidationPanel(currentDoc);
        const evidenceHtml = L3.map((item, idx) => `
            <div class="evidence-card fade-in" style="animation-delay:${idx * 0.05}s">
                <blockquote>${esc(item.evidence)}</blockquote>
                <div class="evidence-footer">
                    ${item.section_title ? `<span class="evidence-section">${esc(item.section_title)}</span>` : ''}
                    <span class="evidence-page">p.${item.page || 1}</span>
                </div>
            </div>`).join('');

        tabContentArea.innerHTML = `
            ${validationHtml}
            <div class="l3-header">共 ${L3.length} 條原文引用</div>
            ${evidenceHtml}`;
    }

    // ── Raw 原始資料 ──
    function renderRaw(doc) {
        const secCount = (doc.sections || []).length;
        const tblCount = (doc.tables || []).length;
        const kfCount  = (doc.key_facts || []).length;
        const rawTextShort = (doc.raw_text || '').substring(0, 8000);

        tabContentArea.innerHTML = `
            <div class="raw-meta fade-in">
                <h4>文件元資訊</h4>
                <div class="raw-kv"><span class="raw-key">document_id</span><span class="raw-val">${esc(doc.document_id)}</span></div>
                <div class="raw-kv"><span class="raw-key">created_at</span><span class="raw-val">${esc(doc.created_at)}</span></div>
                <div class="raw-kv"><span class="raw-key">route_used</span><span class="raw-val">${esc(doc.route_used)}</span></div>
                <div class="raw-kv"><span class="raw-key">document_type</span><span class="raw-val">${esc(doc.document_type)}</span></div>
                <div class="raw-kv"><span class="raw-key">confidence</span><span class="raw-val">${(doc.confidence || 0).toFixed(3)}</span></div>
                <div class="raw-kv"><span class="raw-key">needs_review</span><span class="raw-val">${doc.needs_review}</span></div>
                <div class="raw-kv"><span class="raw-key">sections</span><span class="raw-val">${secCount} 個</span></div>
                <div class="raw-kv"><span class="raw-key">tables</span><span class="raw-val">${tblCount} 個</span></div>
                <div class="raw-kv"><span class="raw-key">key_facts</span><span class="raw-val">${kfCount} 條</span></div>
            </div>
            <div class="raw-text-label">原始文字（前 8000 字）</div>
            <div class="raw-text-block">${esc(rawTextShort)}</div>`;
    }

    // ── Validation panel ──
    function buildValidationPanel(doc) {
        const v = doc.validation;
        if (!v) return '';
        const issues = [
            ...(v.missing_fields || []).map(f => `缺少必填欄位：${f}`),
            ...(v.conflicts || []),
            ...(v.confidence_flags || [])
        ];
        if (issues.length === 0) return '';

        return `<div class="validation-panel fade-in">
            <div class="val-title">
                <span class="material-symbols-rounded">warning</span>
                驗證提醒（${issues.length} 項）
            </div>
            ${issues.map(i => `<div class="val-item">${esc(i)}</div>`).join('')}
        </div>`;
    }

    // ══════════════════════════════════════
    // 刪除文件
    // ══════════════════════════════════════
    deleteDocBtn.addEventListener('click', async () => {
        if (!currentDoc) return;
        if (!confirm(`確定要刪除「${currentDoc.filename}」嗎？`)) return;

        try {
            const res = await fetch(`/api/document/${currentDoc.document_id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                currentDoc = null;
                queryInput.disabled = true;
                queryInput.placeholder = '選擇文件後，輸入問題向 AI 詢問...';
                querySendBtn.disabled = true;
                closeAnswer();
                await loadDocumentList();
                showState('welcome');
            }
        } catch (e) {
            showError('刪除失敗');
        }
    });

    // ══════════════════════════════════════
    // Chat Bar / Q&A
    // ══════════════════════════════════════
    function setupChatBar() {
        queryInput.addEventListener('input', checkQueryBtn);
        queryInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendQuery();
            }
        });
        querySendBtn.addEventListener('click', sendQuery);
        answerCloseBtn.addEventListener('click', closeAnswer);
    }

    function checkQueryBtn() {
        const hasText = queryInput.value.trim().length > 0;
        const hasDoc  = !!currentDoc;
        querySendBtn.disabled = !(hasText && hasDoc);
    }

    async function sendQuery() {
        const question = queryInput.value.trim();
        if (!question || !currentDoc) return;

        queryInput.value = '';
        checkQueryBtn();

        // Show overlay with loading
        answerQuestion.textContent = `問：${question}`;
        answerBody.innerHTML = `<div class="answer-loading">
            <div class="answer-dots">
                <div class="a-dot"></div>
                <div class="a-dot"></div>
                <div class="a-dot"></div>
            </div>
            <span>AI 正在分析文件...</span>
        </div>`;
        answerOverlay.classList.remove('hidden');
        // Force reflow then add visible
        requestAnimationFrame(() => answerOverlay.classList.add('visible'));

        try {
            const res = await fetch(`/api/document/${currentDoc.document_id}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await res.json();

            if (!res.ok || !data.success) throw new Error(data.error || '問答失敗');

            answerBody.textContent = data.answer;

        } catch (err) {
            answerBody.textContent = '❌ 問答失敗：' + err.message;
        }
    }

    function closeAnswer() {
        answerOverlay.classList.remove('visible');
        setTimeout(() => answerOverlay.classList.add('hidden'), 350);
    }

    // ══════════════════════════════════════
    // State Management
    // ══════════════════════════════════════
    function showState(state) {
        welcomeState.style.display    = state === 'welcome'    ? 'flex' : 'none';
        processingState.style.display = state === 'processing' ? 'flex' : 'none';

        if (state === 'viewer') {
            docViewer.classList.remove('hidden');
        } else {
            docViewer.classList.add('hidden');
        }
    }

    // ══════════════════════════════════════
    // Error Toast
    // ══════════════════════════════════════
    let errorTimer;
    function showError(msg) {
        errorToastMsg.textContent = msg;
        errorToast.classList.remove('hidden');
        clearTimeout(errorTimer);
        errorTimer = setTimeout(() => errorToast.classList.add('hidden'), 4000);
    }

    // ── HTML escape helper ──
    function esc(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ── Start ──
    init();
});
