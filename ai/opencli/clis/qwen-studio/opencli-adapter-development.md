# OpenCLI 适配器开发实战指南

本文档记录 OpenCLI 适配器的开发方法与经验教训，以 qwen-studio image 适配器为实战案例。

## 目录

- [基础概念](#基础概念)
- [适配器存放位置](#适配器存放位置)
- [适配器结构](#适配器结构)
- [开发流程](#开发流程)
- [实战：qwen-studio image 适配器](#实战qwen-studio-image-适配器)
- [常见问题与解决方案](#常见问题与解决方案)
- [经验教训](#经验教训)

---

## 基础概念

### 什么是 OpenCLI 适配器

OpenCLI 适配器是将网站功能封装为命令行接口的模块。使用适配器可以：

- 通过命令行操作网站（如发帖、搜索、下载）
- 让 AI Agent 通过统一接口操作网站
- 实现自动化工作流

### 认证策略

OpenCLI 支持多种认证策略：

| 策略 | 说明 | 使用场景 |
|------|------|----------|
| `Strategy.PUBLIC` | 公开访问，无需登录 | 新闻、搜索等公开内容 |
| `Strategy.COOKIE` | 使用浏览器 Cookie | 需要登录的网站 |
| `Strategy.TOKEN` | 使用 API Token | 有 API 的网站 |
| `Strategy.LOCAL` | 本地 API | 本地应用 |

---

## 适配器存放位置

### 重要：用户适配器 vs 官方适配器

**用户个人适配器**必须放在用户目录下，**不是**官方仓库：

```
~/.opencli/clis/<site-name>/<command>.js
```

**官方适配器**在仓库中：
```
/Users/bubu/Documents/Github/OpenCLI/clis/<site-name>/
```

> **教训**：最初尝试将适配器放到官方仓库，但每次 opencli 更新都会被覆盖。用户适配器放在 `~/.opencli/clis/` 可以持久保留。

### 目录结构

```
~/.opencli/clis/
└── qwen-studio/
    ├── ask.js        # 问答适配器
    ├── image.js      # 图像生成适配器
    └── ...

# 官方仓库结构
clis/
└── qwen-studio/
    └── ...（官方维护的适配器）
```

---

## 适配器结构

### 基础模板

```javascript
import { cli, Strategy } from '@jackwener/opencli/registry';
import { ArgumentError, CommandExecutionError, TimeoutError } from '@jackwener/opencli/errors';

const SIDE_CHANNEL_ID = '__opencli_<command>_side_channel__';

cli({
  site: 'site-name',           // 网站标识
  name: 'command',             // 命令名
  description: '功能描述',     // 帮助文本
  access: 'write',             // 访问级别: read/write
  domain: 'example.com',       // 网站域名
  strategy: Strategy.COOKIE,   // 认证策略
  browser: true,               // 是否使用浏览器
  navigateBefore: false,       // 是否在执行前导航
  defaultFormat: 'plain',      // 默认输出格式
  args: [                      // 参数定义
    { name: 'prompt', required: true, positional: true, help: '提示词' },
    { name: 'timeout', type: 'int', default: 300, help: '超时秒数' },
  ],
  columns: ['Status', 'Result'], // 输出列
  func: async (page, kwargs) => {
    // 主逻辑
  },
});
```

### 核心 API

| 属性/方法 | 说明 |
|-----------|------|
| `page.goto(url)` | 导航到页面 |
| `page.evaluate(fn)` | 在页面上下文执行代码 |
| `page.wait(ms)` | 等待毫秒 |
| `page.evaluate(() => document.querySelector(...))` | DOM 查询 |
| `ArgumentError` | 参数错误 |
| `CommandExecutionError` | 命令执行错误 |
| `TimeoutError` | 超时错误 |

---

## 开发流程

### Step 1: 理解网站架构

在开始编写适配器前，必须理解目标网站的架构：

1. **是 SPA（单页应用）还是传统页面？**
   - SPA：需要等待 React/Vue 等框架 hydration
   - 传统页面：直接查询 DOM

2. **认证方式是什么？**
   - Cookie（浏览器自动管理）
   - Token（需要从页面提取）

3. **关键 DOM 结构是什么？**
   - 输入框的 selector
   - 提交按钮的 selector
   - 结果显示位置

### Step 2: 实现基础框架

```javascript
import { cli, Strategy } from '@jackwener/opencli/registry';
import { ArgumentError, CommandExecutionError } from '@jackwener/opencli/errors';

cli({
  site: 'my-site',
  name: 'command',
  strategy: Strategy.COOKIE,
  browser: true,
  args: [...],
  columns: [...],
  func: async (page, kwargs) => {
    // 1. 导航到网站
    await page.goto('https://example.com/', { waitUntil: 'domcontentloaded' });

    // 2. 等待 hydration（SPA 必须）
    await waitForHydration(page);

    // 3. 执行操作
    await typeInTextarea(page, 'Hello');
    await clickSendButton(page);

    // 4. 等待并获取结果
    const result = await pollForResult(page);
    return result;
  },
});
```

### Step 3: 处理 React 状态

**关键问题**：现代网站使用 React/Vue，修改 DOM 值后需要触发框架的状态更新。

#### 3.1 文本输入

```javascript
// 错误方式：直接设置 value 属性
await page.evaluate(() => {
  document.querySelector('textarea').value = 'Hello';
});

// 正确方式：触发 React onChange
const typed = await runMainWorld(`
  var t = document.querySelector('textarea');
  if (!t) return { ok: false, reason: 'no textarea' };
  t.focus();
  var propsKey = Object.keys(t).find(k => k.startsWith('__reactProps'));
  if (!propsKey) return { ok: false, reason: 'no reactProps' };
  var props = t[propsKey];
  var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  nativeSetter.call(t, 'Hello');
  t.dispatchEvent(new Event('input', { bubbles: true }));
  try {
    props.onChange({ target: t, currentTarget: t, type: 'change', bubbles: true });
  } catch (e) {
    return { ok: false, reason: 'onChange err: ' + e.message };
  }
  return { ok: true, val: t.value };
`);
```

#### 3.2 点击按钮

```javascript
// 方式1：直接 click（可能不触发 React）
await page.click('button.send-button');

// 方式2：通过 React onClick（推荐）
const clicked = await runMainWorld(`
  var btn = document.querySelector('button.send-button');
  if (!btn) return { ok: false, reason: 'no send button' };
  var propsKey = Object.keys(btn).find(k => k.startsWith('__reactProps'));
  var props = propsKey ? btn[propsKey] : null;
  if (props && props.onClick) {
    try {
      props.onClick({ target: btn, currentTarget: btn, type: 'click',
        preventDefault: function(){}, stopPropagation: function(){} });
    } catch (e) {
      return { ok: false, reason: 'onClick err: ' + e.message };
    }
    return { ok: true, method: 'onClick-direct' };
  }
  btn.click();
  return { ok: true, method: 'native-click' };
`);
```

### Step 4: 主世界代码执行模式（重要！）

`runMainWorld` 函数是在浏览器主世界执行代码的核心模式：

```javascript
const runMainWorld = async (code) => {
  // 1. 重置 side channel
  await page.evaluate((id) => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.display = 'none';
      document.body.appendChild(el);
    }
    el.textContent = '';
    el.dataset.value = '';
  }, SIDE_CHANNEL_ID);

  // 2. 注入脚本
  await page.evaluate((c, id) => {
    const s = document.createElement('script');
    s.textContent = `try {
      var __r = (function(){${c}})();
      document.getElementById('${id}').dataset.value = JSON.stringify(__r);
    } catch(e) {
      document.getElementById('${id}').dataset.value = JSON.stringify({ ok:false, reason:'scriptErr: ' + e.message });
    }`;
    document.head.appendChild(s);
    s.remove();
  }, code, SIDE_CHANNEL_ID);

  // 3. 读取结果
  const raw = await page.evaluate((id) => document.getElementById(id)?.dataset?.value, SIDE_CHANNEL_ID);
  try {
    return JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'parseErr', raw };
  }
};
```

> **教训**：最初将 `runMainWorld` 实现为顶层函数，但应该作为 `func` 内部的闭包函数，这样才能正确访问 `page` 对象。

### Step 5: Hydration 等待

SPA 应用需要等待 React 完全加载后才能操作：

```javascript
let hydrated = false;
for (let i = 0; i < 30; i++) {
  hydrated = await page.evaluate(() => {
    const ta = document.querySelector('textarea');
    return ta && ta.offsetParent !== null;  // 检查元素可见
  }).catch(() => false);
  if (hydrated) break;
  await page.wait(1);
}
if (!hydrated) {
  throw new CommandExecutionError('SPA did not hydrate within 30s');
}
```

---

## 实战：qwen-studio image 适配器

### 背景

用户需要一个适配器，通过 `chat.qwen.ai` 的图像生成功能创建图片并保存到本地。

### 发现的问题

1. **图像生成是内联在聊天中的**
   - 不是独立的"创建图像"模式
   - 而是通过对话请求生成图像

2. **CDN 下载需要认证**
   - 浏览器内 fetch 失败
   - 需要 Node.js HTTP 客户端作为降级方案

### 完整代码

```javascript
import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as https from 'node:https';
import * as http from 'node:http';
import { cli, Strategy } from '@jackwener/opencli/registry';
import { ArgumentError, CommandExecutionError, TimeoutError } from '@jackwener/opencli/errors';

const SIDE_CHANNEL_ID = '__opencli_image_side_channel__';

function displayPath(filePath) {
  const home = os.homedir();
  return filePath.startsWith(home) ? `~${filePath.slice(home.length)}` : filePath;
}

function extFromMime(mime) {
  if (!mime) return '.png';
  if (mime.includes('png')) return '.png';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  return '.png';
}

function downloadToBuffer(imageUrl) {
  return new Promise((resolve) => {
    const protocol = imageUrl.startsWith('https') ? https : http;
    const req = protocol.get(imageUrl, { headers: { Accept: 'image/*' } }, (res) => {
      if (res.statusCode !== 200) {
        resolve({ ok: false, status: res.statusCode });
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const mime = res.headers['content-type'] || 'image/png';
        resolve({ ok: true, mime, buffer: buf });
      });
    });
    req.on('error', (e) => resolve({ ok: false, error: e.message }));
    req.setTimeout(30000, () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
  });
}

cli({
  site: 'qwen-studio',
  name: 'image',
  description: 'Generate images with Qwen Studio (chat.qwen.ai) and save them locally',
  access: 'write',
  domain: 'chat.qwen.ai',
  strategy: Strategy.COOKIE,
  browser: true,
  navigateBefore: false,
  defaultFormat: 'plain',
  args: [
    { name: 'prompt', required: true, positional: true, help: 'Image prompt to generate' },
    { name: 'op', default: '~/Pictures/qwen-studio', help: 'Output directory' },
    { name: 'sd', type: 'boolean', default: false, help: 'Skip download; only return the image links' },
    { name: 'timeout', type: 'int', default: 300, help: 'Max seconds to wait' },
  ],
  columns: ['Status', 'File', 'Link'],
  func: async (page, kwargs) => {
    const prompt = String(kwargs.prompt || '').trim();
    if (!prompt) throw new ArgumentError('prompt is required');
    const outputDir = String(kwargs.op || '~/Pictures/qwen-studio').replace(/^~\//, `${os.homedir()}/`);
    const skipDownload = Boolean(kwargs.sd);
    const timeout = Number(kwargs.timeout ?? 300);

    // === runMainWorld 闭包 ===
    const runMainWorld = async (code) => {
      await page.evaluate((id) => {
        let el = document.getElementById(id);
        if (!el) { el = document.createElement('div'); el.id = id; el.style.display = 'none'; document.body.appendChild(el); }
        el.textContent = '';
        el.dataset.value = '';
      }, SIDE_CHANNEL_ID);

      await page.evaluate((c, id) => {
        const s = document.createElement('script');
        s.textContent = `try { var __r = (function(){${c}})(); document.getElementById('${id}').dataset.value = JSON.stringify(__r); } catch(e) { document.getElementById('${id}').dataset.value = JSON.stringify({ ok:false, reason:'scriptErr: ' + e.message }); }`;
        document.head.appendChild(s);
        s.remove();
      }, code, SIDE_CHANNEL_ID);

      const raw = await page.evaluate((id) => document.getElementById(id)?.dataset?.value, SIDE_CHANNEL_ID);
      try { return JSON.parse(raw); } catch { return { ok: false, reason: 'parseErr', raw }; }
    };

    // === 1. 导航并等待 hydration ===
    await page.goto('https://chat.qwen.ai/', { waitUntil: 'domcontentloaded' });
    let hydrated = false;
    for (let i = 0; i < 30; i++) {
      hydrated = await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        return ta && ta.offsetParent !== null;
      }).catch(() => false);
      if (hydrated) break;
      await page.wait(1);
    }
    if (!hydrated) throw new CommandExecutionError('Qwen Studio SPA did not hydrate within 30s');

    // === 2. 输入提示词 ===
    const imagePrompt = `請生成一張圖片：${prompt}`;
    const typed = await runMainWorld(`
      var t = document.querySelector('textarea');
      if (!t) return { ok: false, reason: 'no textarea' };
      t.focus();
      var propsKey = Object.keys(t).find(k => k.startsWith('__reactProps'));
      if (!propsKey) return { ok: false, reason: 'no reactProps' };
      var props = t[propsKey];
      if (!props || !props.onChange) return { ok: false, reason: 'no onChange' };
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(t, ${JSON.stringify(imagePrompt)});
      t.dispatchEvent(new Event('input', { bubbles: true }));
      try {
        props.onChange({ target: t, currentTarget: t, type: 'change', bubbles: true });
      } catch (e) {
        return { ok: false, reason: 'onChange err: ' + e.message, after: t.value };
      }
      return { ok: true, val: t.value };
    `);
    if (!typed?.ok) throw new CommandExecutionError(`Type failed: ${typed?.reason || 'unknown'}`);

    // === 3. 等待发送按钮出现 ===
    let sendReady = false;
    for (let i = 0; i < 10; i++) {
      sendReady = await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (!ta) return false;
        const btn = ta.parentElement?.querySelector('button.send-button')
          || Array.from(document.querySelectorAll('button')).find(b =>
            b.className && b.className.includes && b.className.includes('send-button') && b.offsetParent !== null
          );
        return !!btn;
      }).catch(() => false);
      if (sendReady) break;
      await page.wait(1);
    }
    if (!sendReady) throw new CommandExecutionError('Send button did not appear after typing');

    // === 4. 点击发送 ===
    const clicked = await runMainWorld(`
      var ta = document.querySelector('textarea');
      var btn = ta && ta.parentElement && ta.parentElement.querySelector('button.send-button');
      if (!btn) {
        btn = Array.from(document.querySelectorAll('button')).find(b =>
          b.className && b.className.includes && b.className.includes('send-button') && b.offsetParent !== null
        );
      }
      if (!btn) return { ok: false, reason: 'no send button' };
      var propsKey = Object.keys(btn).find(k => k.startsWith('__reactProps'));
      var props = propsKey ? btn[propsKey] : null;
      if (props && props.onClick) {
        try { props.onClick({ target: btn, currentTarget: btn, type: 'click', preventDefault: function(){}, stopPropagation: function(){} }); }
        catch (e) { return { ok: false, reason: 'onClick err: ' + e.message }; }
        return { ok: true, method: 'onClick-direct' };
      }
      btn.click();
      return { ok: true, method: 'native-click' };
    `);
    if (!clicked?.ok) throw new CommandExecutionError(`Send click failed: ${clicked?.reason}`);

    // === 5. 等待 URL 变为 /c/{uuid} ===
    let chatId = null;
    for (let i = 0; i < 30; i++) {
      const url = await page.evaluate(() => window.location.href).catch(() => '');
      const match = url.match(/\/c\/([^/]+)/);
      const candidate = match ? match[1] : null;
      if (candidate && candidate !== 'new-chat') { chatId = candidate; break; }
      await page.wait(1);
    }
    if (!chatId) throw new CommandExecutionError('URL did not change to /c/{UUID} after send');

    // === 6. 轮询等待生成的图像 ===
    const startTime = Date.now();
    let imageUrls = [];
    let lastUrls = [];
    let stableCount = 0;

    while (Date.now() - startTime < timeout * 1000) {
      await page.wait(2);

      const urls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img')).filter(img =>
          img.src && img.src.includes('cdn.qwenlm.ai') && img.naturalWidth > 0
        ).map(img => img.src);
        return [...new Set(imgs)];
      }).catch(() => []);

      if (urls.length > 0 && urls.length === lastUrls.length && urls.every((u, i) => u === lastUrls[i])) {
        stableCount++;
        if (stableCount >= 2) {
          imageUrls = urls;
          break;
        }
      } else {
        stableCount = 0;
      }
      lastUrls = urls;

      // 双语错误检测
      const hasError = await page.evaluate(() => {
        const errorEls = Array.from(document.querySelectorAll('div')).filter(el =>
          el.textContent.includes('生成失敗') || el.textContent.includes('generation failed') ||
          el.textContent.includes('error') || el.textContent.includes('錯誤')
        );
        return errorEls.length > 0;
      }).catch(() => false);

      if (hasError) {
        throw new CommandExecutionError('Image generation failed according to page content');
      }
    }

    if (imageUrls.length === 0) {
      throw new TimeoutError('qwen-studio image', timeout, `No generated images found within ${timeout}s`);
    }

    if (skipDownload) {
      return imageUrls.map(url => ({ Status: 'generated', File: null, Link: url }));
    }

    // === 7. 下载图像 ===
    await fs.promises.mkdir(outputDir, { recursive: true });
    const stamp = Date.now();
    const results = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const suffix = imageUrls.length > 1 ? `_${i + 1}` : '';
      let mime = 'image/png';
      let data;

      // 优先尝试浏览器内 fetch（有认证 Cookie）
      const browserFetch = await page.evaluate(async (imgUrl) => {
        try {
          const res = await fetch(imgUrl, { credentials: 'include' });
          if (!res.ok) return { ok: false, status: res.status };
          const ct = res.headers.get('content-type') || 'image/png';
          const buf = await res.arrayBuffer();
          const bytes = new Uint8Array(buf);
          let binary = '';
          for (let j = 0; j < bytes.length; j += 0x8000) {
            binary += String.fromCharCode.apply(null, bytes.subarray(j, j + 0x8000));
          }
          return { ok: true, mime: ct, base64: btoa(binary) };
        } catch (e) {
          return { ok: false, error: e.message };
        }
      }, url).catch((e) => ({ ok: false, error: e.message }));

      if (browserFetch?.ok) {
        mime = browserFetch.mime;
        data = Buffer.from(browserFetch.base64, 'base64');
      } else {
        // 降级：Node.js HTTP 客户端
        const nodeResult = await downloadToBuffer(url);
        if (!nodeResult.ok) {
          results.push({ Status: 'url', File: null, Link: url });
          continue;
        }
        mime = nodeResult.mime;
        data = nodeResult.buffer;
      }

      const ext = extFromMime(mime);
      const filePath = path.join(outputDir, `qwen_studio_${stamp}${suffix}${ext}`);
      await fs.promises.writeFile(filePath, data);
      results.push({ Status: 'saved', File: displayPath(filePath), Link: url });
    }

    return results;
  },
});
```

### 关键设计决策

1. **双下载策略**
   ```javascript
   // 优先浏览器 fetch（携带认证 Cookie）
   // 降级 Node.js HTTP（使用签名 URL）
   ```

2. **稳定性检测**
   ```javascript
   // 等待同一 URL 出现两次才确认
   if (urls.length > 0 && urls.length === lastUrls.length &&
       urls.every((u, i) => u === lastUrls[i])) {
     stableCount++;
     if (stableCount >= 2) break;
   }
   ```

3. **双语错误检测**
   ```javascript
   el.textContent.includes('生成失敗') || el.textContent.includes('generation failed')
   ```

---

## 常见问题与解决方案

### 问题 1: `fs is not defined`

**原因**：在 Node.js ESM 模块中忘记导入 `fs` 模块。

**解决**：
```javascript
import * as fs from 'node:fs';
```

### 问题 2: React 状态未更新

**原因**：直接设置 DOM 值后没有触发 `onChange` 事件。

**解决**：使用 `runMainWorld` 模式触发 React 事件：
```javascript
props.onChange({ target: t, currentTarget: t, type: 'change', bubbles: true });
```

### 问题 3: Hydration 超时

**原因**：SPA 需要更长时间加载。

**解决**：增加等待时间或使用更好的检测条件：
```javascript
// 检查多个条件
const ready = await page.evaluate(() => {
  const ta = document.querySelector('textarea');
  const btn = document.querySelector('button');
  return ta && btn && window.React?.version;
});
```

### 问题 4: CDN 下载失败

**原因**：CDN 需要认证，浏览器内 fetch 受 CORS 限制。

**解决**：实现 Node.js HTTP 降级方案：
```javascript
const nodeResult = await downloadToBuffer(url);
if (!nodeResult.ok) {
  // 返回 URL 供用户手动下载
  return { Status: 'url', File: null, Link: url };
}
```

### 问题 5: `runMainWorld` 函数定义位置错误

**原因**：将 `runMainWorld` 定义为顶层函数而不是闭包。

**解决**：确保 `runMainWorld` 是 `func` 内部的闭包函数：
```javascript
func: async (page, kwargs) => {
  // runMainWorld 在这里定义
  const runMainWorld = async (code) => { ... };

  // 可以使用 page 对象
  const result = await runMainWorld('...');
};
```

---

## 经验教训

### 1. 用户适配器 vs 官方适配器

> **重要**：用户个人适配器必须放在 `~/.opencli/clis/`，而不是官方仓库。官方适配器在每次 opencli 更新时会被覆盖。

### 2. `runMainWorld` 必须是闭包

> 最初将 `runMainWorld` 实现为顶层函数，导致无法访问 `page` 对象。必须作为 `func` 内部的闭包函数。

### 3. React 事件处理

> 直接设置 DOM 值不会触发 React 状态更新。必须找到 `__reactProps` 并调用 `onChange`/`onClick`。

### 4. 双语错误处理

> 面向国际用户的网站可能同时显示中英文错误信息。检测时需要覆盖两种语言。

### 5. CDN 下载降级

> 浏览器内 fetch 受 CORS 限制，但签名 URL 可以通过 Node.js HTTP 下载。实现降级方案提高健壮性。

### 6. 图像稳定性检测

> 生成的图像 URL 可能多次变化。需要等待 URL 稳定（连续两次相同）才确认生成完成。

### 7. 理解网站架构

> chat.qwen.ai 的图像生成不是独立的 UI 模式，而是内联在聊天中。这要求在发送消息后轮询 DOM 等待图像出现。

---

## 附录：参考适配器

- [ask.js](./ask.js) - qwen-studio 问答适配器（参考 `runMainWorld` 闭包模式）
- [qwen.md](./qwen.md) - Qwen 官方适配器文档
- [yaml-adapter.md](./yaml-adapter.md) - 旧版 YAML 适配器（已废弃）
- [contributing.md](./contributing.md) - 官方适配器贡献指南

---

## 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-06-03 | v1.0 | 初版创建，记录 qwen-studio image 适配器开发经验 |