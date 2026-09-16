# Project TODO

- [x] Review the attached KAMRAN development brief
- [x] Initialize the Expo React Native mobile project
- [x] Document the mobile interface design and user flows
- [x] Generate and install the KAMRAN app icon and branding assets
- [x] Update theme tokens for the KAMRAN visual system
- [x] Build the Home screen with translation, voice, and camera entry points
- [x] Build the Translate screen with language direction and result interactions
- [x] Build History and Learn tabs with local sample state
- [ ] Add Settings access and offline preference behavior
- [ ] Add local translation history and favorites state
- [x] Add translation-oriented MVP interactions without external API keys
- [x] Verify TypeScript, lint, and tests; mobile preview remains unavailable in the current preview resolver

## Feature Expansion — Requested

- [x] Add a mock AI translation service with simulated latency and loading state
- [x] Add persistent local translation history storage
- [x] Add favorite toggling and persistent favorite state
- [x] Add voice input control with active visual feedback animation
- [x] Add text-to-speech playback control with active visual feedback animation
- [x] Connect Translate and History screens to persistent translation state
- [x] Validate the expanded translation flows with TypeScript, lint, and tests; preview capture remains intermittent

## Continuous Improvement — Requested

- [x] Improve translation state reliability and cancellation behavior
- [x] Add actionable empty, error, and reset states to translation flows
- [x] Improve History favorite behavior and saved-entry presentation
- [x] Polish accessibility labels, touch targets, and loading feedback
- [x] Validate the improvements with TypeScript, lint, and tests; preview capture remains intermittent

## Continuous Improvement — Next Pass

- [ ] Add clear translation/reset controls and stronger empty-state actions
- [ ] Improve saved-history deletion and favorite interaction feedback
- [ ] Add reusable accessible action components for translation controls
- [ ] Reduce inline rendering complexity in the translation and history screens
- [x] Validate the next improvement pass with TypeScript, lint, tests, and preview

## Attachment-Driven Improvement Scope

- [x] Add a first-run onboarding flow for KAMRAN's three MVP modes
- [x] Add a skippable onboarding completion flag with local persistence
- [x] Improve primary translation, voice, and camera entry-point clarity
- [x] Add accessible progress and action feedback patterns inspired by the UX brief
- [x] Keep monetization and production API integration out of this pass until explicitly requested

## OCR Translation — Requested

- [x] Add a mock OCR recognition service with preprocessing and confidence metadata
- [x] Add a camera/OCR translation screen with scan, review, and translate states
- [x] Add OCR entry-point navigation from the Home screen
- [x] Add accessible scan guidance and error/empty states
- [x] Keep native OCR engine integration isolated for a later device-specific pass

## Continuous Improvement — Native UX Pass

- [x] Extract reusable accessible action-button patterns from translation flows
- [x] Add explicit cancel/reset affordances to OCR and translation loading states
- [x] Improve native press feedback and screen-reader labels across primary actions
- [x] Strengthen OCR and translation error recovery without dead ends
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Interaction Quality Pass

- [x] Add haptic feedback to key translation, OCR, and favorite actions
- [x] Improve safe async cleanup for speech, OCR, and translation tasks
- [x] Add clearer disabled/loading semantics to reusable action controls
- [x] Improve keyboard dismissal and input ergonomics on translation screens
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Reliability Pass

- [x] Add keyboard dismissal and return-key behavior to translation input
- [x] Add haptic feedback to favorite and destructive history actions
- [x] Improve speech playback cleanup and repeat-tap behavior
- [x] Add clearer accessibility state announcements for loading and active controls
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Accessibility Pass

- [x] Add explicit accessibility state text for active, loading, and completed actions
- [x] Improve keyboard-aware layout behavior for longer translation input
- [x] Add confirmation feedback for destructive history actions
- [x] Improve reusable action component semantics and testability
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Testability Pass

- [ ] Add deterministic unit tests for mock translation and OCR services
- [ ] Add reusable status-announcement patterns for async actions
- [ ] Improve favorite and history interactions for rapid repeated taps
- [ ] Add deterministic tests for local translation-store behavior
- [ ] Validate this pass with TypeScript, lint, tests, and preview

## Voice Features — Attached Brief

- [x] Add a mock voice service boundary for speech-to-text and voice activity states
- [x] Add microphone permission and audio-session readiness states without requiring production credentials
- [x] Improve voice input lifecycle, cancellation, and repeated-tap behavior
- [x] Add language-aware voice engine configuration metadata for future native integrations
- [x] Fix Vitest alias resolution and add deterministic voice service tests
- [x] Validate the voice pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Voice Readiness Pass

- [x] Add a mock microphone permission/readiness state boundary
- [x] Add voice engine status metadata to the translation screen
- [x] Improve speech playback completion and error state cleanup
- [x] Add focused tests for voice readiness and playback state transitions
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Continuous Improvement — Voice UX Pass

- [x] Add a compact voice settings surface for language and speech rate
- [x] Improve voice readiness messaging and permission-oriented guidance
- [x] Add guarded playback controls for unsupported language voices
- [x] Add deterministic tests for voice settings and playback guards
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Bug Fix — User Requested

- [x] Inspect current TypeScript, lint, test, and runtime errors
- [x] Fix the highest-impact project errors without regressing translation, OCR, or voice flows
- [x] Re-run TypeScript, lint, tests, and preview validation

## Bug Fix — Attached UI Report

- [x] Remove Expo Router extraneous tab-route warnings
- [x] Eliminate deprecated pointerEvents warnings where the app owns the source
- [x] Preserve the attached UI guidance without introducing new runtime errors

## Bug Fix — Attached AI Report

- [x] Keep AI model and routing concepts isolated behind safe mock service boundaries
- [x] Remove invalid or environment-specific AI assumptions from active app paths
- [x] Preserve deterministic offline behavior while fixing current runtime warnings

## OCR Improvement — Requested

- [x] Add explicit OCR scan, review, translating, result, and error state handling
- [x] Add editable recognized-text review before translation
- [x] Add confidence-aware OCR guidance and retry behavior
- [x] Add copy, save, and reset actions to OCR results
- [x] Add deterministic tests for OCR state and recovery helpers
- [x] Validate the OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Confidence Pass

- [x] Add confidence-aware OCR status presentation and review guidance
- [x] Surface preprocessing details in an accessible expandable section
- [x] Improve OCR result copy/save feedback and repeated-action safety
- [x] Add focused tests for OCR confidence and result helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Input Pass

- [x] Add mock camera/gallery input selection states behind a native-ready service boundary
- [x] Add scan source guidance for camera versus imported image
- [x] Improve editable OCR review with clear text direction and reset behavior
- [x] Add deterministic tests for OCR input-source helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Recognition Pass

- [x] Add native-ready image preview metadata for selected camera/gallery sources
- [x] Add clearer recognition progress and detected-text quality feedback
- [x] Improve scan-source switching and retry behavior without losing reviewed text
- [x] Add deterministic tests for OCR source metadata and recognition feedback helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Validation Pass

- [x] Add recognized-text validation before translation
- [x] Add clearer empty and low-confidence review guidance
- [x] Improve OCR reset behavior while preserving the selected scan source
- [x] Add deterministic tests for OCR input validation helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Review Workflow Pass

- [x] Add clearer multi-line detected-text review behavior
- [x] Add reviewed-text character and line-count feedback
- [x] Improve OCR result sharing/copy feedback without duplicate saves
- [x] Add deterministic tests for OCR review metadata helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## OCR Improvement — Scan Refinement Pass

- [x] Add clearer scan-source readiness and permission guidance
- [x] Add a review-state reset that preserves recognized text when appropriate
- [x] Improve result status feedback for copy and save actions
- [x] Add deterministic tests for scan-readiness and result-status helpers
- [x] Validate this OCR pass with TypeScript, lint, tests, and preview

## Voice Improvement — Readiness Pass

- [x] Add explicit microphone readiness and permission guidance to voice controls
- [x] Add recording duration and stop-state feedback behind the mock voice boundary
- [x] Improve speech playback status and repeat-tap protection
- [x] Add deterministic tests for voice readiness and playback status helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Preferences Pass

- [x] Persist speech-rate preferences locally with safe hydration
- [x] Add playback progress and repeat-play protection
- [x] Add a reset-to-default voice settings action
- [x] Add deterministic tests for voice preference persistence helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Profile Pass

- [x] Add language-aware voice profile choices behind the mock playback boundary
- [x] Add playback restart and stop controls with clear active-state feedback
- [x] Improve unsupported-profile guidance and fallback messaging
- [x] Add deterministic tests for voice profile selection helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Reliability Pass

- [x] Add native-ready available-voice metadata and selected-voice fallback resolution
- [x] Guard speech start against queued utterances and stale completion callbacks
- [x] Improve pause/resume-aware playback status where the platform supports it
- [x] Add deterministic tests for voice availability and lifecycle helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Native Audio Readiness Pass

- [x] Add interruption-safe recording lifecycle helpers behind the mock boundary
- [x] Add explicit permission, preparing, recording, stopping, and interrupted state guidance
- [x] Improve accessibility announcements for voice capture and playback controls
- [x] Add deterministic tests for recording lifecycle transitions
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Recorder Recovery Pass

- [x] Add native-ready recorder readiness and recovery helpers behind the mock boundary
- [x] Improve interruption and cancellation recovery without stale state updates
- [x] Keep playback status and voice-input status synchronized during mode changes
- [x] Add deterministic tests for recorder recovery and mode transitions
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Handoff Pass

- [x] Add explicit recorder readiness and handoff status helpers
- [x] Improve capture-to-translation handoff feedback and retry behavior
- [x] Add playback restart safeguards when source or direction changes
- [x] Add deterministic tests for handoff and readiness transitions
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Capture Quality Pass

- [x] Add deterministic capture-quality classification and user guidance
- [x] Improve retry ergonomics after low-confidence or interrupted capture
- [x] Add clearer playback accessibility state and action hints
- [x] Add deterministic tests for capture-quality helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Live Capture Pass

- [x] Add native-ready live capture level and readiness metadata
- [x] Improve recognized-text review before translation with explicit confirmation guidance
- [x] Add safer voice retry behavior after low-confidence results
- [x] Add deterministic tests for live capture and review helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Voice Improvement — Review Pass

- [x] Add explicit rerecord and review actions after voice capture
- [x] Improve confidence-specific review guidance and confirmation state
- [x] Prevent stale playback when rerecording or editing recognized text
- [x] Add deterministic tests for review and rerecord helpers
- [x] Validate this voice pass with TypeScript, lint, tests, and preview

## Product Improvement — Mobile UX Quality Pass

- [x] Add clearer translation reset and empty-state actions
- [x] Improve history rapid-tap feedback and favorite/delete semantics
- [x] Add reusable accessibility status guidance across async flows
- [x] Strengthen OCR and voice entry-point recovery affordances
- [x] Validate this app-wide pass with TypeScript, lint, tests, and preview

## Product Improvement — History and Recovery Pass

- [x] Add favorite-only and recent-history filtering helpers
- [x] Improve rapid favorite and delete feedback with stable accessible status
- [x] Add clearer recovery actions when history or OCR/voice flows are empty
- [x] Add deterministic tests for history filter and status helpers
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Product Improvement — Search and Recovery Pass

- [x] Add search across source, result, and language direction in History
- [x] Add reusable empty-state recovery guidance for History and core entry flows
- [x] Improve search/filter status feedback and clear-search behavior
- [x] Add deterministic tests for history search helpers
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Design Integration — Figma and GitHub Mockup

- [x] Inspect the supplied Figma site and GitHub mockup assets and screen structure
- [x] Document the reference design tokens, navigation, and interaction patterns
- [x] Integrate the highest-value visual and UX changes into the existing Expo screens
- [x] Preserve existing translation, voice, OCR, history, persistence, and accessibility behavior
- [x] Validate the integrated design with TypeScript, lint, tests, and visual preview

## Design Integration — UI/UX Refinement Pass

- [x] Improve the Translate screen with stronger bilingual language pills, result metadata, and action-row hierarchy
- [x] Improve the History screen with reference-inspired category/filter chips and bilingual card actions
- [x] Improve the Learn screen with progress summary, vocabulary/phrase segmentation, and richer empty states
- [x] Add reusable design tokens or components where the reference patterns repeat
- [x] Validate the UI/UX refinement pass with TypeScript, lint, tests, and visual preview

## Demo Data Guidance — UI Scenario Pass

- [x] Identify deterministic demo scenarios that improve Home, History, Learn, Voice, and OCR presentation
- [x] Keep demo data local, typed, and deterministic rather than importing unsupported service architecture
- [ ] Add only the UI-facing demo state needed to make the reference flows richer
- [ ] Validate demo scenario behavior with TypeScript, lint, tests, and preview

## Design Integration — Core Flow Polish Pass

- [ ] Add a reference-inspired conversation mode entry point and bilingual message-preview surface
- [ ] Improve OCR scan entry with a stronger camera/document visual treatment and recovery affordances
- [ ] Add reusable demo-ready visual states for Home, History, Learn, Voice, and OCR without random data
- [ ] Preserve native touch feedback, persistence, async cancellation, and accessibility semantics
- [ ] Validate this core-flow pass with TypeScript, lint, tests, and visual preview

## Language Extension — Dialect-Aware UI Pass

- [x] Review the attached Uyghur dialect and Chinese language scenarios for native UI relevance
- [x] Add typed, deterministic dialect metadata behind the existing language-selection boundary
- [x] Add a compact dialect-aware selection and fallback guidance surface without destabilizing translation
- [x] Preserve current mock translation, voice, OCR, history, and accessibility behavior
- [x] Validate the dialect-aware UI pass with TypeScript, lint, tests, and preview

## Language Extension — Intelligence and Phrase Suggestions

- [x] Add selected-dialect badge treatment to translation result metadata
- [x] Add deterministic dialect phrase suggestions to the Translate surface
- [x] Keep automatic dialect detection and dialect-preserving translation behind future service boundaries
- [x] Validate the latest attachment-driven UI pass with TypeScript, lint, tests, and preview

## Cultural Learning — Learn UI Pass

- [x] Fix the dialect phrase module-resolution error before further preview work
- [x] Add typed deterministic cultural learning cards for music, poetry, cuisine, and calligraphy
- [x] Add a compact cultural category rail and one-tap learning card interaction to Learn
- [x] Keep cultural content local and educational without importing unsupported media or social services
- [x] Validate the cultural Learn pass with TypeScript, lint, tests, and preview

## Design Integration — Cultural Detail Interaction Pass

- [x] Add reusable bilingual cultural detail-sheet state and close behavior
- [x] Add detail content for music, poetry, cuisine, and calligraphy cards
- [x] Improve Learn card touch feedback and accessible selected/detail announcements
- [x] Preserve local deterministic content and existing navigation behavior
- [x] Validate this interaction pass with TypeScript, lint, tests, and preview

## Design Integration — Learning Feedback and Accessibility Pass

- [x] Add completion feedback for cultural detail lessons without claiming persistent progress yet
- [x] Improve selected, pressed, and dismissed states across Learn interactions
- [x] Add reusable accessibility status messaging for sheet open and close actions
- [x] Preserve deterministic local content and current navigation behavior
- [x] Validate this pass with TypeScript, lint, tests, and preview

## Design Integration — Persistent Learning Progress Pass

- [x] Add local persistence for completed cultural lesson previews
- [x] Reflect completed cultural lessons in Learn progress and card states
- [x] Add reset-safe progress feedback without affecting translation history
- [ ] Resolve remaining shared interaction deprecation warnings where safe
- [x] Validate this pass with TypeScript, lint, tests, persistence checks, and preview

## Design Integration — Progress and Settings Polish Pass

- [x] Add a visible cultural progress summary to the Learn hero card
- [x] Add reset-progress controls to Settings with confirmation feedback
- [x] Improve Settings section hierarchy and bilingual preference labels
- [ ] Resolve remaining shared interaction deprecation warnings where safe
- [x] Validate this pass with TypeScript, lint, tests, persistence checks, and preview

## Design Integration — Confirmation and Motion Pass

- [x] Add a confirmation sheet before resetting cultural progress
- [x] Add subtle progress motion that respects reduced-motion-friendly behavior
- [ ] Improve shared interaction cleanup without changing native tab semantics
- [x] Preserve deterministic persistence and accessible status feedback
- [x] Validate this pass with TypeScript, lint, tests, persistence checks, and preview

## Design Integration — Accessibility and Progress Visibility Pass

- [x] Respect reduced-motion preferences for Learn progress animation
- [x] Add a compact cultural progress summary to Settings
- [ ] Improve shared interaction cleanup without changing native tab semantics
- [x] Preserve deterministic persistence and accessible status feedback
- [x] Validate this pass with TypeScript, lint, tests, persistence checks, and preview

## Design Integration — Interaction Consistency Pass
- [x] Add a visible reduced-motion status row to Settings
- [ ] Resolve remaining shared interaction deprecation warnings where safe
- [ ] Improve Learn completion indicators and detail-sheet affordances
- [x] Preserve deterministic persistence and current native tab semantics
- [x] Validate this pass with TypeScript, lint, tests, persistence checks, and preview
- [x] Add a distinctive bilingual bridge motif and slide-specific onboarding copy

## Code Refactor — Maintainability Pass

- [x] Extract reusable onboarding presentation components and typed slide data
- [x] Extract reusable Settings rows/sections and reduce inline render complexity
- [ ] Refactor shared interaction code without changing native tab semantics
- [x] Preserve translation, OCR, voice, persistence, and accessibility behavior
- [x] Validate the refactor with TypeScript, lint, tests, and preview

## Code Refactor — Component Extraction Pass

- [x] Extract reusable Settings rows and confirmation-sheet primitives
- [x] Extract reusable Learn category and cultural-card primitives
- [ ] Simplify shared interaction handling without changing native tab semantics
- [x] Preserve translation, OCR, voice, persistence, and accessibility behavior
- [x] Validate the refactor with TypeScript, lint, tests, and preview

## Code Refactor — Modal and Confirmation Pass

- [x] Extract a reusable bilingual detail-sheet primitive for Learn
- [x] Extract a reusable confirmation-sheet primitive for destructive actions
- [x] Simplify Learn detail rendering and keep accessibility semantics stable
- [x] Preserve translation, OCR, voice, persistence, and native tab behavior
- [x] Validate the refactor with TypeScript, lint, tests, and preview

## Code Refactor — Async Feedback and Warning Cleanup Pass

- [x] Extract a reusable async status announcement component
- [x] Consolidate repeated loading/error/success feedback presentation
- [x] Diagnose and safely reduce remaining React Native Web runtime warnings
- [x] Preserve translation, OCR, voice, persistence, accessibility, and tab behavior
- [x] Validate the refactor with TypeScript, lint, tests, and preview

## iOS App Store Readiness — Release Pass

- [x] Audit Expo app identity, bundle metadata, versioning, icons, splash, and permissions
- [x] Add production-safe iOS metadata and release configuration without changing the app slug
- [x] Add privacy/support/release documentation and a repeatable preflight validation script
- [x] Review user-facing failure states and remove development-only assumptions from production paths
- [x] Validate the release pass with TypeScript, lint, tests, Expo config inspection, and preview

## iOS App Store Readiness — Release Hardening Pass

- [ ] Diagnose and remove the remaining React Native Web text-node and pointer-events warnings
- [x] Add production-safe validation for release placeholders and owner-supplied metadata
- [x] Strengthen TestFlight and physical-device readiness documentation
- [x] Preserve iOS permissions, privacy manifest, local persistence, and core flows
- [x] Validate the hardening pass with TypeScript, lint, tests, Expo config, preflight, and preview

## iOS App Store Readiness — Final Submission Gates

- [x] Audit remaining React Native Web warnings against current source and dependencies; current pointer-events references are framework-owned and text-node warnings remain under follow-up
- [x] Add a strict release metadata audit for unresolved owner placeholders
- [x] Document the exact manual App Store Connect and TestFlight gates
- [x] Preserve production configuration, privacy manifest, permissions, and core flows
- [x] Validate the final pass with TypeScript, lint, tests, Expo config, preflight, and preview

## iOS App Store Readiness — Production Gate Pass

- [x] Add a release artifact and versioning audit to the preflight workflow
- [x] Make owner-supplied support/privacy metadata gates explicit and actionable
- [x] Verify icon, splash, privacy-manifest, permissions, and EAS production profile inputs
- [x] Preserve translation, OCR, voice, history, Learn, and accessibility behavior
- [x] Validate the pass with TypeScript, lint, tests, Expo config, preflight, and preview

## iOS App Store Readiness — Final Production Quality Pass

- [x] Audit release configuration for hidden placeholders, unstable identifiers, and production-only assumptions
- [x] Add a concise release manifest that records the exact app identity, version, build, permissions, and profiles
- [x] Verify privacy-policy, support, review-notes, and device-test documentation are internally consistent
- [x] Preserve translation, OCR, voice, history, Learn, persistence, and accessibility behavior
- [x] Validate the final pass with TypeScript, lint, tests, Expo config, strict preflight, and preview

## Code Improvement — Shared Utility and Type-Safety Pass

- [x] Audit repeated local persistence and async lifecycle helpers
- [x] Extract one high-value shared utility without changing behavior
- [ ] Reduce screen-level type and callback duplication
- [x] Preserve translation, OCR, voice, history, Learn, accessibility, and iOS release behavior
- [ ] Validate the pass with TypeScript, lint, tests, and preview; TypeScript, lint, and tests pass, while preview capture was unavailable after a memory-pressure restart

## Code Improvement — Translation Flow Refactor

- [x] Audit repeated translation, cancellation, and status-transition logic
- [x] Extract typed translation request and result helpers without changing behavior
- [x] Reduce Translate screen callback complexity while preserving voice and OCR coordination
- [x] Preserve persistence, accessibility, and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Voice Lifecycle Pass

- [x] Audit repeated voice cleanup and retry state transitions
- [x] Extract typed lifecycle cleanup helpers without changing UI semantics
- [x] Reduce Translate callback duplication while preserving cancellation and playback coordination
- [x] Preserve persistence, accessibility, and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Playback Pass

- [x] Audit repeated speech stop, pause, resume, and channel cleanup logic
- [x] Extract typed playback cleanup helpers without changing user-visible behavior
- [x] Preserve stale-playback invalidation, voice handoff, accessibility, and persistence
- [x] Preserve iOS release configuration and core translation behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Request Lifecycle Pass

- [x] Audit repeated translation request cancellation and stale-result guards
- [x] Extract typed request lifecycle helpers without changing user-visible behavior
- [x] Reduce Translate request callback complexity while preserving history persistence
- [x] Preserve voice, OCR, accessibility, and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Rapid Request and Reset Safety Pass

- [x] Add deterministic tests for rapid successive translations and reset-during-request behavior
- [x] Extract typed Translate presentation helpers without changing UI semantics
- [x] Reduce remaining Translate screen callback and formatting duplication
- [x] Preserve voice, OCR, persistence, accessibility, and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Presentation Boundaries

- [x] Extract a typed source-input panel component
- [x] Extract a typed translation-result panel component
- [x] Preserve voice, OCR, playback, status, accessibility, and reset semantics
- [x] Reduce Translate screen markup and style coupling
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Voice Controls

- [x] Extract a typed voice-control group component
- [x] Preserve voice lifecycle, playback coordination, status, and accessibility semantics
- [x] Reduce Translate screen control markup and style coupling
- [x] Preserve persistence and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Readiness Metadata

- [x] Extract a typed voice-readiness metadata component
- [x] Preserve bilingual status, lifecycle, channel, and accessibility announcements
- [x] Reduce Translate screen metadata markup and style coupling
- [x] Preserve persistence and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Voice Settings

- [x] Extract a typed voice-settings panel component
- [x] Preserve persisted speech-rate and voice-profile behavior
- [x] Preserve bilingual labels, accessibility states, and haptic interactions
- [x] Reduce Translate screen settings markup and style coupling
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Code Improvement — Translate Actions and Status

- [x] Extract a typed translation action bar component
- [x] Extract a typed status and readiness presentation component where useful
- [x] Preserve clear, translate, voice, playback, and review action semantics
- [x] Preserve accessibility announcements, persistence, and iOS release behavior
- [x] Validate the pass with TypeScript, lint, tests, and preview

## Expo and Apple App Store — Final Completion Pass

- [x] Audit final Expo config, EAS profiles, release manifest, assets, permissions, and privacy declarations
- [x] Close remaining technical release blockers by adding native camera capture, iOS camera permission text, Expo Camera config, and strict camera-aware safeguards
- [x] Verify production build commands and owner-facing App Store Connect instructions
- [x] Preserve translation, OCR, voice, history, Learn, persistence, accessibility, and release behavior
- [x] Validate with strict preflight, TypeScript, lint, tests, artifact checks, and preview; strict mode intentionally fails only on unresolved owner support/privacy placeholders

## Expo and Apple App Store — Final Audit Pass

- [x] Audit current release checkpoint, Expo config, EAS profiles, assets, permissions, and owner gates
- [x] Close remaining technical safeguards without publishing or submitting
- [x] Verify exact production build and submit commands remain consistent with documentation
- [x] Preserve translation, OCR, voice, history, Learn, persistence, accessibility, and iOS behavior
- [x] Validate strict preflight, Expo public config, TypeScript, lint, tests, artifacts, and preview; strict mode remains blocked only by owner support/privacy placeholders

## Expo and Apple App Store — Final Publish Readiness Pass

- [x] Audit the latest checkpoint, service logs, Expo config, EAS profiles, and strict release gates
- [x] Recover the development server and address any actionable runtime or configuration failures; Metro/API services recovered successfully
- [x] Run TypeScript, lint, tests, normal preflight, strict preflight, Expo config, artifact, and preview validation; all technical checks pass and strict mode reports only owner placeholders
- [x] Confirm the exact owner actions required before EAS build and App Store submission: provide a real support email, publish the privacy-policy URL, complete physical-device testing, and finish App Store Connect declarations
- [x] Save a final checkpoint without publishing or submitting

## Expo and Apple App Store — Final Release Audit Pass

- [x] Audit current release configuration, service logs, and owner gates
- [x] Address actionable technical warnings without changing product behavior; removed eight unused imports/helpers and confirmed no source-owned pointerEvents usage
- [x] Re-run deterministic validation and preview checks; TypeScript, lint, tests, normal preflight, and artifact checks pass; strict mode reports only owner placeholders; preview service recovers but screenshot capture remains intermittent
- [x] Save a final publish-readiness checkpoint without publishing or submitting

## Expo and Apple App Store — Final Focused Release Pass

- [x] Audit the latest checkpoint, release configuration, service logs, and remaining owner gates
- [x] Resolve any remaining safe technical issue without changing product behavior; no source-owned issues remain, and the transient preview `Premature close` is managed-service behavior
- [x] Run final deterministic, Expo config, artifact, and preview validation; TypeScript, lint, tests, normal preflight, Expo config, and artifacts pass; strict mode reports only owner placeholders
- [x] Save a final publish-ready checkpoint without publishing or submitting

## Expo SDK 54 Compatibility Alignment
- [x] Complete the Expo SDK 54 compatible dependency update
- [x] Add dynamic-config plugins required by the updated Expo packages (`expo-font` and `expo-web-browser`)
- [x] Recover the managed development server after dependency installation
- [x] Re-run all release validation and save a checkpoint; dependency alignment, TypeScript, lint, tests, normal preflight, Expo config, and artifacts pass; strict mode remains blocked only by owner placeholders


## Bug Fix — Current Error Report
- [x] Inspect current TypeScript, lint, test, Expo, and service-log errors
- [x] Apply targeted fixes without regressing translation, voice, OCR, persistence, or release configuration; renamed the ESM ESLint config to `eslint.config.mjs` and removed the Node module-type warning
- [x] Rerun focused regression and release checks; TypeScript, lint, tests, Expo dependency alignment, Expo config, normal preflight, and artifacts pass; strict preflight reports only the two owner metadata placeholders


## Bug Fix — Latest Error Report
- [x] Inspect current TypeScript, lint, test, Expo, and service-log errors
- [x] Apply targeted fixes without regressing core translation or release behavior; removed concurrently’s kill-all behavior so a transient Metro exit cannot terminate the API server
- [x] Rerun focused regression and release validation; TypeScript, lint, tests, Expo dependency alignment, Expo config, normal preflight, and artifacts pass; strict preflight reports only owner metadata placeholders; current services remain running


## Bug Fix — Repeated Error Report
- [x] Inspect current TypeScript, lint, test, Expo, and service-log errors
- [x] Apply targeted fixes without regressing core translation, OCR, voice, persistence, or release behavior; no additional source error was found after the resilient dev-process fix
- [x] Rerun focused regression and release validation; TypeScript, lint, tests, Expo dependency alignment, and Expo config pass; service processes remain active; only the upstream pointerEvents warning and owner metadata gates remain


## Error Handling Hardening — Latest Request

- [ ] Audit translation, voice, OCR, storage, API, and service failure paths
- [ ] Add safe fallbacks, cancellation guards, and user-facing recovery states
- [ ] Add deterministic tests for new error paths and rerun release validation

## Error Handling Hardening — Current Pass

- [x] Audit translation, voice, OCR, onboarding, storage, history, settings, and service failure paths
- [x] Add cross-platform abort normalization and abort-aware translation, voice, and OCR cancellation with cleanup
- [x] Add camera permission/capture recovery, microphone readiness fallback, speech-start recovery, safe haptic handling, and onboarding save-error feedback
- [x] Surface degraded local persistence status in History, Settings, Learn, and Translate voice preferences
- [x] Add deterministic negative-path tests for unknown errors, offline classification, immediate cancellation, and in-flight translation cancellation
- [x] Run TypeScript, lint, tests, Expo dependency alignment, normal/strict iOS preflight, Expo config, and artifact checks; strict mode remains blocked only by owner support/privacy placeholders; preview screenshot capture remains intermittent
- [x] Save a checkpoint for this error-handling pass


## Error Handling Hardening — Latest Pass

- [x] Inspect current reproducible checks and managed-service logs
- [x] Add shared cross-platform error normalization and native-safe cancellation handling
- [x] Add recovery states for camera permissions/capture, microphone readiness, speech startup, onboarding persistence, and history/settings persistence
- [x] Remove remaining raw onboarding storage access and prevent haptic promise rejections
- [x] Add deterministic negative-path coverage for unknown errors, offline classification, immediate cancellation, and in-flight translation cancellation
- [x] Resolve introduced compile/lint issues and rerun TypeScript, lint, tests, Expo alignment, normal/strict iOS preflight, public Expo config, and artifact checks
- [x] Save a checkpoint for the latest error-handling pass


## Error Handling Hardening — Latest Pass

- [x] Audit current source, tests, active app async paths, and managed service logs
- [x] Confirm no source-owned pointerEvents or browser-only DOMException usage remains
- [x] Route onboarding startup reads through resilient storage and surface history-clear persistence degradation in Settings
- [x] Preserve safe cancellation, native permission recovery, storage feedback, haptic rejection handling, and stale-request protection from prior passes
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal/strict iOS preflight, public Expo config, and artifact checks; strict mode reports only the two owner metadata placeholders
- [x] Save a checkpoint for the latest error-handling pass


## Error Handling Hardening — Auth Cache Pass

- [x] Audit current checks, app async paths, and managed service logs
- [x] Fix the unhandled native cached-user promise and guard against auth state updates after unmount
- [x] Preserve resilient storage, cancellation, permission, speech, haptic, and persistence recovery from prior passes
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the auth-cache error-handling pass


## Error Handling Hardening — Lifecycle Pass

- [x] Audit current source, tests, active async paths, and managed service state
- [x] Guard voice-preference writes against stale results and unmounted screens
- [x] Guard Settings hydration/progress reads and abort OCR work on screen unmount
- [x] Preserve auth-cache, storage, cancellation, permission, speech, haptic, and persistence recovery from earlier passes
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the lifecycle error-handling pass


## Error Handling Hardening — Confirmation Pass

- [x] Audit current source, tests, async paths, and managed service state
- [x] Add a reusable confirmation busy state that disables duplicate destructive actions and communicates progress
- [x] Guard cultural-progress reset completion and failure updates against unmounted Settings screens
- [x] Preserve all prior auth-cache, storage, cancellation, permission, speech, haptic, OCR, and translation recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the confirmation error-handling pass


## Error Handling Hardening — Post-save Lifecycle Pass

- [x] Audit current source, tests, async paths, and managed service state
- [x] Guard Learn lesson completion feedback against unmounted screens after persistence awaits
- [x] Guard Settings preference-save feedback against unmounted screens after persistence awaits
- [x] Preserve confirmation busy-state, auth-cache, storage, cancellation, permission, speech, haptic, OCR, and translation recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the post-save lifecycle pass


## Error Handling Hardening — Accessibility Pass

- [x] Audit current source, tests, active async paths, and managed service state
- [x] Guard reduce-motion event callbacks in Learn and Settings against unmounted screens
- [x] Preserve confirmation busy-state, auth-cache, storage, cancellation, permission, speech, haptic, OCR, translation, and post-save lifecycle recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the accessibility error-handling pass


## Error Handling Hardening — Persistence Queue Pass

- [x] Audit current source, tests, active async paths, and managed service state
- [x] Serialize translation-history persistence writes so rapid favorites, deletes, and clears cannot persist stale snapshots out of order
- [x] Keep stale persistence status callbacks from replacing newer success or failure state
- [x] Preserve accessibility, confirmation busy-state, auth-cache, storage, cancellation, permission, speech, haptic, OCR, translation, and lifecycle recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the persistence-queue error-handling pass


## Error Handling Hardening — OCR Action Pass

- [x] Audit current source, tests, active async paths, and managed service state
- [x] Prevent rapid duplicate OCR scans and reviewed-text translations from racing native or mock operations
- [x] Release the OCR in-flight guard immediately when users cancel active work
- [x] Preserve serialized history persistence, accessibility, confirmation, auth-cache, storage, permission, speech, haptic, translation, and lifecycle recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the OCR action error-handling pass


## Error Handling Hardening — Root Recovery Pass

- [x] Audit current source, tests, active async paths, and managed service state
- [x] Add an accessible app-level error boundary with a local retry action instead of a blank screen after unexpected render failures
- [x] Keep render failures isolated from feature-level recovery and preserve saved translation data in the fallback message
- [x] Preserve OCR duplicate-action protection, serialized history persistence, accessibility lifecycle guards, auth-cache recovery, permission, speech, haptic, and translation safeguards
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the root recovery pass


## Error Handling Hardening — New Pass

- [x] Audit current validation, async failure paths, and managed-service logs
- [x] Identify and fix a remaining actionable source-level error or recovery gap
- [x] Add deterministic coverage for the new recovery behavior where practical; existing negative-path coverage remains passing
- [x] Run TypeScript, lint, tests, Expo alignment, iOS preflight, config, and artifact checks
- [x] Save a checkpoint for this error-handling pass


## Error Handling Hardening — Startup Recovery Pass

- [x] Audit current validation, app async paths, and managed service state
- [x] Add safe fallback handling around Manus runtime initialization, onboarding routing, and safe-area subscription setup
- [x] Keep unexpected render failures covered by the accessible root recovery boundary with retry
- [x] Preserve OCR duplicate-action protection, serialized history persistence, accessibility lifecycle guards, auth-cache, permissions, speech, haptics, and translation recovery
- [x] Run TypeScript, lint, 30 tests, Expo dependency alignment, normal iOS preflight, public Expo config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for the startup-recovery pass


## Code Quality Improvement — Current Pass

- [x] Audit current code quality, async behavior, accessibility, and release state
- [x] Implement safe maintainability or resilience improvements without changing product behavior
- [x] Add or extend deterministic validation where practical; existing negative-path coverage remains passing
- [x] Run TypeScript, lint, tests, Expo alignment, release preflight, config, and artifact checks
- [x] Save a checkpoint for this code-improvement pass


## Code Quality Improvement — Recovery Retry Pass

- [x] Audit current code quality, async behavior, accessibility, and release state
- [x] Make the root error-boundary retry remount the navigation subtree so transient runtime failures can actually reconnect
- [x] Add safe RootLayout startup fallbacks for runtime initialization, onboarding routing, and safe-area subscription failures
- [x] Preserve OCR duplicate-action protection, serialized persistence, lifecycle guards, and feature-level recovery
- [x] Run TypeScript, lint, 30 tests, Expo alignment, normal iOS preflight, public config, and artifact checks; strict mode reports only owner support/privacy placeholders
- [x] Save a checkpoint for this code-improvement pass


## Code Quality Improvement — Latest Pass

- [x] Audit current code quality, lifecycle behavior, accessibility, and release state
- [x] Implement safe maintainability or reliability improvements without changing product behavior
- [x] Add or extend deterministic validation where practical; existing negative-path coverage remains passing
- [x] Run TypeScript, lint, tests, Expo alignment, release preflight, config, and artifact checks
- [x] Save a checkpoint for this code-quality pass


## Code Quality Improvement — OAuth Recovery Pass

- [x] Audit current code quality, lifecycle behavior, accessibility, and release state
- [x] Guard OAuth callback status and error updates after unmount
- [x] Cancel delayed OAuth redirects during cleanup and show a recoverable navigation error when routing fails
- [x] Preserve root retry remounting, startup fallbacks, OCR duplicate-action protection, serialized persistence, and feature recovery
- [x] Run TypeScript, lint, 30 tests, Expo alignment, normal iOS preflight, public config, and artifact checks; strict mode reports only support/privacy owner placeholders
- [x] Save a checkpoint for this code-quality pass

## Code Quality Improvement — Defensive Storage Fallbacks

- [x] Make resilient JSON storage reads return explicit caller-provided defaults even if a parser unexpectedly fails
- [x] Update persistence callers and tests without changing normal behavior
- [x] Re-run the complete validation suite and save a checkpoint


## Code Quality Improvement — OCR Scan Lock Recovery

- [x] Prevent OCR scan state from remaining permanently busy when camera capture returns no frame
- [x] Guard camera permission and capture continuations after screen unmount
- [x] Add deterministic regression coverage where practical and rerun validation; native CameraView paths remain covered by static checks while service and persistence regressions remain deterministic


## Code Quality Improvement — Voice Callback Lifecycle

- [x] Prevent late voice-capture callbacks from updating Translate after unmount
- [x] Keep cancellation and error paths consistent while preserving current voice UX
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Onboarding Completion Lifecycle

- [x] Prevent onboarding completion persistence from updating state or navigating after unmount
- [x] Preserve duplicate-tap protection and visible degraded-storage recovery
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Learn Animation Cleanup

- [x] Stop Learn progress animations during effect cleanup to avoid stale native animation work
- [x] Preserve reduced-motion behavior and progress rendering
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Production Runtime Logging

- [x] Disable verbose Manus runtime logging in production builds while retaining development diagnostics
- [x] Preserve preview iframe messaging behavior
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Startup Routing Lifecycle

- [x] Prevent delayed onboarding routing from navigating after RootLayout unmounts
- [x] Preserve safe fallback routing when storage or the runtime bridge is unavailable
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Auth Refresh Lifecycle

- [x] Prevent delayed auth refresh results from updating state after the hook unmounts
- [x] Preserve cached-user startup behavior and logout cleanup
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — OCR Permission Cancellation

- [x] Invalidate an in-progress camera permission request when the user taps Cancel
- [x] Prevent late permission results from moving OCR back into a scan or error state
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Auth Production Diagnostics

- [x] Restrict verbose auth lifecycle logs to development builds
- [x] Preserve production error reporting and auth behavior
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Auth Refresh Race Safety

- [x] Prevent overlapping auth refreshes from allowing an older response to overwrite newer session state
- [x] Preserve cached-user startup behavior and lifecycle guards
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Translate Timer Callbacks

- [x] Guard voice-duration and speech-playback timer callbacks against late queued updates after cleanup
- [x] Preserve elapsed-time display and interval cleanup behavior
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Logout Refresh Invalidation

- [x] Invalidate active auth refresh requests when logout begins
- [x] Prevent a late session lookup from restoring a user after logout completes
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Speech Pause/Resume Errors

- [x] Guard delayed Speech.pause and Speech.resume errors from updating Translate after unmount
- [x] Preserve device-specific pause/resume feedback
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — OCR Translation Lifecycle

- [x] Guard reviewed-text translation success and error callbacks after OCR unmount
- [x] Preserve cancellation behavior and saved translation history
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Speech Control Race Safety

- [x] Prevent a late pause or resume failure from an older playback session overwriting newer playback state
- [x] Preserve current device-specific playback feedback and lifecycle guards
- [x] Run deterministic validation and save a checkpoint


## Code Quality Improvement — Speech Restart Timer

- [x] Prevent a queued speech-restart timer from starting playback after Translate unmounts
- [x] Preserve restart behavior and timer cancellation on reset or navigation
- [x] Run deterministic validation and save a checkpoint


## Onboarding Improvement — Guided First Run

- [x] Audit onboarding step transitions, progress indicators, accessibility labels, and completion feedback
- [x] Improve onboarding progression clarity and interaction feedback without changing the established route contract
- [x] Preserve lifecycle-safe persistence, duplicate-tap protection, and retryable storage recovery
- [x] Add or extend deterministic validation where practical; existing deterministic persistence and service coverage remains passing
- [x] Run complete release validation and save an onboarding checkpoint


## Demo Mode — Deterministic Mock Data

- [x] Audit existing mock service boundaries and choose a safe demo-mode entry point
- [x] Add a clearly labeled local demo mode with deterministic translation, voice, OCR, history, and learning content; existing mock service boundaries remain unchanged and local sample history is seeded on opt-in
- [x] Keep demo mode isolated from production behavior and avoid shipping owner metadata changes
- [x] Add or extend deterministic validation for demo-mode behavior
- [x] Run complete release validation and save a demo-mode checkpoint


## Error Fix Pass — Current Runtime and Source Checks

- [x] Inspect current project logs, source checks, and tests for actionable source-owned errors
- [x] Apply targeted fixes without changing stable product behavior; removed the source-owned ThemeProvider debug log
- [x] Add or extend deterministic regression coverage where practical; existing 34-test suite remains passing
- [x] Run complete validation and save a repaired checkpoint


## Error Fix Pass — Latest Runtime Audit

- [x] Inspect current runtime logs, source warnings, and validation state for actionable errors
- [x] Apply targeted source-owned fixes without changing stable behavior; routed OAuth callback diagnostics through the development-only logger
- [x] Add or extend deterministic regression coverage where practical; existing 34-test suite remains passing
- [x] Run complete validation and save a repaired checkpoint


## Error Fix Pass — Latest Source Audit
- [x] Inspect current runtime logs, source warnings, and validation state for actionable errors
- [x] Apply targeted source-owned fixes without changing stable behavior; consolidated auth and Manus runtime diagnostics through the shared development-only logger
- [x] Add or extend deterministic regression coverage where practical; existing 34-test suite remains passing
- [x] Run complete validation and save a repaired checkpoint

## Error Fix Pass — Preview Process Lifecycle
- [x] Inspect fresh runtime diagnostics, validation output, and active project processes
- [x] Remove stale Expo tunnel workers consuming memory and causing intermittent preview instability
- [x] Restore coordinated `concurrently -k` shutdown so Metro and the API server cannot become orphaned
- [x] Enable and repair the authenticated logout regression test by supplying the Express hostname in its request fixture
- [x] Rerun validation and save a repaired checkpoint; 35 deterministic tests, TypeScript, lint, build, dependency alignment, and normal iOS preflight pass

## Error Fix Pass — Cookie Host Resilience
- [x] Inspect fresh runtime warnings and reproduce the authenticated logout failure
- [x] Harden cookie-domain resolution when request hostname data is unavailable
- [x] Add deterministic regression coverage for the missing-host fallback
- [x] Rerun validation; 36 deterministic tests, TypeScript, lint, build, dependency alignment, and normal iOS preflight pass

## Error Fix Pass — API Startup Failure Reporting
- [x] Inspect current runtime startup behavior and confirm the preview renders successfully
- [x] Make API startup failures log contextual information and set a nonzero process exit code
- [x] Preserve healthy startup behavior and verify the API and Expo preview after restart
- [x] Rerun validation; 36 deterministic tests, TypeScript, lint, build, dependency alignment, normal iOS preflight, and preview capture pass

## Error Fix Pass — Async Listen Failure Propagation
- [x] Inspect fresh startup logs and confirm the preview remains stable
- [x] Route asynchronous HTTP server listen errors through the startup rejection path with listener cleanup
- [x] Preserve successful API startup and Expo preview rendering
- [x] Rerun validation; 36 deterministic tests, TypeScript, lint, build, dependency alignment, normal iOS preflight, and preview capture pass

## Error Fix Pass — Port Probe Cleanup
- [x] Inspect fresh startup diagnostics and verify no new fatal runtime errors
- [x] Clean up port-probe listeners on both bind failure and close failure paths
- [x] Preserve successful API startup and Expo preview rendering
- [x] Rerun validation; 36 deterministic tests, TypeScript, lint, build, dependency alignment, normal iOS preflight, and preview capture pass

## Error Fix Pass — Final Warning Audit
- [x] Audit all project-owned pointerEvents references and prop-forwarding call sites
- [x] Verify the preview remains reachable and no fresh fatal runtime errors are emitted
- [x] Confirm the remaining pointerEvents warning is not present in project source and is emitted by react-native-web upstream
- [x] Remove the stale TypeScript watch process left by preview checks to reduce memory pressure
- [x] Rerun final validation; 36 deterministic tests, TypeScript, Expo alignment, and normal iOS preflight pass

## Error Fix Pass — Latest Runtime Confirmation
- [x] Inspect the newest managed-preview log entries and active process state
- [x] Confirm no new fatal API, Metro, TypeScript, or test errors after the latest preview reload
- [x] Preserve the stable source state and document the remaining upstream warning and owner-gated strict checks
- [x] Complete the final validation record and checkpoint

## Error Fix Pass — Current Error Confirmation
- [x] Inspect the newest preview reload after the latest checkpoint
- [x] Confirm the only recurring diagnostic is the upstream react-native-web pointerEvents warning
- [x] Confirm no source-owned fatal errors or new process failures are present
- [x] Record the stable release-candidate state for the next checkpoint

## Code Improvement — Bounded Heartbeat Requests
- [x] Audit external server calls for unbounded waits
- [x] Add a 15-second timeout and explicit timeout error message to heartbeat service requests
- [x] Add deterministic regression coverage for timeout propagation
- [x] Normalize malformed successful responses into explicit internal errors
- [x] Add deterministic regression coverage for malformed response handling
- [x] Rerun validation; 38 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass

## Code Improvement — Bounded Data API Requests
- [x] Audit the Data API helper for unbounded network waits and silent JSON fallbacks
- [x] Add a 15-second timeout and explicit network/timeout error normalization
- [x] Reject malformed successful responses with a clear error instead of returning an empty object
- [x] Add deterministic regression coverage for timeout and malformed-response handling
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 40 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass

## Code Improvement — Bounded Owner Notifications
- [x] Audit owner notification delivery for unbounded upstream waits
- [x] Add a 15-second timeout while preserving the existing boolean fallback contract
- [x] Improve timeout diagnostics without changing notification validation or non-2xx behavior
- [x] Add deterministic regression coverage for timeout and rejected upstream responses
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 42 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass

## Code Improvement — Defensive Image Generation
- [x] Audit image-generation and model-list requests for unbounded waits and weak payload validation
- [x] Add bounded timeouts for image generation and model discovery requests
- [x] Normalize network and malformed JSON failures with clear errors
- [x] Reject empty or structurally invalid image and model payloads before storage or UI use
- [x] Add deterministic regression coverage for timeout and malformed payload handling
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 46 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass

## Code Improvement — Defensive Storage Operations
- [x] Audit presign, S3 upload, and signed-URL requests for unbounded waits and weak URL validation
- [x] Add bounded timeouts for presign, upload, and signed-URL operations
- [x] Normalize network and malformed JSON failures with clear errors
- [x] Reject empty presign and signed URLs before continuing storage work
- [x] Add deterministic regression coverage for presign, upload, and signed-URL failure paths
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 50 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass

## Code Improvement — Defensive LLM Requests
- [x] Audit LLM completion and model-list requests for unbounded waits and weak response validation
- [x] Add per-attempt request timeouts while preserving existing retry behavior for non-timeout failures
- [x] Normalize timeout and malformed-JSON failures with clear errors
- [x] Reject completion payloads without choices and model lists without data arrays
- [x] Add deterministic regression coverage for timeout and malformed-response handling
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 54 deterministic tests, TypeScript, lint, build, Expo alignment, normal iOS preflight, and preview capture pass



## UX Improvement — OCR and Voice Processing Feedback
- [x] Audit OCR and voice processing screens for unclear or missing long-operation feedback
- [x] Add animated loading indicators and clear processing status messages
- [x] Add accessible live-region semantics, labels, and reduced-motion-safe behavior
- [x] Preserve lifecycle guards, cancellation, retry, and error recovery behavior
- [x] Add deterministic regression coverage for OCR and voice processing status copy
- [x] Run validation; 56 deterministic tests, TypeScript, lint, production build, and preview capture pass

## Code Improvement — Degraded Translation History Reads
- [x] Audit translation-history hydration for silent storage failures
- [x] Add an opt-in read result that preserves safe fallback values while reporting storage or parse degradation
- [x] Surface degraded hydration through the translation store’s existing persistence status and error message
- [x] Add deterministic coverage for unavailable storage and malformed persisted history
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 58 deterministic tests, TypeScript, lint, production build, and preview capture pass

## Code Improvement — Accurate Empty History State
- [x] Audit history rendering for placeholder entries that can hide a genuinely empty phrasebook
- [x] Remove fallback sample rows from the production history screen while preserving opted-in demo mode data
- [x] Add deterministic coverage for empty and chronologically sorted history rendering
- [x] Run validation; 60 deterministic tests, TypeScript, lint, production build, and HTTP 200 preview check pass

## Accessibility Improvement — Async Status Announcements
- [x] Audit shared AsyncStatus announcements across persistence and recovery screens
- [x] Add semantic accessibility roles for error and informational status messages
- [x] Preserve polite live updates and visual tone styling
- [x] Add deterministic coverage for status-role selection
- [x] Stop stale TypeScript watch processes after validation to reduce memory pressure
- [x] Rerun validation; 62 deterministic tests, TypeScript, lint, production build, and preview capture pass

## Accessibility Improvement — Async Status Announcements (superseded duplicate entry)
- [x] Audit shared AsyncStatus announcements across persistence and recovery screens; completed in the preceding entry
- [x] Add semantic accessibility roles for error and informational status messages; completed in the preceding entry
- [x] Preserve polite live updates and visual tone styling; completed in the preceding entry
- [x] Add deterministic coverage for status-role selection; completed in the preceding entry
- [x] Run validation and save a checkpoint; completed in the preceding entry

## Code Improvement — Learn Practice CTA
- [x] Make the Learn quick-review CTA perform a real action instead of ending in a dead end
- [x] Let the CTA open Translate with one saved phrase when history exists, while keeping a clear fallback for an empty phrasebook
- [x] Add deterministic tests for practice-route payload and empty-history behavior
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed practice-flow pass

## Code Improvement — Learn Persistence Recovery
- [x] Surface degraded Learn progress hydration through the existing accessible status component
- [x] Preserve in-memory progress and completion behavior when local storage is unavailable or malformed
- [x] Add deterministic regression tests for Learn progress parse and hydration degradation
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed persistence-recovery pass

## Code Improvement — Voice Preference Persistence Recovery
- [x] Surface degraded voice-preference hydration through an accessible error status
- [x] Preserve session-level voice settings when local storage is unavailable or malformed
- [x] Add deterministic regression tests for voice-preference normalization and persistence messaging
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed voice-preference recovery pass

## Code Improvement — Settings Preference Truthfulness
- [x] Make Save translation history control whether new text, voice, and OCR translations enter persistent history
- [x] Make Settings hydration and save failures visible through accessible status feedback
- [x] Keep current-session translations usable when history persistence is disabled or unavailable
- [x] Add deterministic tests for settings normalization and history-persistence gating
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed Settings truthfulness pass

## UX Improvement — Home Settings Navigation
- [x] Replace the Home Settings dead-end notice with navigation to the real Settings screen
- [x] Preserve pressed-state and screen-reader semantics for the navigation action
- [x] Add deterministic coverage for the Home Settings route target
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed Home navigation pass

## UX Improvement — Session-only History Indicator
- [x] Show a clear Translate-screen notice when history saving is disabled
- [x] Keep the notice accessible and synchronized with the shared Settings preference
- [x] Add deterministic coverage for session-only history messaging
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed session-only indicator pass

## UX Improvement — Settings Persistence Retry
- [x] Add an explicit retry action after a Settings preference save fails
- [x] Preserve the latest in-session Settings values while retrying persistence
- [x] Keep retry feedback accessible and prevent duplicate retry submissions
- [x] Add deterministic coverage for retry-state copy and behavior helpers
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed Settings retry pass

## Code Improvement — Settings Progress Refresh Lifecycle
- [x] Stop unrelated status messages from retriggering cultural-progress storage reads
- [x] Refresh cultural progress explicitly after a successful reset without changing visible feedback
- [x] Preserve mounted-screen guards and existing reset recovery behavior
- [x] Keep existing deterministic Learn-progress storage coverage authoritative for the refresh path
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed progress-refresh lifecycle pass

## Bug Fix — Session-only History Persistence
- [x] Keep new translations visible in the current session when history saving is disabled
- [x] Exclude session-only entries from device persistence and restore only saved entries on reload
- [x] Preserve favorite, clear, duplicate, and demo-mode behavior across both entry types
- [x] Add deterministic tests for session-only history serialization and store gating
- [x] Run TypeScript, lint, tests, production build, and preview verification
- [x] Save a checkpoint for the completed session-only persistence fix

## Reliability Improvement — Error Recovery and Fallback Mock Data
- [x] Audit translation, voice, OCR, storage, and app-boundary error paths for missing or misleading recovery states
- [x] Add deterministic fallback mock data for eligible local/demo flows without replacing successful real responses
- [x] Add bounded retry and user-facing recovery copy where failures can be safely retried
- [x] Preserve clear distinction between demo fallback, offline/session-only behavior, and real service errors
- [x] Add deterministic regression coverage for normalized errors, fallback selection, and retry behavior
- [x] Run TypeScript, lint, tests, production build, iOS preflight, and preview verification
- [x] Save a checkpoint for the completed error-recovery pass

## Reliability Improvement — Fallback Provenance Transparency
- [x] Preserve fallback provenance on new translation history entries without breaking legacy records
- [x] Show an accessible fallback-used label in History while keeping normal saved entries unchanged
- [x] Keep session-only persistence filtering compatible with fallback metadata
- [x] Add deterministic tests for provenance normalization and History copy
- [x] Run TypeScript, lint, tests, production build, iOS preflight, and preview verification
- [x] Save a checkpoint for the completed fallback-transparency pass

## Reliability Improvement — Result Recovery Indicators
- [x] Show a clear fallback-used indicator on Translate and OCR result surfaces
- [x] Keep service failure, cancellation, permission, and fallback recovery states distinct
- [x] Preserve legacy translation entries and existing session-only persistence behavior
- [x] Add deterministic tests for result recovery labels and safe fallback data
- [x] Run TypeScript, lint, tests, production build, iOS preflight, and preview verification
- [x] Save a checkpoint for the completed result-recovery indicator pass

## Distribution Handoff — Durable Manus Link and QR
- [x] Confirm the current public Manus domain and Expo project identifiers
- [x] Prepare a QR artifact for the durable public web surface with clear labeling
- [ ] Verify the public URL responds and the QR decodes to the intended payload; the domain currently returns Manus `HTTP 503` maintenance and no QR decoder is installed in the sandbox
- [x] Document why an Expo Go development QR cannot be permanent and what EAS/App Store distribution requires

## Media Deliverable — KAMRAN Product Demo Video
- [x] Inspect authentic KAMRAN screens and select implemented flows for the walkthrough
- [x] Prepare a reusable 1–3 minute storyboard grounded in real app capabilities
- [x] Generate a polished 16:9 MP4 with device framing and restrained callouts (deterministic authentic-screen fallback used after the AI video quota was reached)
- [x] Perform a lightweight acceptance review for legibility and factual fidelity
- [x] Deliver the final MP4 and concise storyboard notes

## Release Candidate — Preview and Product Demo Follow-up
- [x] Confirm the current web preview has no project-owned Unexpected text node errors
- [x] Capture the implemented KAMRAN routes at mobile size for release-candidate verification
- [x] Generate the polished 1–3 minute KAMRAN product-demo MP4 from the approved storyboard (deterministic authentic-screen fallback used after the AI video quota was reached)
- [x] Perform a lightweight demo acceptance review for factual fidelity and legibility
- [ ] Record remaining owner-supplied iOS support email and privacy URL blockers

## Media Deliverable — Portrait Mobile Mockup Revision
- [x] Inspect the available authentic mobile mockup screenshots and select the route sequence
- [x] Build portrait device-framed scenes from the mobile mockup screenshots
- [x] Export a polished screenshot-based MP4 using the portrait mockup composition
- [x] Review the revised MP4 for framing, legibility, and factual fidelity
- [x] Deliver the revised mobile-mockup video
