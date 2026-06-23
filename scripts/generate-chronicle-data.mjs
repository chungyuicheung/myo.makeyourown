#!/usr/bin/env node
// scripts/generate-chronicle-data.mjs
// 從 git log 提取 commits，輸出 chronicle-data.json 的初始版本

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

// 讀取現有資料（保留手動新增的 session/launch/note）
const jsonPath = join(repoRoot, 'chronicle-data.json');
let manualEvents = [];
if (existsSync(jsonPath)) {
  try {
    const existing = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    manualEvents = existing.events.filter(e => e.type !== 'commit');
    console.log(`Preserved ${manualEvents.length} non-commit events from existing data`);
  } catch (e) {
    console.warn('Could not read existing chronicle-data.json, starting fresh');
  }
}

// 取得所有 commits (format: hash|date|subject)
const logOutput = execSync(
  'git log --all --format="%h|%ad|%s" --date=short',
  { cwd: repoRoot, encoding: 'utf-8' }
);

const commitEvents = logOutput
  .trim()
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [hash, date, ...subjectParts] = line.split('|');
    const subject = subjectParts.join('|');
    const tags = [];

    if (/blog|article|post/i.test(subject)) tags.push('blog');
    if (/trip|travel|okinawa|hongkong/i.test(subject)) tags.push('travel');
    if (/nav|header|footer|design/i.test(subject)) tags.push('design');
    if (/test|tdd/i.test(subject)) tags.push('test');
    if (/ai|qwen|image|cover/i.test(subject)) tags.push('ai');
    if (/food/i.test(subject)) tags.push('food');
    if (/cert|heic|tool/i.test(subject)) tags.push('tool');
    if (/seo|sitemap|robots/i.test(subject)) tags.push('seo');
    if (/refactor|fix|clean/i.test(subject)) tags.push('maintenance');

    return {
      date,
      type: 'commit',
      title: subject,
      description: '',
      link: `https://github.com/ashashash001001-stack/myo.makeyourown/commit/${hash}`,
      tags
    };
  });

// 合併 commits 與手動事件，依日期排序
const allEvents = [...commitEvents, ...manualEvents];
allEvents.sort((a, b) => a.date.localeCompare(b.date));

// 去除重複 (同一日期+類型+標題視為重複)
const seen = new Set();
const unique = allEvents.filter(e => {
  const key = e.date + e.type + e.title;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const output = { events: unique };

// JSON format — human-editable source
writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Wrote ${unique.length} events to ${jsonPath}`);

// JS format — loaded via <script> tag for file:// compatibility
const jsPath = join(repoRoot, 'chronicle-data.js');
const js = '// auto-generated from chronicle-data.json\nvar chronicleData = ' + JSON.stringify(output, null, 2) + ';\n';
writeFileSync(jsPath, js, 'utf-8');
console.log(`Wrote ${unique.length} events to ${jsPath}`);