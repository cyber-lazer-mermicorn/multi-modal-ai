# Architecture

## Modality modules

| Module | Path | Capabilities |
|---|---|---|
| Vision | `lib/vision/` | Image understanding, OCR, object detection |
| Audio | `lib/audio/` | Whisper transcription, OpenAI TTS |
| Documents | `lib/documents/` | PDF/Word structured extraction |
| Compose | `lib/compose.ts` | Multi-modal message array builder |

## Cross-modal reasoning
Inputs from multiple modalities are assembled by `lib/compose.ts` into an OpenAI message array and sent to `gpt-4o` (vision-capable). Each modality module returns a typed partial message that compose merges.
