# Release-candidate preview findings

Date: 2026-08-27

The live preview now renders the onboarding route and Home tab without a visible error overlay. After skipping onboarding, the Home screen renders the KAMRAN brand, bilingual hero, offline-ready status, Text/Voice/Camera quick actions, recent translation card, translation input, and bottom navigation. The JSX audit across `app/` and `components/` reports no non-whitespace JSX text nodes outside recognized `Text` or namespaced text components.

The managed screenshot pass captured `/`, `/translate`, `/ocr`, `/history`, and `/learn` at 390×844; `/settings` failed to capture in that batch, so Settings still needs a direct route check. The latest Metro output shows successful web bundling and TypeScript reports zero errors. Historic log entries contain earlier warnings, so final status should be based on a fresh route pass and current console output rather than the full accumulated log.

A fresh direct navigation to `/settings` redirects to `/onboarding` because the browser session does not retain the onboarding completion flag across that navigation context. Skipping onboarding returns to Home, which renders cleanly and exposes Settings as the final tab. This is a navigation-state observation, not a JSX error.

Opening Settings from the Home tab reaches `/settings` successfully. Settings shows language, voice/accessibility, privacy/offline preferences, destructive actions, and bottom navigation without a visible runtime overlay. Opening Translate from Settings reaches `/translate` successfully. Translate shows the bilingual language selector, source editor, translation result area, voice input/listen controls, voice settings, and the main translation action; no visible error overlay appeared in the fresh route pass.

The live browser console was checked after the Settings and Translate route pass and returned no console output. This supports that the current preview is rendering without active client-side errors; the repeated `Unexpected text node` lines in the accumulated server log are stale or emitted by an earlier capture context rather than the current browser session.

The Home-to-OCR flow reaches `/ocr` and renders the actual Camera Translation screen with camera/image source actions, scan guidance, “Ready to scan,” live camera preview readiness, native permission guidance, and the Scan text action. No visible runtime overlay appeared.

The OCR-to-Home-to-History flow reaches `/history` and renders the phrasebook header, local-device copy, All/Recent/Favorites filters, search field, and an honest empty-state message with a Translate-a-phrase recovery instruction. No visible runtime overlay appeared.

The Learn flow renders the real vocabulary and phrase cards, progress summary, cultural categories, four culture lesson cards, and quick-review CTA. Opening Twelve Muqam displays the implemented lesson preview with the bilingual title, duration, authentic lesson copy, takeaway panel, and Done action. No visible runtime overlay appeared.

Demo-film review: the deterministic fallback MP4 is 1280×720, H.264/AAC, 88 seconds, and 667,318 bytes. The contact sheet shows the intended nine-screen sequence—onboarding, Home, Translate, voice-oriented Translate, OCR, Learn, Twelve Muqam lesson, History, and Settings—with restrained zoom and dark lower-third callouts. A frame inside the final Settings scene is rendered correctly; the black contact-sheet thumbnail at exactly 80 seconds is a boundary timestamp artifact, not a sustained gap. AI video generation was unavailable because the stated free-plan daily limit was already reached, so the delivered film is explicitly an authentic-screen deterministic fallback rather than an AI-generated motion clip.

After removing the direct-space node from Learn, the static JSX audit is clean. A fresh mobile capture batch successfully rendered `/translate`, `/history`, and `/settings`; `/`, `/ocr`, and `/learn` were intermittently rejected by the managed screenshot resolver, while the live browser rendered onboarding without an error overlay and fresh direct routes redirected through onboarding when the completion flag was absent. The remaining screenshot failures are managed preview-capture intermittency, not TypeScript or JSX parse failures.

Mobile-mockup revision: the referenced GitHub repository was cloned and launched locally. Its gallery presents authentic portrait phone renders for onboarding, Home, text translation, voice translation, OCR camera, History, Learn, conversation, offline mode, OCR result, translation detail, favorites, flashcards, phrasebook, and Settings. The exposed preview initially required a Vite allowed-host adjustment; after that, the gallery and individual phone screens render normally. The revised video will use these portrait mockup screens rather than the earlier wide KAMRAN web-preview captures.

The mockup gallery exposes 15 exact portrait phone cards at fixed 390×844-style content, with DOM order: onboarding, Home, text Translate, Voice, Camera/OCR, History, Learn, Conversation, Offline, OCR result, translation detail, Favorites, Flashcard, Phrase library, and Advanced Settings. Direct DOM inspection confirms each gallery card is a `div.cursor-pointer` with predictable rectangles, so captures can be selected reliably without coordinate guessing.

The gallery-selection patch now works: selecting the Home card opens the real Home screen inside the 390×844 portrait phone frame rather than resetting to onboarding. The fresh clean source capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-52-48_9633.webp`. Remaining source screens will be selected through the gallery’s exact DOM card order and copied from their clean browser captures.

The original mockup Text Translate card now opens directly in the portrait device frame. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-53-29_6450.webp` and includes the bilingual input, blue translate CTA, AI result, playback/copy/favorite/share actions, and related phrases.

The mockup gallery is now configured to render the selected screen directly inside its 390×844 portrait device frame. The original text-translation mockup opens correctly and was captured cleanly at `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-53-29_6450.webp`; the current gallery selection path is now deterministic through the DOM card order.

The original voice-translation mockup opens directly in the portrait frame and shows bilingual language badges, the microphone guidance, and the large blue recording control. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-54-24_5721.webp`.

The original OCR Camera mockup opens directly in the portrait device frame and shows the dark scan surface, OCR/instant toggle, guided scan brackets, helper copy, and camera controls. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-55-07_8615.webp`.

The original History mockup opens directly in the portrait phone frame with the bilingual search field, All/Favorites filters, recent translation cards, and bottom navigation. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-55-45_4399.webp`.

The original Learn mockup opens directly in the portrait phone frame with vocabulary/phrase tabs, the 3/6 progress summary, bilingual practice cards, and tab navigation. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-56-19_6403.webp`.

The original Settings mockup opens directly in the portrait phone frame with the KAMRAN AI profile card, translation preferences, RTL and accessibility controls, speech speed, and voice-engine settings. The clean capture is `/home/ubuntu/screenshots/4173-iqc28do3bxamh1j_2026-08-27_19-56-58_6192.webp`.
