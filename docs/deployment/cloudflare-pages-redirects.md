# Cloudflare Pages 轉址操作指南：302 測試 → 301 永久轉址

> 對象：維護本 repo 的開發者（單人維運）
> 適用標的：`makeyourown.pages.dev`（策略探索家，靜態站）
> 最後實測：2026-10-02
> 相關陷阱記錄：[`docs/lessons/cloudflare-pages-redirects.md`](../lessons/cloudflare-pages-redirects.md)

---

## 何時用這份文件

需要把 Cloudflare Pages 站的流量導到別的網域時。兩種狀況：

| 狀況 | 該怎麼做 |
|---|---|
| **測試**轉址是否如預期 | 只做 302，驗證後移除 |
| **永久**轉址（站已確定搬走／合併） | 302 測試通過後改 301 |

**永遠先用 302 測過再上 301。** 理由不是「比較安全」這種抽象建議，而是本文件下半段有具體機制說明：301 一旦上線，你**沒有任何 Cloudflare 端的手段**把它收回。

---

## 前置條件

- [ ] 能 push 到本 repo（觸發 Cloudflare Pages 重新建置）
- [ ] 確認 Cloudflare Pages 專案的 **Output directory = repo 根目錄**
      （本 repo 無 build step，`_redirects` 必須放在根目錄才會被讀取）
- [ ] 確認目標網域**已經**部署完成並可存取（不要轉到還沒起來的站）
- [ ] 確認本專案**沒有綁定自訂網域**（見下方「`/*` 的作用域陷阱」）

---

## 第一步：302 還是 301

| |302 暫時 | 301 永久 |
|---|---|---|
| Google 是否把目標當作 canonical | **否**（不作為訊號） | **是** |
| 瀏覽器預設快取 | 不快取 | **可能永久快取**（見下文） |
| 隨時可撤回 | 是，刪掉即可 | **幾乎不可逆** |
| 適用 | 測試、暫時下線、服務中斷 | 站確定永久搬走 |

出處：[Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)（Google Search Central，更新於 2026-04-14）

> Google 官方說法：永久轉址的索引流程「uses the redirect as a signal that the redirect target should be **canonical**」；暫時轉址則「doesn't use the redirect as a signal」。並明言「Use permanent redirects **when you're sure that the redirect won't be reverted**」。

---

## 第二步：選機制（`_redirects` 還是其它的）

### 四種機制對照

| 機制 | 層級 | 對 `*.pages.dev` 可用 | 能限 host | 規則上限 | 撤回速度 |
|---|---|---|---|---|---|
| **Pages `_redirects`** | 專案建置產物 | ✅ | **❌** | 2000 靜態 + 100 動態 = 2100；每行 1000 字元 | 需重新部署（約 1 分鐘） |
| **Bulk Redirects** | Account | ✅ **官方專文教學** | ✅ | 帳號層級配額 | **秒級**（刪規則即可） |
| Single Redirects | Zone | ❌ 結構上不可能 | ✅ | 10/25/50/300（per zone） | 秒級 |
| Pages Functions | 程式碼 | ✅（獨立 Worker 不行） | ✅（讀 `hostname`） | 無條數上限 | 需重新部署 |

### 為什麼 Single Redirects 對 `*.pages.dev` 不可用

兩條文件前提都不成立：

1. 規則必須建在 **zone-level** 的 `http_request_dynamic_redirect` phase entry-point ruleset
2. 「Single Redirects require that the incoming traffic for the hostname referenced in visitors' requests is **proxied by Cloudflare**」

`makeyourown.pages.dev` 的 DNS 歸 Cloudflare 管，你沒有該 zone 的 proxy 控制權 → 這不是「文件沒寫」，是**能力上不存在**。

### 決策樹

```
需要「只轉 pages.dev、保留自訂網域」？
├─ 是 → Bulk Redirects（帳號層級，唯一能對 pages.dev 做 host 條件的機制）
└─ 否（本專案：無自訂網域，整站都要轉）
   └─ Pages _redirects  /* → https://target/:splat  301
      接受以下兩項限制：
        ① 未來若綁自訂網域，會一起被轉走
        ② 未來若加 Pages Functions，_redirects 對 Function 處理的請求失效
```

> **`_redirects` 與 Functions 互斥**：官方文件明載「Redirects defined in the `_redirects` file are **not applied** to requests served by Pages Functions」。兩者不要同時依賴。

### 方案選擇速查

| 需求 | 用哪個 |
|---|---|
| 整站搬到別的 Pages 專案，無自訂網域 | `_redirects` 的 `/*` |
| 只轉 `pages.dev`，保留綁定的自訂網域 | **Bulk Redirects** |
| 需要依 user-agent / 國家 / cookie 條件轉 | Bulk Redirects 無法；`pages.dev` 上只能靠 Pages Functions |
| 需要 regex 比對路徑 | Single Redirects（但 `pages.dev` 不可用）→ 只能 Pages Functions |
| 只是要擋掉 `pages.dev` 被收錄，不轉址 | `_headers` 加 `X-Robots-Tag: noindex` |

---

## 第三步：`/*` 的作用域陷阱（必讀）

`_redirects` 的 source **只能寫路徑，不能寫網域**。官方支援矩陣把domain-level redirect 標成 ❌。

後果：**這個 Pages 專案服務的所有 hostname 都會被一起轉走**，規則裡無法區分。目前本專案只有 `makeyourown.pages.dev`，所以安全。但若日後綁上自訂網域，`/*` 會把它一起轉到 `myo-makeyourown.pages.dev` —— 那時 `_redirects` 就救不了你，必須改用 Bulk Redirects。

（順帶一提一個容易誤以為能用的捷徑：`_headers` **是**支援 host 條件的，例如 `https://myproject.pages.dev/*`。`_headers` 支援而 `_redirects` 不支援，這個不對稱很容易記錯。）

---

## 部署步驟

### 建立規則

在 repo 根目錄建立 `_redirects`（無副檔名）：

```txt
/*  https://myo-makeyourown.pages.dev/:splat  302
```

三欄中間用空白或 tab 分隔。`/*` 與 `:splat` 配對 = 全站轉址並保留完整路徑。省略 code 時預設 302 —— **但請明寫**，不要依賴預設值。

### 部署

```bash
git add _redirects && git commit -m "..." && git push
```

### 等待生效並確認

Cloudflare Pages 建置通常在 20 秒內完成。用條件輪詢，不要用固定 sleep：

```bash
for i in $(seq 1 40); do
  curl -sSI --max-time 15 https://makeyourown.pages.dev/ \
    | grep -i -E '^(HTTP/|location)'
  sleep 10
done
```

---

## 驗證清單

四項全部通過才算完成：

```bash
# 1. 根路徑
curl -sSI https://makeyourown.pages.dev/ | grep -i -E '^(HTTP/|location)'
# 期望：302 + location: https://myo-makeyourown.pages.dev/

# 2. 深層路徑（驗證 :splat）
curl -sSI https://makeyourown.pages.dev/blog/best-wedding-gifts-hk.html | grep -i -E '^(HTTP/|location)'

# 3. Query string 保留
curl -sSI "https://makeyourown.pages.dev/trip.html?utm_source=x&a=1" | grep -i -E '^(HTTP/|location)'

# 4. 無轉址迴圈，最終能到 200
curl -sS -o /dev/null -w "redirects=%{num_redirects} final=%{url_effective} http=%{http_code}\n" \
  -L --max-time 25 https://makeyourown.pages.dev/blog/best-wedding-gifts-hk.html
# 期望：redirects=1  http=200
```

**關鍵參考手法**：`curl -I` 只發 HEAD。實測 Cloudflare Pages 對 HEAD 與 GET 的處理一致，但保險起見用 `curl -sS -o /dev/null -w '%{http_code}'`（預設 GET）做交叉確認。

### 本專案 2026-10-02 實測結果（302）

| 檢查 | 結果 |
|---|---|
| `/` | `302` → `https://myo-makeyourown.pages.dev/` |
| `/blog/best-wedding-gifts-hk.html` | `302` → `myo-makeyourown.pages.dev/blog/best-wedding-gifts-hk.html` |
| `/trip.html?utm_source=x&a=1` | `302` → query string 完整保留 |
| 跟隨轉址 | `redirects=1`，最終 `200`，無迴圈 |

---

## 第四步：改 301 之前，先知道發生了什麼

這是本文件最重要的一段。以下每條都經過實測或查證。

### ① 你無法控制 301 的快取行為（實測 + 文件）

Cloudflare Pages 實測回的 302 完整標頭：

```
HTTP/2 302
content-type: text/plain;charset=UTF-8
location: https://myo-makeyourown.pages.dev/
access-control-allow-origin: *
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
server: cloudflare
```

注意**沒有** `Cache-Control`、**沒有** `Expires`、**沒有** `Age`、**沒有** `CF-Cache-Status`。

推論（三段都有依據）：

1. **Cloudflare edge 不快取這個轉址** —— 沒有 `Age`、沒有 `CF-Cache-Status`。
2. **你也不能自己加上** —— 官方 `_headers` 文件明載「redirects are applied before headers, so when a request matches both a redirect and a header, **the redirect takes priority**」。也就是說 `_headers` 對轉址回應**無效**。
3. **於是瀏覽器只能走自己的預設** —— 而瀏覽器對「沒有任何快取指示的 301」的預設是**視為永久、盡量長期快取**。

> 這一段的 ①② 是文件＋實測確認的。③ 屬於**瀏覽器實作行為，不是 HTTP 規格要求** —— RFC 9110 沒有規定 301 要快取多久，Chrome/Firefox 是在沒有明確指示時採用「永久」推定。來源為社群實測彙整（Stack Overflow 9130422），非第一手規格。**若要 100% 確定瀏覽器端行為，請自行用 DevTools 觀察 Network 面板，不要只依賴本文件。**

### ② 301 對 POST 會改寫成 GET（規格確認）

MDN / Fetch Standard：收到 301 回應的 **POST** 請求，後續請求會被改成 **GET**。

> 「when a user agent receives a `301` in response to a `POST` request, it uses the `GET` method in the subsequent redirection request... To avoid user agents modifying the request, use `308 Permanent Redirect` instead」

本專案是純靜態展示站，沒有表單提交到舊網域，所以現況無影響。但**若日後舊站有 POST 表單，301 會靜默把它變成 GET**，造成資料遺失。要保留 method 就用 `308`。

### ③ Google 會保留舊網域作為 alternate name（官方明載，這是正常的）

> 「it's very likely that Google will continue to occasionally show the old URLs in the results, even though the new URLs are already indexed. **This is normal** and as users get used to the new domain name, the alternate names will fade away without you doing anything.」

**看到舊網域還出現在搜尋結果，不需要處理。** 這是預期行為，不是錯誤。

### ④ 沒有找到關於「轉到主題不相關站台」的官方指引

本專案要把「策略探索家」（個人品牌／部落格）整站轉到「MyO 結婚證書套」（電商產品站），兩者主題無關。

我查了 Google Search Central 的 redirects 文件，**找不到**官方對「整站轉址到主題不相關內容」的明確建議或處罰條款。文件只把「merging two websites」列為合法用途。

因此這件事**沒有可引用的官方結論**。實務上要清楚的是：301 會把舊站累積的權重傳給新網域，而兩者主題不同，這是**相關性不匹配**，不是文件所列的處罰。與其猜測 Google 會怎麼處理，不如把轉址當成「讓舊網址別再 404」的工具，而不是權重轉移手段 —— 別期待權重會有實質好處。

### ⑤ 本 repo 的既有問題（301 後會更明顯）

301 前盤點到的既存缺陷（與轉址無關，但會影響決策）：

| 網域 | 出現次數 | 現況 | 301 後 |
|---|---|---|---|
| `makeyourown.pages.dev` | 4（`index.html` L10 canonical、L15 og:url；`chronicle.html` 同樣兩處） | 正常 | 這些 HTML 永遠不會被渲染，canonical 不會被讀到 |
| `makeyourown-tv.pages.dev` | 5，全在 `tv.html` | **DNS 不存在**，且被 `<iframe src>` 引用 | 連同整站一起消失 |
| `www.strategy-explorer.com` | **18**（站內內部連結） | **已失效**（連線逾時） | 連同整站一起消失 |

判斷關鍵：

- 如果你要**整站轉走** → 這些死連結跟著消失，不痛。canonical 指向舊網域也不影響，因為 HTML 永遠不會被渲染。
- 如果你只是要**保留站台、修正 SEO 訊號** → 這 18 個死內鏈就是真問題，`tv.html` 的壞 iframe 也是。這時**不要**做 301。

> ⚠️ `makeyourown-tv.pages.dev` 是另一個 Pages 專案，且已被刪除或從未上線。`tv.html` 上的 `<iframe src="https://makeyourown-tv.pages.dev/">` 是線上可見的壞元素。

---

## 撤回（回滾）

### 302 階段

```bash
git rm _redirects && git commit -m "chore: remove test redirect" && git push
```

302 不會被瀏覽器長期快取，所以**撤回是乾淨的**。等 1 分鐘建置後確認：

```bash
curl -sS -o /dev/null -w "http=%{http_code}\n" https://makeyourown.pages.dev/
# 期望：200
```

### 301 階段 —— 請先理解這段

| 環境 | 能否救回 |
|---|---|
| Cloudflare 端 | ✅ 秒級（刪掉規則／redeploy） |
| Cloudflare edge | ✅（本來就沒 cache 轉址） |
| **你的瀏覽器** | ❌ **已經記住 301 了** |
| **其他訪客的瀏覽器** | ❌ **你不知道有多少人記住了** |

**沒有任何 Cloudflare 端操作能修正已經被瀏覽器快取的 301。** 這是採用 `_redirects` 做永久轉址的主要風險。

瀏覽器端可行的緩解（不保證成功）：

- Chrome：`chrome://settings/clearBrowserData` → 勾「cached images and files」（實測報告指出只勾「cached images and files」即可清除轉址紀錄）
- Firefox：`about:cache` → 手動刪除
- 無痕視窗 → 一定是新的

**如果「撤回」對你來說是必須保證的能力，就不要用 `_redirects` 做 301，改用 Bulk Redirects**（帳號層級，刪規則即時生效，可先存成 Draft 觀察）。

### 建議的提昇安全性做法

1. 302 上線，驗證
2. 302 至少跑幾天，確認沒有404 或錯誤轉址
3. 檢查目標站所有對應頁面都存在（見下方驗收）
4. 改 301
5. **301 上去後短期內不要再改** —— 每次改動都會再產生一批新的瀏覽器快取

---

## 301 前的驗收清單

- [ ] 目標站**所有**重要路徑都有對應頁面（301 會把路徑原封不動帶過去，含 `:splat`）
- [ ] 已用 302 完整走過一遍，無 404
- [ ] 已確認本專案沒有自訂網域（否則改用 Bulk Redirects）
- [ ] 已理解「撤回不了已快取的 301」
- [ ] 已決定狀態碼用 301 還是 308（有 POST 表單 → 必須 308）
- [ ] 目標站已接受「舊站的 canonical 訊號會消失」這個事實

### 目標站路徑對照的實務提醒

`/* → https://myo-makeyourown.pages.dev/:splat` 會把**每一個**路徑原封不動轉過去，包含目標站不存在的路徑。

2026-10-02 實測：舊站的 `/blog/best-wedding-gifts-hk.html` 轉到 `myo-makeyourown.pages.dev/blog/best-wedding-gifts-hk.html`，最終回 `200`。但這只代表**該路徑恰好存在**。整站轉址前應實際比對兩邊的路徑集合：

```bash
# 舊站有幾個 html（不含 .pages.dev/外部資源）
find . -name "*.html" -not -path "./node_modules/*" | sed 's|^\./||' | sort
```

清單拿來跟目標站對照，缺的路徑要嘛在目標站補頁，要嘛在 `_redirects` 逐條指定映射（而不是用 `/*`）。

---

## 陷阱總表

| 陷阱 | 後果 | 怎麼避 |
|---|---|---|
| source 寫網域 | **整行靜默忽略**，部署成功但沒轉址 | source 只寫路徑 |
| 想用 `_headers` 加轉址的快取標頭 | 無效，redirect 優先於 headers | 無法解決，只能靠「先302 測試」降低風險 |
| 301 後想撤回 | 瀏覽器端救不回 | 需保證可撤回 → 用 Bulk Redirects |
| 期望 canonical 修正指向問題 | 整站轉址時 canonical 永遠不會被讀到 | 不轉整站就必須修正 canonical |
| 同時用 Functions 與 `_redirects` | `_redirects` 對 Function 請求失效 | 擇一，或用 `_routes.json` 排除 |
| `/*` 綁定自訂網域後一起被轉 | 自訂網域也被導走 | 需要區分 → 改用 Bulk Redirects |
| 301 對 POST 改寫成 GET | 表單資料遺失 | 有表單就用 308 |
| 看到舊網域還在搜尋結果 | — | **這是正常的，Google 官方明載** |
| 超過 100 條動態轉址 | 超出部分不生效 | 改用 Bulk Redirects |

---

## 已知不確定項目

誠實標記，以下我**沒有**找到權威確認：

1. **Bulk Redirects 能否自訂轉址回應的 `Cache-Control`** —— 若能，就能解決 ③ 的快取問題，是 301 永久轉址的最佳解；但我未確認。若要採用 Bulk Redirects，這點要先在 Cloudflare Dashboard 實測。
2. **301 被瀏覽器快取的實際期限** —— 屬瀏覽器實作行為，RFC 9110 未規定。Chrome 與 Firefox 已知為「長期/永久」，但具體天數無規格依據。請用 DevTools 自行觀察。
3. **Cloudflare Bulk Redirects 的轉址回應是否有 edge 快取** —— 未確認。本文件對 `_redirects` 的「edge 不快取」結論來自實測（有 `Age`／`CF-Cache-Status` 欄位但無值），不能直接套用到 Bulk Redirects。

---

## 參考資料

**Cloudflare**
- [Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/) — 格式、上限、不支援型別
- [Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/) — redirects 優先於 headers
- [Redirecting `*.pages.dev` to a Custom Domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/) — Bulk Redirects 官方教學
- [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/) — zone-level 需求
- [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) — account-level
- [Pages Functions](https://developers.cloudflare.com/pages/functions/) — 與 `_redirects` 的互斥關係

**搜尋引擎 / HTTP**
- [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects) — 301/302 的索引語意、alternate name 行為
- [MDN 301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301) — POST→GET 改寫、308 的差異
- [RFC 9110 §15.4.2](https://www.rfc-editor.org/rfc/rfc9110.html#status.301) — 規格（未規定快取期限）

**本專案**
- [`docs/lessons/cloudflare-pages-redirects.md`](../lessons/cloudflare-pages-redirects.md) — domain-level redirect 被靜默忽略的踩坑記錄