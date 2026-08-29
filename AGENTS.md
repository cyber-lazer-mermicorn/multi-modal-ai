# Multi-Modal AI — Agent Doctrine

## What this repo is
Production multi-modal AI: vision (image understanding), audio (speech-to-text, TTS), document analysis, and cross-modal reasoning.
By Cherry Shanaley (Chan), AI Solutions Engineer.

## Tech stack
- TypeScript strict, Next.js 15, OpenAI Vision + Whisper + TTS, Vercel

## Coding rules
- Each modality in its own module: `lib/vision/`, `lib/audio/`, `lib/documents/`
- Images sent to Vision API as base64 or URL — max 20MB, validated before send
- Audio transcription via `lib/audio/transcribe.ts` — always returns `{ text, language, duration_s }`
- TTS via `lib/audio/synthesize.ts` — returns audio buffer, never streams raw bytes to client without Content-Type
- Document analysis extracts structured data — typed output schema, never freeform string
- Cross-modal inputs assembled in `lib/compose.ts` — message array builder

## Commands
```bash
npm install && npm run dev
npm run test
```
