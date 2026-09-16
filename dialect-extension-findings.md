# KAMRAN Dialect Extension Findings

## Source

The attached document `pasted_content_4.txt` is titled “KAMRAN – Enhanced Dialect Support & Integration.” It proposes dialect detection, dialect-aware translation, phrase suggestions, dialect preferences, dialect selector/badge/toggle components, dialect settings, and integration with learning, voice, OCR, and demo mode.

## UI-relevant guidance

The most directly useful UI patterns are a compact dialect selector, a selected dialect badge, a dialect toggle in Translate, a dialect settings panel, detection confidence with alternatives, and phrase suggestions tied to the selected dialect. The document names Uyghur regions including Kashgar, Urumqi, Turpan, Hotan, Ili, and Altay, and Chinese varieties including Mandarin, Cantonese, Shanghainese, Sichuanese, Hakka, Hokkien, and Wu.

## Safe integration decision

KAMRAN should keep dialect behavior behind typed deterministic metadata and mock boundaries. The immediate UI pass should expose selection and fallback guidance rather than claim production dialect detection or dialect-preserving translation. Detection confidence and automatic dialect translation should remain future-ready until a real service boundary is explicitly requested.

## Recommended next UI slice

Use the existing Translate variant selector as the foundation, add a selected-dialect badge to result metadata, and surface deterministic phrase suggestions in Learn or Translate. Persisting the selected dialect can be a follow-up preference task. Keep the existing translation, voice, OCR, history, async cancellation, persistence, and accessibility flows unchanged.
