// Update chronicle-data.json: add imageUrl to launches + milestone annotations
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'chronicle-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const events = data.events;

// 1. Add imageUrl to launch events
const launchImages = {
  '策略探索家網站上線': 'assets/images/chronicle/launch-index.png',
  'Trip 頁面上線': 'assets/images/chronicle/launch-trip.png',
  'TV 頁面上線': 'assets/images/chronicle/launch-tv.png',
  '美食頁面上線': 'assets/images/chronicle/launch-food.png',
  '部落格專區上線': 'assets/images/chronicle/launch-blog.png',
  '沖繩深度旅遊頁面上線': 'assets/images/chronicle/launch-okinawa-food.png',
};

events.forEach(e => {
  if (e.type === 'launch') {
    const match = Object.keys(launchImages).find(k => e.title.includes(k));
    if (match) {
      e.imageUrl = launchImages[match];
    }
  }
});

// 2. Add milestone annotation events
const milestones = [
  {
    date: '2025-05-21',
    type: 'milestone',
    title: '探索起點',
    description: '從第一行程式碼開始，策略探索家的雛形逐漸成形。核心頁面上線，確立了網站的基本架構與工具定位——證書套、HEIC 轉換、簡單而實用。',
    tags: ['milestone']
  },
  {
    date: '2025-07-04',
    type: 'milestone',
    title: '內容擴展 — 旅行與影視',
    description: '旅行路線上線，從香港行山路線整理到影視推薦清單。網站的內容面從純工具擴展到生活興趣，開始有了「策展」的雛形。',
    tags: ['milestone']
  },
  {
    date: '2026-03-12',
    type: 'milestone',
    title: '平台成熟 — 美食與部落格',
    description: '美食頁面與部落格專區上線，從單頁工具進化為內容平台。每篇文章從產出到排版的工作流程逐漸標準化。',
    tags: ['milestone']
  },
  {
    date: '2026-05-22',
    type: 'milestone',
    title: '深度旅行內容系統',
    description: '沖繩深度旅遊系統完成——40 頁簡報、詳細行程、TDD 開發流程。這是一次完整的內容生產系統演練，從規劃到交付全鏈路打通。',
    tags: ['milestone']
  },
  {
    date: '2026-06-03',
    type: 'milestone',
    title: 'AI 生產力工作流',
    description: '導入 AI 工具鏈——Qwen Studio 生成封面圖、多 session 協作、TDD 開發模式。從一個人寫程式進化到「人 + AI」的協作工作流。',
    tags: ['milestone']
  },
  {
    date: '2026-06-22',
    type: 'milestone',
    title: '系統化探索 — 編年史專案',
    description: '用 multi-agent 編排進行專案探索、session 管理與編年史建置。標誌著從直覺開發到系統化記錄的轉變——不只做事，也記錄怎麼做。',
    tags: ['milestone']
  }
];

events.push(...milestones);

// 3. Sort by date (ascending for storage)
events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

// 4. Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated chronicle-data.json: ${events.length} events (${milestones.length} milestones added)`);

// 5. Generate chronicle-data.js
const jsContent = '// auto-generated from chronicle-data.json\nvar chronicleData = ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'chronicle-data.js'), jsContent, 'utf8');
console.log('Regenerated chronicle-data.js');
