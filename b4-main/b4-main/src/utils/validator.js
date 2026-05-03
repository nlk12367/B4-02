/**
 * validator.js — 文件驗證器
 * 驗證解析結果並計算 confidence 分數
 */

const REQUIRED_FIELDS = ['document_id', 'route_used', 'raw_text'];

/**
 * 驗證文件 JSON 並回傳驗證結果
 * @param {object} doc
 * @returns {{ validation: object, confidence: number, needs_review: boolean }}
 */
function validate(doc) {
    const result = {
        missing_fields: [],
        empty_sections: [],
        conflicts: [],
        confidence_flags: []
    };

    let confidence = doc.confidence ?? 1.0;

    // 1. 必填欄位檢查
    for (const field of REQUIRED_FIELDS) {
        if (!doc[field] && doc[field] !== 0) {
            result.missing_fields.push(field);
        }
    }

    // 2. 空值檢查
    if (!doc.sections || doc.sections.length === 0) {
        result.empty_sections.push('sections');
        confidence -= 0.3;
        result.confidence_flags.push('未提取到任何章節');
    }
    if (!doc.key_facts || doc.key_facts.length === 0) {
        result.empty_sections.push('key_facts');
        result.confidence_flags.push('未提取到關鍵事實');
    }

    // 3. raw_text 長度檢查
    if (!doc.raw_text || doc.raw_text.length < 30) {
        confidence -= 0.2;
        result.confidence_flags.push('原始文字過短（< 30 字）');
    }

    // 4. 表格欄位完整性
    if (doc.tables && doc.tables.length > 0) {
        const badTables = doc.tables.filter(t => !t.headers || t.headers.length === 0);
        if (badTables.length > 0) {
            result.conflicts.push(`發現 ${badTables.length} 個無標題的表格`);
        }
    }

    // 5. 衝突欄位：高信心但缺少必填欄位
    if (confidence > 0.8 && result.missing_fields.length > 0) {
        result.conflicts.push('信心分數高但缺少必填欄位，可能存在解析錯誤');
    }

    // 6. 知識層完整性檢查
    if (doc.knowledge) {
        if (!doc.knowledge.L1?.summary) {
            result.confidence_flags.push('L1 摘要為空');
            confidence -= 0.1;
        }
        if (!doc.knowledge.L2 || doc.knowledge.L2.length === 0) {
            result.confidence_flags.push('L2 事實層為空');
            confidence -= 0.1;
        }
        if (!doc.knowledge.L3 || doc.knowledge.L3.length === 0) {
            result.confidence_flags.push('L3 證據層為空');
        }
    }

    confidence = Math.max(0, Math.min(1, confidence));
    const needs_review = result.missing_fields.length > 0 ||
        result.conflicts.length > 0 ||
        confidence < 0.4;

    return { validation: result, confidence, needs_review };
}

module.exports = { validate };
