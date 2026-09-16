# KAMRAN Mobile Interface Design

## Product Direction

KAMRAN is a calm, trustworthy translation companion for Uyghur–Chinese communication. The interface is designed for portrait orientation and one-handed use, with a warm ivory canvas, deep ink typography, and a saffron-orange action color that makes the main translation action immediately discoverable.

## Screen List

| Screen | Primary content and functionality |
|---|---|
| Home | Greeting, current language direction, large Translate action, quick actions for voice and camera, recent translation preview, and offline readiness status. |
| Translate | Source/target language selector, editable source text field, translate action, translated result card, copy/share/speak actions, and save-to-phrasebook action. |
| Voice | Large record control, listening state, waveform placeholder area, source/target labels, and translated speech result. |
| Camera | Camera/OCR entry state with framing guidance, scan action, detected text preview, and translated result. |
| History | Searchable list of recent translations, favorite indicators, and empty state when no entries exist. |
| Learn | Phrase categories, daily practice card, saved phrases, and a lightweight vocabulary review flow. |
| Settings | Language defaults, offline mode toggle, appearance preference, speech settings, and app information. |

## Key User Flows

1. **Text translation:** User opens Home → taps Translate → enters Uyghur or Chinese text → taps Translate → reads the result → copies, speaks, shares, or saves it.
2. **Language direction:** User taps the language direction control → switches source and target → sees the direction reflected in the editor and result card.
3. **Voice translation:** User opens Home → taps Voice → taps the record control → sees listening feedback → stops recording → receives a translated phrase result.
4. **Camera translation:** User opens Home → taps Camera → grants camera permission when needed → frames text → taps Scan → reviews detected text and translation.
5. **Learning:** User opens Learn → selects a phrase category → opens a saved phrase → marks it practiced or plays pronunciation.
6. **History:** User opens History → selects a recent item → returns to Translate with the source and result restored.

## Visual System

- **Canvas:** `#FAF7F1` warm ivory for a softer reading environment.
- **Ink:** `#1E2421` deep green-black for primary text.
- **Primary accent:** `#D9773F` saffron clay orange for the main CTA and active states.
- **Secondary accent:** `#2D7C74` muted jade for trust, audio, and offline status.
- **Surface:** `#FFFFFF` white cards with subtle `#E9E1D7` borders.
- **Muted text:** `#77736D` for supporting copy.
- **Positive state:** `#4D8A67` for offline-ready and saved feedback.

## Layout and Interaction Rules

The Home screen uses a top greeting, one dominant translation card, and a two-column quick-action grid. Primary actions use a minimum 48pt touch target, pressed opacity/scale feedback, and light haptics where available. Cards use 20–24pt corner radii and restrained shadows. Bottom tabs are Home, Translate, History, and Learn; Settings is reachable from the Home header and the Learn screen. All scrollable content uses safe-area-aware containers and accessible labels.
