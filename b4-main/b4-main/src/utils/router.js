/**
 * router.js — 文件路由判斷
 * 根據檔案類型決定走哪條解析路線
 */

const TEXT_EXTENSIONS = new Set(['txt', 'md', 'csv', 'json']);

/**
 * 判斷文件應走哪條解析路線
 * @param {string} filename
 * @param {string} mimeType
 * @returns {'text' | 'gpt_vision'}
 */
function determineRoute(filename, mimeType) {
    const ext = (filename || '').split('.').pop().toLowerCase();
    const isImage = mimeType && mimeType.startsWith('image/');

    if (isImage) return 'gpt_vision';
    if (TEXT_EXTENSIONS.has(ext)) return 'text';

    // 未知類型，嘗試 vision 路線
    return 'gpt_vision';
}

/**
 * 判斷文件類型分類
 * @param {string} filename
 * @param {string} mimeType
 * @returns {'text' | 'table' | 'image' | 'mixed'}
 */
function getDocumentType(filename, mimeType) {
    const ext = (filename || '').split('.').pop().toLowerCase();
    const isImage = mimeType && mimeType.startsWith('image/');

    if (isImage) return 'image';
    if (ext === 'csv') return 'table';
    if (ext === 'json') return 'text';
    return 'text';
}

/**
 * 取得路線的中文標籤
 */
function getRouteLabel(route) {
    const labels = {
        text: '文字解析',
        gpt_vision: 'AI 視覺解析',
        hybrid: '混合解析'
    };
    return labels[route] || route;
}

module.exports = { determineRoute, getDocumentType, getRouteLabel };
