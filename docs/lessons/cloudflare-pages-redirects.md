# 教訓：Cloudflare Pages `_redirects` 不支援 domain-level redirect

> **日期**：2026-10-02
> **關聯 PR**：—
> **狀態**：已解決
> **延伸文件**：[`docs/deployment/cloudflare-pages-redirects.md`](../deployment/cloudflare-pages-redirects.md) — 302/301 完整操作指南

---

### 問題

在 Cloudflare Pages 專案根目錄建立 `_redirects`，想將舊網域整站轉址到新網域：

```txt
https://makeyourown.pages.dev/*  https://myo-makeyourown.pages.dev/:splat  302
```

部署成功（`git push` → 建置成功 → live `index.html` hash 與 `HEAD` 一致），
但 `https://makeyourown.pages.dev/` 仍回 `HTTP 200`，**沒有任何 302**。
沒有錯誤訊息、沒有建置警告、沒有 Cloudflare log 記錄。

### 教訓

Cloudflare Pages **不支援 domain-level redirect**，官方文件在
「Advanced redirects」表格中明確標示 `❌`：

| Feature | Support | Example |
|---|---|---|
| Domain-level redirects | ❌ | `workers.example.com/* workers.example.com/blog/:splat 301` |

**只要 source 含有 host（網域），整行規則就被「靜默忽略」** —— 不報錯、不警告、不寫 log。
這是最難debug 的失敗型態：所有週邊訊號（部署成功、檔案存在、hash 一致）都顯示成功，
唯一失敗的訊號就是「轉址沒發生」，很容易誤判成部署未生效而反覆重新部署。

補充陷阱：`_redirects` 檔案本身**不會**被當作靜態檔案服務，所以
`GET /_redirects` 的回應**無法**用來判斷規則是否被解析（此專案因 SPA fallback
一律回 `index.html` 200；另一個獨立 Pages 專案也同樣回 200，兩者行為一致，
可確認這是 Pages 平台層行為，與本專案的規則無關）。

### 解法

本專案本身就是 `makeyourown.pages.dev` 的 Pages 專案，
所以 source 裡的網域**本來就是多餘的**。改成純路徑即可：

```txt
/*  https://myo-makeyourown.pages.dev/:splat  302
```

`destination` 允許外部完整 URL + `:splat`（對應官方支援範例 `/blog/* https://blog.my.domain/:splat`），
所以跨網域轉址靠的是「source 只管本專案、destination 指向外部」，
**不是**靠 source 寫網域。

### 預防

- 寫 `_redirects` 時，source **永遠只寫路徑**（`/...`），不要寫 `https://host/...`。
- 需要「依網域條件轉址」（例如只轉 `pages.dev`、保留自訂網域不轉），
  `_redirects` 做不到，只能改用 **Bulk Redirects**（帳號層級）。
  注意：**Single Redirects 在 `*.pages.dev` 上不可用** —— 它要求規則建在
  zone-level ruleset 且該 hostname 的流量必須由你 proxy，
  而 `pages.dev` 的 DNS 歸 Cloudflare 管，你沒有該 zone 的控制權。
- 除錯順序：先確認 live 內容 hash == `HEAD`（排除部署未生效），
  再回頭查規則語法是否落在官方「不支援」清單內。

---

### 後續（2026-10-02）

修正後的 `/*  https://myo-makeyourown.pages.dev/:splat  302` 已部署並實測通過
（根路徑、深層路徑、query string 保留、單次轉址無迴圈），隨後依需求移除 `_redirects`。

順帶實測出一件文件查不到、但對「要不要上 301」具有決定性的事實：
**Cloudflare Pages 的轉址回應不帶任何快取標頭**（實測無 `Cache-Control`、
`Expires`、`Age`、`CF-Cache-Status`），而 `_headers` 對轉址無效（redirects 優先於 headers），
代表**你無法從 Cloudflare 端控制 301 被瀏覽器快取多久**。
完整驗證記錄與 301 的風險評估見
[`docs/deployment/cloudflare-pages-redirects.md`](../deployment/cloudflare-pages-redirects.md)。