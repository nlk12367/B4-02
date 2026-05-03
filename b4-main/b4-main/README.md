# Mobile-First AI Chat Assistant

這是一個以行動裝置為優先 (Mobile-first) 且具備 Apple-style 質感的 AI 聊天助手應用程式。前端以原生的 HTML/CSS/JS 撰寫，後端搭配極簡的 Node.js Express 伺服器，負責安全地讀取本地設定與 Prompt，能輕鬆在本地或如 Zeabur 等雲端環境部署。

## 🌟 核心功能特色

- **Apple-Style 介面**：採用現代感、高質感的 UI 設計與流暢的微動畫，支援響應式排版，完美適配手機與桌面瀏覽器。
- **本地端 API Key 解析**：透過 Node 伺服端讀取根目錄的 `api_key.txt`（現在主要支援 `GEMINI_API_KEY`，使用 Gemini 3.1 Flash 模型），確保 Key 不會在前端外洩。雲端部署時亦無縫支援讀取環境變數。
- **獨立的 Prompt 管理機制**：將 AI 總結或系統級的分析提示設定獨立抽離為 `docs/prompt.md`，方便團隊維護與即時編輯修改，伺服器會於執行時動態拉取內容。
- **智慧對話總結 (End Chat)**：系統會即時在前端記憶體快取追蹤完整對話長度紀錄 (`chatHistory`)。當用戶點擊頂部導覽列「結束對話」時，會將 `prompt.md` 以及現有的連貫性歷史紀錄一併打包發給 AI 進行行為總結與分析。
- **豐富的附件支援**：提供夾帶附件的預覽功能，涵蓋圖片支援 (Base64) 及純文字文件 (`.txt`, `.md`, `.csv`, `.json`) 預覽機制。
- **高質感系統設定彈窗 (Settings Modal)**：可點擊右上角 `...` 圖示開啟，設定項目可即時對應後台所載入的模型版本。

## 🚀 系統架構

```text
├── README.md               # 專案說明與功能總結
├── server.js               # Node.js Express 後端伺服器 
├── package.json            # NPM 設定檔 (含 start script)
├── api_key.txt             # 本地 API Key 配置檔 (勿 commit 放上公開版控)
├── docs/                   # 相關 Markdown 文件 (Prompt、部署教學等)
│   ├── prompt.md
│   └── zeabur_deployment_guide.md
└── public/                 # 前端網頁靜態資源
    ├── index.html
    ├── style.css
    └── app.js
```

## 💻 快速開始 (Local Development)

1. 確認已安裝 Node.js (v14+ 以上)。
2. 在專案根目錄下，於 `api_key.txt` 中填入你的設定，例如：
   ```text
   GEMINI_API_KEY="AIzaSy你的金鑰..."
   ```
3. 在終端機執行 `npm install`。
4. 執行 `node server.js`。
5. 打開瀏覽器前往 `http://localhost:3001` 開始對話！

## ☁️ 雲端部署 (Zeabur 等)

本專案支援無痛部署：
- 伺服器已自動適應 `process.env.PORT`。
- 本地 `api_key.txt` 可以使用平台的 File Variables 設定檔替代，或是配置成系統環境變數即可支援。
- 詳細說明可參考 👉 [`docs/zeabur_deployment_guide.md`](docs/zeabur_deployment_guide.md)