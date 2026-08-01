# 自訂網域設定：blog.chinghsinchen.com

把這個 GitHub Pages 站台綁到 `blog.chinghsinchen.com`（Cloudflare 管理 DNS）。

- **網域**：`chinghsinchen.com`（DNS 由 Cloudflare 託管）
- **目標 hostname**：`blog.chinghsinchen.com`
- **GitHub repo**：`CHINGHSIN1991/elements-of-chinghsinc`
- **GitHub 帳號**：`CHINGHSIN1991` → Pages 主機名為 `chinghsin1991.github.io`
- **Pages 部署方式**：GitHub Actions（`.github/workflows/deploy.yml`，使用 `withastro/action@v3`）

---

## 一、程式碼端：已完成的修改

以下改動已經套用並通過 build 驗證，**不需要再動**。

| 檔案 | 改動 |
|---|---|
| `astro.config.mjs` | 移除 `base`；`LIVE_URL` 改為 `https://blog.chinghsinchen.com` |
| `public/CNAME` | 新檔，內容為 `blog.chinghsinchen.com` |
| `src/data/siteData.json` | `site` 改為 `https://blog.chinghsinchen.com` |
| `src/pages/blog/[post].astro` | `post.render()` → `render(post)`（Astro 6 API，原本會讓 build 失敗） |
| `src/pages/404.astro` | `/projects` → `/project`（路由不存在） |

### 為什麼移除了 `base`

原本設定是 `base: '/elements-of-chinghsinc/'`，因為站台服務在 GitHub **project page** 的子路徑下。這會導致所有 root-relative 連結（`/blog/...`、`/rss.xml`）在正式站 404，除非每一處都手動加上 base 前綴。

改用自訂子網域後站台服務在**該子網域的根目錄**，`base` 不再需要，所有連結天生正確。

> ⚠️ 如果哪天決定把站台改放到某個路徑底下（例如 `chinghsinchen.com/blog`），`base` 就必須加回來，並且所有連結都得處理前綴。子網域方案就是為了避免這件事。

### `public/CNAME` 為什麼必須存在

Pages 的部署來源是 **GitHub Actions**（不是分支）。這種模式下 GitHub 不會自動在 repo 裡建立 CNAME 檔，所以必須自己放在 `public/`，build 時會被複製到 `dist/CNAME` 並打包進部署產物。

`public/CNAME` 的內容必須和 GitHub Settings → Pages 的 Custom domain 欄位**完全一致**。

### 已驗證項目

```
dist/CNAME  -> blog.chinghsinchen.com
canonical   -> https://blog.chinghsinchen.com/
sitemap 1st -> https://blog.chinghsinchen.com/
robots      -> Sitemap: https://blog.chinghsinchen.com/sitemap.xml
產出頁數     -> 93 頁
殘留舊 hostname -> 無
```

---

## 二、設定步驟

### 步驟 1：Cloudflare 加 DNS 記錄

Cloudflare Dashboard → 選 `chinghsinchen.com` → 左側 **DNS** → **Records** → **Add record**

| 欄位 | 填什麼 |
|---|---|
| Type | `CNAME` |
| Name | `blog` |
| Target | `chinghsin1991.github.io` |
| Proxy status | **DNS only**（灰雲，把橘雲點掉） |
| TTL | Auto |

按 **Save**。

**Target 常見錯誤**（以下都會失敗）：

| | 值 |
|---|---|
| ❌ | `https://chinghsin1991.github.io` — 不要加協定 |
| ❌ | `chinghsin1991.github.io/elements-of-chinghsinc` — 不要加路徑 |
| ❌ | `chinghsinchen.com` — 要指向 GitHub，不是指向自己 |
| ✅ | `chinghsin1991.github.io` |

**Name 只填 `blog`**，不要填完整的 `blog.chinghsinchen.com`。Cloudflare 會自動接上網域，填全名會變成 `blog.chinghsinchen.com.chinghsinchen.com`。

**Proxy 一定要先關成灰雲。** GitHub 需要簽 Let's Encrypt 憑證，走 HTTP-01 驗證；橘雲開著會攔掉驗證請求，導致憑證永遠簽不出來，Enforce HTTPS 也就永遠勾不了。

> 這句話的完整原因見文末〈附錄：為什麼 proxy 要先關成灰雲〉。

---

### 步驟 2：確認 DNS 生效

等 1–5 分鐘，然後在 PowerShell 執行：

```powershell
Resolve-DnsName blog.chinghsinchen.com -Type CNAME
```

看到 `NameHost : chinghsin1991.github.io` 就正確。或用：

```powershell
nslookup blog.chinghsinchen.com
```

**這一步沒過不要往下做。**

---

### 步驟 3：Push 程式碼

```powershell
git add astro.config.mjs public/CNAME src/data/siteData.json src/pages/blog/'[post]'.astro src/pages/404.astro package-lock.json
git commit -m "feat: serve site at blog.chinghsinchen.com"
git push
```

`package-lock.json` 有變動是因為補裝了 `three`（原本宣告在 `package.json` 但沒安裝，會讓 client build 失敗）。

`src/content/posts/` 和 `src/content/projects/` 還沒進版控，要不要一起 commit 自己決定 —— 裡面還有 `test.md`、`test.json`、`title-description.json` 等 placeholder，`draft: false` 會被發佈到正式站。

Push 後 GitHub Actions 會自動 build 並部署。

---

### 步驟 4：GitHub 設定 Custom domain

Repo → **Settings** → 左側 **Pages**：

1. **Custom domain** 填入 `blog.chinghsinchen.com` → **Save**
2. GitHub 會執行一次 DNS check，成功會顯示綠色勾勾

---

### 步驟 5：等憑證，開啟 HTTPS

設好 Custom domain 後 GitHub 開始簽憑證，畫面會顯示 *"Certificate is being provisioned"*。

- 通常幾分鐘，偶爾超過一小時
- 簽好之後 **Enforce HTTPS** 的 checkbox 會從灰色變成可勾 → **勾起來**
- 勾不起來 = 憑證還沒好，或 proxy 沒關成灰雲

完成後 `https://blog.chinghsinchen.com` 即可訪問。

---

### 步驟 6（選用）：Cloudflare proxy

憑證簽好、Enforce HTTPS 勾好**之後**才可以考慮把 proxy 開成橘雲。

如果要開，**務必**先到 **SSL/TLS → Overview** 把加密模式設為 **Full** 或 **Full (strict)**。設成 **Flexible** 會和 GitHub Pages 的強制 HTTPS 衝突，造成無限轉址（`ERR_TOO_MANY_REDIRECTS`）。

**建議維持灰雲。** GitHub Pages 本身已有 CDN，開 proxy 效益不大，反而多一層可能出錯的環節。

> 為什麼順序不能顛倒、以及 Flexible 為什麼會造成轉址迴圈，見文末〈附錄：為什麼 proxy 要先關成灰雲〉。

---

## 三、補充說明

### apex（`chinghsinchen.com`）目前是空的

**不要**去加 GitHub Pages 的那四筆 apex A 記錄（`185.199.108-111.153`）。如果 apex 指向 GitHub Pages 但沒有任何 repo 認領該 hostname，訪客會看到 GitHub 的 404 頁面。等真的有東西要放 apex 再設定。

### 舊網址會轉址

`public/CNAME` 部署後，`chinghsin1991.github.io/elements-of-chinghsinc` 會 301 轉址到 `blog.chinghsinchen.com`。這對 SEO 是好事（權重會轉移），但如果舊連結貼在別處，值得留意。

### SSL 涵蓋範圍

Cloudflare Universal SSL（免費）涵蓋 apex 和**一層**子網域，`blog.` 在範圍內。以後加 `api.`、`lab.` 也都免費。只有 `a.b.chinghsinchen.com` 這種兩層子網域才需要付費的 Advanced Certificate Manager。

### 以後要加別的子網域

重複步驟 1 + 4 即可：Cloudflare 加一筆 CNAME 指向對應服務，這個 repo **完全不用動**。

```
blog.chinghsinchen.com  → 這個 Astro 站（GitHub Pages）
api.chinghsinchen.com   → Cloudflare Worker / VPS
lab.chinghsinchen.com   → Vercel / Netlify / 其他
chinghsinchen.com       → 尚未使用
```

GitHub Pages 的限制是「一個 hostname 只能被一個 repo 認領」，這是 hostname 層級的限制，所以另一個 repo 綁 `另一個子網域.chinghsinchen.com` 完全合法。

---

## 四、問題排查

| 症狀 | 可能原因 |
|---|---|
| Enforce HTTPS 勾不起來（一直灰色） | Cloudflare proxy 是橘雲，攔掉了 HTTP-01 驗證 → 改成 DNS only，等 GitHub 重簽 |
| `ERR_TOO_MANY_REDIRECTS` | Cloudflare SSL/TLS 模式是 Flexible → 改成 Full 或 Full (strict) |
| GitHub 顯示 "Domain does not resolve to the GitHub Pages server" | DNS 還沒生效，或 CNAME target 填錯（見步驟 1 的錯誤清單） |
| 站台顯示 GitHub 404 | Custom domain 和 `public/CNAME` 內容不一致；或 Actions 部署還沒跑完 |
| 連結全部 404 | `base` 被誤加回 `astro.config.mjs` |
| Cloudflare 顯示 CNAME 記錄有 orange cloud 警告 | 正常，代表建議開 proxy；這個情境下維持灰雲是刻意的 |
| build 失敗 `post.render is not a function` | `render(post)` 的修改被還原了（Astro 6 已移除 entry 上的 `render` 方法） |
| build 失敗 `Rollup failed to resolve import "three"` | 忘記跑 `npm install`（node_modules 落後於 package.json） |

---

## 五、尚未處理的既有問題

這些和網域設定無關，但 code review 有抓到，供參考：

- `src/content/posts/test.md`、`src/content/projects/test.json`、`title-description.json` 是 placeholder，`draft: false` 會被發佈（連帶產生 `aaa`/`bbb`/`nnn` 假分類）
- `test.md` 引用的 `/images/blog-placeholder.jpg` 和內文的 `/images/example.jpg` 都不存在（`public/` 只有 `favicon.svg`）
- `src/pages/_templates/PaginatedList.astro` 直接把 `allItems` 丟給 `paginate()`，順序是檔名字母序而非日期新到舊
- `src/pages/blog/[post].astro` 的 `datetime={post.data.date}` 輸出 Date 的 `toString()`，不是合法 HTML datetime 格式
- `package.json` 把 `@astrojs/check` 和 `typescript` 放在 `dependencies` 而非 `devDependencies`，且沒有 `check` script
- `npx astro check` 目前有 46 個既有型別錯誤，主要集中在 `ProjectInfo` 的 props 型別

---

## 附錄：為什麼 proxy 要先關成灰雲

步驟 1 和步驟 6 反覆強調 proxy 的狀態，這裡說明背後的原因。這段涉及三個概念：Cloudflare proxy 做了什麼、憑證怎麼簽出來、兩者為什麼會衝突。

### A. 橘雲和灰雲的差別

差別在於**流量有沒有經過 Cloudflare**。

**灰雲（DNS only）** — Cloudflare 只是電話簿：

```
訪客 ──查詢 blog.chinghsinchen.com──> Cloudflare
                                      「GitHub 的 IP 是 185.199.x.x」
訪客 ─────────直接連線────────────> GitHub
```

Cloudflare 回答完就退場，完全不碰流量。

**橘雲（Proxied）** — Cloudflare 站在中間：

```
訪客 ──查詢 blog.chinghsinchen.com──> Cloudflare
                                      「IP 是我自己」← 故意不給 GitHub 的 IP
訪客 ────> Cloudflare ────> GitHub
            （代理）
```

所有請求都先到 Cloudflare，再由 Cloudflare 去 GitHub 取內容。快取、防 DDoS 這些功能都建立在這個代理上。

### B. 憑證是怎麼簽出來的

HTTPS 需要憑證來證明「我真的是 `blog.chinghsinchen.com`」。憑證必須由 CA 簽發，GitHub Pages 用的是免費的 Let's Encrypt，而且會**自動**幫你申請。

但 CA 不能隨便給人簽憑證 —— 得先確認申請人真的控制那個網域。這個確認過程叫 **HTTP-01 驗證**：

1. Let's Encrypt 出一道題：「請在 `http://blog.chinghsinchen.com/.well-known/acme-challenge/xK9m2...` 放一個內容為 `abc123...` 的檔案」
2. GitHub 把答案放到那個路徑
3. Let's Encrypt **自己發一個 HTTP 請求去讀那個網址**，比對內容
4. 內容正確 → 確認你控制此網域 → 簽發憑證

關鍵在第 3 步。注意它用 **HTTP 而非 HTTPS** —— 此時還沒有憑證，是雞生蛋蛋生雞的問題。

### C. 衝突點

把 A 和 B 疊起來就清楚了。

**灰雲時**，Let's Encrypt 直接連到 GitHub，讀到 GitHub 放好的答案：

```
Let's Encrypt ──> GitHub（答案在這）✅
```

**橘雲時**，Let's Encrypt 連到的是 Cloudflare，不是 GitHub：

```
Let's Encrypt ──> Cloudflare ──?──> GitHub
                   ↑
              答案不在這裡 ❌
```

Cloudflare 可能把請求轉址到 HTTPS、可能回自己的錯誤頁、可能因快取規則回錯東西 —— 總之 Let's Encrypt 讀不到 GitHub 放的答案。

驗證失敗 → 憑證簽不出來 → Settings → Pages 一直卡在 *"Certificate is being provisioned"*。而 **Enforce HTTPS 的前提就是「已經有憑證」**，所以它會一直是灰色、勾不起來。這就是「永遠勾不了」的意思。

### D. 一個容易誤判的陷阱

橘雲開著時，用瀏覽器打開 `https://blog.chinghsinchen.com` **可能會看到綠鎖頭，看起來一切正常**。

但那是 **Cloudflare 自己的憑證**（Universal SSL），不是 GitHub 的。加密的只有「訪客 → Cloudflare」這一段；Cloudflare → GitHub 那一段，GitHub 手上根本沒有憑證。

這也解釋了為什麼 SSL/TLS 模式設成 **Flexible** 會造成無限轉址。Flexible 的意思是「後端用 HTTP 連」：

```
訪客 ──HTTPS──> Cloudflare ──HTTP──> GitHub
                                      GitHub：「HTTP 不行，轉去 HTTPS」→ 301
訪客 ──HTTPS──> Cloudflare ──HTTP──> GitHub → 301
訪客 ──HTTPS──> Cloudflare ──HTTP──> GitHub → 301
                    ...無限迴圈 ERR_TOO_MANY_REDIRECTS
```

跟 GitHub Pages 的強制 HTTPS 直接對撞。

### E. 所以正確順序是

```
灰雲 → GitHub 簽到憑證 → 勾 Enforce HTTPS → （選用）才開橘雲 + Full (strict)
```

最後一步之所以可行，是因為那時 GitHub 已經持有合法憑證，Cloudflare 用 Full (strict) 驗證後端才會通過。

但如步驟 6 所說：**維持灰雲就好**。GitHub Pages 本身已有 CDN，對靜態站開 proxy 效益不大，卻多了憑證、SSL 模式、快取這幾個可能出錯的環節。
