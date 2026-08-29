# Copilot Instructions — Multi-Modal AI

## Always
- Validate file size and MIME type before sending to any vision/audio API
- Return typed structured output from document analysis
- Use `lib/compose.ts` to build multi-modal message arrays
- Set `Content-Type` header correctly for audio responses

## Never
- Send files > 20MB to Vision API
- Return freeform strings from document analysis — use typed schemas
- Stream raw audio bytes without Content-Type
