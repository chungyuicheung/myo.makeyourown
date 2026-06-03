---
name: generate-image
description: Use when the user asks to generate, create, draw, or make an image — with words like "a cat", "a logo", "a diagram", or any visual content request. Not for text-only tasks.
---

# generate-image

Generate AI images via Qwen Studio using the `opencli qwen-studio image` adapter.

## When to Use

- User says: "generate an image of X", "/generate-image X", "create a picture of X", "draw a [description]"
- Triggers include: "make an image", "generate a picture", "/generate-image", or any request for visual output

## How to Use

```
/generate-image <prompt> [--output <dir>] [--timeout <seconds>]
```

| Argument | Required | Default | Description |
|---|---|---|---|
| `prompt` | Yes | — | Image description (e.g. `A cute cat`, `A minimalist logo for a bakery`) |
| `--output` / `--op` | No | `~/Pictures/qwen-studio` | Output directory for saved image |
| `--timeout` | No | `300` | Max seconds to wait for generation |

## Examples

```
/generate-image A cute orange cat wearing a tiny hat
/generate-image A minimalist logo for a bakery --output ~/Downloads
/generate-image Architectural diagram of a microservices system --timeout 600
```

## What It Does

1. Invokes `opencli qwen-studio image "<prompt>" --op <output_dir> --timeout <timeout>`
2. Waits for image generation to complete (polls DOM for generated images)
3. Downloads the image to the specified output directory
4. Returns the saved file path and image URL

## Error Handling

| Error | Response |
|---|---|
| No prompt provided | `Usage: /generate-image <prompt> [--output <dir>] [--timeout <seconds>]` |
| Image generation failed | `Image generation failed: <reason>` |
| Timeout exceeded | `Image generation timed out after N seconds. Try again or increase --timeout.` |
| Send button not found | `Could not trigger Qwen Studio. Make sure you're logged in at chat.qwen.ai` |

## Prerequisites

Requires:
- `opencli` installed (`npm install -g @jackwener/opencli`)
- OpenCLI Chrome extension installed and connected
- Chrome browser logged into `chat.qwen.ai`

Run `opencli doctor` to verify connectivity if errors occur.