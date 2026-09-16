# KAMRAN Reference Design Findings

## Sources

- Figma reference: https://taupe-sample-87743782.figma.site/
- GitHub mockup: https://github.com/lucylow/KAMRANMobileUIMockup

## Visual direction

The reference uses a bright, calm mobile interface with a slate background (#F8FAFC / #F1F5F9), white cards, blue primary (#2563EB), gold accent (#D97706), teal accent (#0D9488), slate borders (#E2E8F0), muted text (#94A3B8), primary text (#0F172A), and secondary text (#475569). Cards use roughly 16px corner radii and an 8pt spacing grid. The design system identifies Inter, Noto Kufi Arabic, and Noto Sans SC as the intended type families.

## Navigation and screens

The reference presents five primary tabs: Home, Translate, History, Learn, and Settings. It also includes onboarding, text translation, voice translation, OCR/camera translation, conversation mode, offline language-pack management, OCR result review, translation result detail, favorites/history categories, flashcards, phrase library, and settings.

## Home patterns

The Home screen uses a blue gradient or blue hero card with bilingual greeting, a compact avatar badge, a rounded text-entry/search affordance, three quick-action tiles for text, voice, and camera, an offline-ready status row, recent translations, and a daily vocabulary teaser.

## Translation patterns

The Translate screen uses language pills with a central swap control, bilingual source/result cards, a strong blue translation CTA, AI result metadata, related-phrase chips, and action rows for listen, copy, favorite, and share. The reference also separates text, voice, and OCR modes into focused variants of the Translate screen.

## History and learning patterns

History uses search, filter/category chips, bilingual cards, favorite state, and compact actions. Learn uses segmented tabs for vocabulary and phrases, progress summaries, mastery indicators, flashcards, and category-based phrase libraries.

## RTL and accessibility

Uyghur content is right-to-left, while Chinese and English metadata remain legible in their native orientation. The mockup consistently pairs Chinese and Uyghur labels, uses generous touch targets, concise status text, and clear empty/loading states.

## Integration priorities

1. Align theme tokens and card/button styling with the blue, gold, teal reference palette.
2. Improve the Home hero and quick-action hierarchy without removing existing entry points.
3. Bring Translate and History toward the reference’s pill, card, filter, and action-row patterns.
4. Preserve current mock service boundaries, persistence, async cancellation, and accessibility semantics.
5. Avoid importing the web mockup wholesale; adapt its visual language to native Expo components and existing app architecture.
