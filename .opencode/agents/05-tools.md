# 05 — 外部工具整合

## Notion MCP

### API 限制

| 層級 | 限制 | 說明 |
|------|------|------|
| Per Connection | 3 req/s | 每個 token 獨立計數，允許短暫突發 |
| Per Workspace | 隨方案擴展 | 2026/06 新增，官方未公開具體數字 |
| MCP 專用 | 180 req/min | notion-search 更嚴：30 req/min |

**錯誤碼**：`429` rate_limited / `529` service_overload → 讀 Retry-After header 指數退避重試

### 已知坑

#### 1. Table Block 格式極其嚴格
cells 需為二維陣列 `[[cell], [cell]]`，每個 cell 需同時有 `rich_text` **且** `text`/`mention`/`equation` 三選一。驗證失敗時訊息模糊。

**解法**：用列表 + callout 替代表格，API 穩定且效果相同。

#### 2. Database Query 需 POST
```bash
# ❌ 會 400
GET /v1/databases/{id}/query?page_size=20

# ✅ 正確
POST /v1/databases/{id}/query
Content-Type: application/json
Body: {}
```

#### 3. Database 創建後有延遲
剛建完立刻 query 會 404，等 2-3 秒後再查。

#### 4. Parent 層級決定權限
- workspace 層建的 database → integration 存取不到
- 在主頁面當 child_database 建的 → integration 可存取
- **關鍵規則**：parent 用 `page_id`（integration 能讀到的 page），不用 `workspace`

#### 5. Code Block Language 白名單
Notion 有嚴格語言白名單。`text`/`bash` 有時不行。
**解法**：不設 language，讓 Notion 自動判斷。

#### 6. MCP 工具 vs curl 行為差異
同樣的 database ID：
- MCP `notion_API-query-data-source` → 404
- curl POST → 正常返回結果
推測 MCP 用舊版 endpoint 或有緩存。

### 可用模式

| 操作 | 推薦方式 | 備註 |
|------|---------|------|
| 搜尋 pages/databases | MCP 工具 ✅ | 穩定 |
| 讀 block children | MCP 工具 ✅ | 需 clean null icon |
| Query database | curl + POST `{}` | MCP 不可靠 |
| 建 database | curl POST /databases | parent 用 page_id |
| 建 database entry | curl POST /pages | parent 用 database_id |
| 寫 block children | MCP 或 curl | curl 需手動 clean null |

### Token 取得方式

```bash
# From environment
echo $NOTION_TOKEN
```

### 常用 API 端點

```
GET  /v1/pages/{id}              # 讀頁面
GET  /v1/blocks/{id}/children    # 讀區塊
PATCH /v1/blocks/{id}/children   # 寫入區塊
POST /v1/pages                   # 建新頁面
POST /v1/databases/{id}/query    # 查 database（POST + `{}`）
POST /v1/databases               # 建新 database
PATCH /v1/pages/{id}             # 更新頁面屬性
```
