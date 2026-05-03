/**
 * schema.js — 統一 JSON Schema 定義
 * 文件知識編譯系統 MVP1
 */

function createDocument(overrides = {}) {
    return {
        document_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        filename: '',
        route_used: 'text',        // 'text' | 'gpt_vision' | 'hybrid'
        document_type: 'text',     // 'text' | 'table' | 'image' | 'mixed'
        raw_text: '',
        sections: [],              // [{ title, content, page }]
        tables: [],                // [{ headers, rows, page }]
        key_facts: [],             // string[]
        source_pages: [],          // number[]
        confidence: 1.0,
        needs_review: false,
        validation: {
            missing_fields: [],
            empty_sections: [],
            conflicts: [],
            confidence_flags: []
        },
        knowledge: {
            L1: { summary: '', topic: '', keywords: [] },
            L2: [],     // [{ fact, source_section, confidence }]
            L3: []      // [{ evidence, page, section_title }]
        },
        ...overrides
    };
}

module.exports = { createDocument };
