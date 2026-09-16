# KAMRAN iOS Release Checklist

## Before the first production build

Confirm the Apple Developer account, App Store Connect app record, bundle identifier, support URL, privacy-policy URL, contact details, age rating, export-compliance answers, and App Privacy answers. Replace every `REPLACE_WITH_` placeholder in the submission documents. Prepare the required iPhone screenshots for the portrait-first release.

## Build configuration

Run `pnpm ios:preflight` during development and `pnpm ios:preflight:strict` before submission. The strict command intentionally fails until the owner replaces every support/privacy placeholder. Confirm that the Expo public config reports the intended app name, slug, bundle identifier, version, build number, portrait orientation, camera and microphone permission text, privacy manifest, Expo Camera plugin, icon, and splash assets. Use the EAS `preview` profile for internal device testing and the `production` profile for TestFlight/App Store builds:

```bash
pnpm eas:build:preview
pnpm eas:build:production
pnpm eas:submit:production
```

## Device validation

Test on a physical iPhone with voice permission denied, granted, revoked, interrupted, and repeated. Test native camera capture, camera permission denial and retry, captured-frame review, and deterministic OCR fallback behavior. Test cold launch, onboarding skip, language switching, history persistence, favorite/delete actions, cultural progress reset, reduced motion, Dynamic Type, VoiceOver labels, dark appearance, poor network, and offline local flows.

## App Review readiness

Verify every primary action reaches a meaningful result or recovery state. Confirm that no test credentials, development URLs, placeholder support information, debug-only screens, or unsupported production claims are exposed. Provide App Review notes that explain the local fallback behavior and the steps to inspect text, voice, OCR, history, and Learn flows.

## Submission sequence

Build a production iOS artifact with EAS, install it through TestFlight, complete a final device pass, upload screenshots and metadata in App Store Connect, verify privacy and export-compliance answers, select the processed build, and submit for App Review. Publishing is intentionally not performed by this project pass.
