/**
 * storage.js — JSON 檔案儲存層
 * 將文件儲存為本地 JSON 檔案，並維護索引
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// 確保 data 目錄存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 確保索引檔存在
if (!fs.existsSync(INDEX_FILE)) {
    fs.writeFileSync(INDEX_FILE, '[]', 'utf-8');
}

/** 讀取索引 */
function readIndex() {
    try {
        return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    } catch {
        return [];
    }
}

/** 寫入索引 */
function writeIndex(index) {
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

/**
 * 儲存文件
 * @param {object} doc
 * @returns {object} 儲存後的文件
 */
function save(doc) {
    const docPath = path.join(DATA_DIR, `${doc.document_id}.json`);
    fs.writeFileSync(docPath, JSON.stringify(doc, null, 2), 'utf-8');

    // 更新索引
    const index = readIndex();
    const existingIdx = index.findIndex(d => d.id === doc.document_id);
    const entry = {
        id: doc.document_id,
        created_at: doc.created_at,
        filename: doc.filename,
        route_used: doc.route_used,
        document_type: doc.document_type,
        confidence: doc.confidence,
        needs_review: doc.needs_review,
        topic: doc.knowledge?.L1?.topic || '',
        keywords: doc.knowledge?.L1?.keywords || []
    };

    if (existingIdx >= 0) {
        index[existingIdx] = entry;
    } else {
        index.unshift(entry); // 最新在最前
    }

    writeIndex(index);
    return doc;
}

/**
 * 依 ID 取得文件完整 JSON
 * @param {string} id
 * @returns {object|null}
 */
function getById(id) {
    const docPath = path.join(DATA_DIR, `${id}.json`);
    if (!fs.existsSync(docPath)) return null;
    try {
        return JSON.parse(fs.readFileSync(docPath, 'utf-8'));
    } catch {
        return null;
    }
}

/**
 * 列出所有文件（僅索引資訊）
 * @returns {Array}
 */
function list() {
    return readIndex();
}

/**
 * 依 ID 刪除文件
 * @param {string} id
 * @returns {boolean}
 */
function deleteById(id) {
    const docPath = path.join(DATA_DIR, `${id}.json`);
    if (!fs.existsSync(docPath)) return false;

    fs.unlinkSync(docPath);

    const index = readIndex();
    const newIndex = index.filter(d => d.id !== id);
    writeIndex(newIndex);
    return true;
}

module.exports = { save, getById, list, deleteById };
