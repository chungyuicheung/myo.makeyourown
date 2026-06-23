#!/usr/bin/env bash
# say.sh — macOS built-in TTS (offline, no API key needed)
# Required function: tts_synthesize <text> <out_path> [<voice>]

tts_synthesize() {
  TEXT="$1"
  OUT="$2"
  VOICE="${3:-}"
  TEMP_AIFF="/tmp/tts_say_$$.aiff"
  if [ -n "$VOICE" ]; then
    say -v "$VOICE" "$TEXT" -o "$TEMP_AIFF"
  else
    say "$TEXT" -o "$TEMP_AIFF"
  fi
  afconvert -f MP4F -d aac "$TEMP_AIFF" "$OUT" 2>/dev/null \
    || ffmpeg -y -i "$TEMP_AIFF" "$OUT" 2>/dev/null \
    || cp "$TEMP_AIFF" "$OUT"
  rm -f "$TEMP_AIFF"
}

tts_check() {
  if ! command -v say >/dev/null 2>&1; then
    echo "say command not found — this should never happen on macOS"
    return 1
  fi
  if ! command -v afconvert >/dev/null 2>&1; then
    echo "afconvert not found"
    return 1
  fi
  return 0
}
