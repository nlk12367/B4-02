# Zeabur 部署設定指南

為了讓這個專案能夠順利在 Zeabur (https://zeabur.com) 上順利運行，這裡整理了幾項關鍵的參數設置與程式層面的注意事項。

## 1. 網路埠口 (Port) 設定
Zeabur 在啟動服務時，會動態分配一個對外的 Port（通常會帶入 `PORT` 環境變數）。
如果您檢視目前的 `server.js`，會發現裡面寫死了 `const PORT = 3001;`。請務必將這行修改為以下寫法，否則 Zeabur 會因為連不到指定的 Port 而判斷服務啟動失敗（Health check failed）：

```javascript
// 修改 server.js :
const PORT = process.env.PORT || 3001;
```

## 2. API Key 設定方式 (環境變數與設定檔)
目前系統的邏輯是依賴讀取專案根目錄下的 `api_key.txt` 檔案。
上傳到 Zeabur（或任何雲端環境）時，我們通常**不會**把包含私密金鑰的 `api_key.txt` 提交到 Git 版本控制中。因此在 Zeabur 上您有兩種方式來配置您的 `GEMINI_API_KEY`：

### 方法 A：使用 Zeabur 的「環境變數 (Variables)」功能 (最推薦、最簡單)
由於我們的 `server.js` 已經寫好了支援環境變數的邏輯，這是最直接且不會有路徑掛載錯誤的做法：
1. 在 Zeabur 控制面板切換到 **「Variables (環境變數)」** 頁籤。
2. 點擊頁面上的 **「Add Variable (新增變數)」** (如果你是用圖形化介面，或者是輸入 KEY 跟 VALUE)。
3. 在欄位中輸入您的金鑰：
   - 變數名稱 (Variable) 填寫：`GEMINI_API_KEY`
   - 值 (Value) 填寫您的實際金鑰 (例如：`AIzaSy...`)
4. 儲存後重新部署或重啟服務，系統即會自動採用，完全不需要理會 api_key.txt。

### 方法 B：使用 Zeabur 的「設定檔 (Config Files)」功能 (易有路徑問題)
如果您想使用檔案掛載（注意：路徑對應可能會因雲端自動建置環境有異，若失敗請改用方法 A）：
在 Zeabur 的專案**服務控制面板 (Service Dashboard)** 中：
1. 切換到 **「Settings (設定)」** 頁籤。
2. 找到 **「Configs (設定檔)」** 區塊，點擊 **「Open Config Editor (開啟設定檔編輯器)」**。
3. 點擊 **「Add Config file (新增設定檔)」**。
4. **File Path** (檔案路徑) 填寫為 `/app/api_key.txt` (Zeabur 預設將 Node.js 專案放在 `/app` 目錄下)。
5. 檔案內容直接貼上您現在本地測試時的內容：
   ```text
   GEMINI_API_KEY="您的_API_KEY"
   ```
6. 點擊 **Save Config (儲存設定)** 然後重啟容器。

## 3. Package.json 的啟動指令
Zeabur 會自動偵測 Node.js 專案並讀取 `package.json` 中的腳本。
目前的 `package.json` 中已經有：
```json
"scripts": {
  "start": "node server.js"
}
```
這是完全標準且正確的配置，Zeabur 會自動執行 `npm install` 與 `npm start`，所以這部分您不需特別更動，直接保留即可。

## 4. 系統 Prompt (prompt.md)
系統有獨立讀取 `prompt.md` 的設計，記得在做 Git commit 時，要把 `prompt.md` 包含進去一起推送到遠端倉庫。少了這個檔案的話，雲端伺服器在「結束對話」總結的時候會發生 `404` 錯誤。

---

### 總結：您上架前需要做的動作
1. ✅ 把 `server.js` 的 Port 監聽改為 `process.env.PORT || 3001`
2. ✅ 把程式推送到 GitHub，並到 Zeabur 連動該 Repo。
3. ✅ 在 Zeabur 後台，利用 **Variables** 填寫 `GEMINI_API_KEY` 環境變數。
4. ✅ 點擊重新部署，大功告成！
