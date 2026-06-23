# 心經視頻製作編年史

## 專案概述

**目標**：將心經（般若波羅蜜多心經）React 網頁演示文稿轉換為視頻

**最終成果**：
- 視頻時長：3 分 59 秒
- 章節數：8 章
- 音頻段數：39 段
- 文件大小：9.9MB
- 解析度：1444×942 @ 30fps

---

## 技術棧

| 組件 | 技術 |
|------|------|
| 網頁演示 | React + Vite + TypeScript |
| 音頻合成 | macOS `say` TTS + `afconvert` |
| 屏幕錄製 | OpenMontage `screen_recorder` (FFmpeg avfoundation) |
| 音頻合成 | FFmpeg concat demuxer |
| 視頻合成 | FFmpeg mux (H.264 + AAC) |
| 主題 | indigo-porcelain (Playfair Display + Noto Serif SC) |

---

## 製作流程

### Phase 1: 網頁演示文稿建置

**已完成工作**：
- ✅ 8 個章節組件（TSX + CSS）
  1. coldopen（開場鉤子）- 3 步
  2. title-meaning（名字含義）- 5 步
  3. five-aggregates（五蘊）- 6 步
  4. core-teaching（核心教義）- 6 步
  5. emptiness-meaning（性空與緣起）- 5 步
  6. liberation（解脫之道）- 5 步
  7. mantra（咒語）- 5 步
  8. closing（結語）- 4 步

- ✅ 自動播放系統（`?auto=1` 查詢參數）
- ✅ 音頻播放器 hook（`useAudioPlayer`）
- ✅ 進度條與章節導航

**設計主題**：indigo-porcelain
- 主色：深靛藍 #0A1F3D（墨水色）
- 背景：瓷白 #F1F3F5
- 字體：Playfair Display（英文標題）+ Noto Serif SC（中文）

---

### Phase 2: 音頻合成

**工具**：macOS `say` TTS（無需 API key）

**流程**：
1. 提取 39 段敘事文本（`extract-narrations.ts`）
2. 生成 `audio-segments.json` manifest
3. 使用 `say.sh` provider 合成 MP3
4. 用 `afconvert` 轉換為 MP3 格式（22.05kHz mono, 56kbps）

**音頻時間表**：
| 章節 | 步數 | 總時長 |
|------|------|--------|
| coldopen | 3 | 26.0s |
| title-meaning | 5 | 37.8s |
| five-aggregates | 6 | 39.3s |
| core-teaching | 6 | 29.7s |
| emptiness-meaning | 5 | 28.6s |
| liberation | 5 | 26.3s |
| mantra | 5 | 25.2s |
| closing | 4 | 22.3s |
| **總計** | **39** | **235.1s (3:55)** |

---

### Phase 3: 屏幕錄製（OpenMontage）

**挑戰**：
- macOS FFmpeg avfoundation 只能錄全屏，不能指定窗口
- 需要 macOS 屏幕錄製權限
- Chrome 窗口必須可見且無遮擋

**解決方案**：
1. 使用 OpenMontage `screen_recorder` 工具
2. 錄製時長：6 分鐘（安全覆蓋 4 分鐘演示）
3. 錄製參數：30fps, H.264, 1444×942
4. 輸出：`screen-capture.mp4` (11MB)

**命令**：
```bash
cd /Users/bubu/OpenMontage && source .venv/bin/activate
python3 << 'EOF'
from tools.capture.screen_recorder import ScreenRecorder
recorder = ScreenRecorder()
result = recorder.execute({
    'output_path': '/Users/bubu/Documents/Github/myo.makeyourown/videos/screen-capture.mp4',
    'duration_seconds': 360,
    'fps': 30,
    'capture_audio': True,
    'screen_index': 0,
})
EOF
```

---

### Phase 4: 音頻視頻合成

**步驟**：

1. **串聯所有 MP3 段**：
```bash
# 創建 concat list
for seg in audio-segments.json:
    echo "file 'public/audio/{chapter}/{step}.mp3'" >> concat-list.txt

# 合併為單一音頻
ffmpeg -f concat -safe 0 -i concat-list.txt \
  -acodec libmp3lame -b:a 128k audio-combined.mp3
```

2. **計算音頻偏移**：
   - 錄屏開始時，演示已播放約 3.7 秒
   - 使用 `-itsoffset 3.7` 对齐音頻

3. **合成最終視頻**：
```bash
ffmpeg -y \
  -i screen-capture.mp4 \
  -itsoffset 3.7 -i audio-combined.mp3 \
  -c:v copy -c:a aac -b:a 128k \
  -shortest \
  heart-sutra-draft.mp4
```

4. **裁剪到正確時長**：
```bash
ffmpeg -y -i heart-sutra-draft.mp4 -t 239 \
  -c copy heart-sutra-final.mp4
```

---

## 最終輸出

**文件位置**：`/Users/bubu/Documents/Github/myo.makeyourown/videos/heart-sutra-final.mp4`

**技術規格**：
```
Duration: 00:03:59.00
Video: H.264 1444×942 @ 30fps, 250kb/s
Audio: AAC 22050Hz mono, 93kb/s
Size: 9.9MB
```

**章節同步時間表**：
| 視頻時間 | 章節 | 音頻時間 |
|---------|------|---------|
| 0:00-0:26 | coldopen | 3.7-29.7s |
| 0:26-1:04 | title-meaning | 29.7-67.7s |
| 1:04-1:43 | five-aggregates | 67.7-106.7s |
| 1:43-2:13 | core-teaching | 106.7-136.7s |
| 2:13-2:42 | emptiness-meaning | 136.7-165.7s |
| 2:42-3:08 | liberation | 165.7-191.7s |
| 3:08-3:33 | mantra | 191.7-216.7s |
| 3:33-3:59 | closing | 216.7-239s |

---

## 關鍵技術發現

### 1. OpenMontage screen-demo Pipeline

- `screen_recorder` 使用 FFmpeg avfoundation（macOS）
- 支持全屏或區域錄製（region 參數實際是錄後 crop）
- 需要 macOS 屏幕錄製權限

### 2. macOS 屏幕錄製限制

- FFmpeg avfoundation 不支持指定窗口 ID
- `screencapture -l <window_id>` 需要 CGWindowID（不同於 osascript 的 window ID）
- 替代方案：QuickTime Player 手動錄製

### 3. 音頻視頻同步

- 關鍵：計算錄屏開始相對於音頻開始的偏移
- 方法：比對視頻幀與音頻時間表的章節內容
- 本案例偏移：+3.7 秒

---

## 經驗教訓

### 成功的做法

1. **使用 OpenMontage 標準化流程**：
   - 遵循 `openmontage-central-kitchen` skill
   - 正確使用 `screen-demo` pipeline
   - 自動化錄製與合成

2. **macOS TTS 優勢**：
   - 無需 API key
   - 本地合成，速度快
   - 音質可接受（22.05kHz mono）

3. **FFmpeg 強大靈活性**：
   - concat demuxer 無縫合併 MP3
   - `-itsoffset` 精確音頻同步
   - `-shortest` 自動裁剪

### 遇到的挑戰

1. **窗口錄製限制**：
   - macOS 不支持指定窗口錄製（需全屏）
   - 解決：確保 Chrome 窗口為唯一可見窗口

2. **音頻同步**：
   - 初始偏移計算不精確
   - 解決：通過章節內容比對驗證

3. **Playwright Recorder 不存在**：
   - `article-to-video` skill 參考的工具在 OpenMontage 中不存在
   - 解決：改用 `screen_recorder` + FFmpeg

---

## 相關文件

| 文件 | 路徑 |
|------|------|
| 最終視頻 | `videos/heart-sutra-final.mp4` |
| 原始錄屏 | `videos/screen-capture.mp4` |
| 合併音頻 | `videos/audio-combined.mp3` |
| 音頻 manifest | `presentation/audio-segments.json` |
| 演示文稿 | `presentation/` (Vite + React) |
| 編年史數據 | `chronicle-data.js` |
| 縮略圖 Ch1 | `assets/images/chronicle/heart-sutra-ch1.jpg` (觀世音) |
| 縮略圖 Ch3 | `assets/images/chronicle/heart-sutra-ch3.jpg` (色即是空) |
| 縮略圖 Ch6 | `assets/images/chronicle/heart-sutra-ch6.jpg` (般若波羅蜜多) |

---

## 下一步

1. **視頻優化**：
   - 添加字幕（FFmpeg burn_subtitles）
   - 添加轉場特效
   - 導出多版本（1080p, 720p, 社交媒體版）

2. **發布**：
   - 上傳 YouTube/B 站
   - 嵌入演示文稿頁面
   - 社交媒體推廣

3. **技術沉澱**：
   - 將工作流程寫成 OpenMontage skill
   - 創建可重用的視頻生產 template
   - 文檔化最佳實踐

---

**製作日期**：2026 年 6 月 24 日  
**總耗時**：約 2 小時  
**AI 參與**：OpenMontage multi-agent 編排