# KAMRAN Translate

<div align="center">

# KAMRAN Translate

### A Multimodal Uyghur ↔ Chinese Translation Companion for Text, Voice, Camera, Learning, and Offline-Ready Language Workflows

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=111111)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Expo%20Router-6-000020?logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![tRPC](https://img.shields.io/badge/tRPC-11-2596BE)](https://trpc.io/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team/)
[![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

**KAMRAN Translate** is a mobile-first translation experience designed around Uyghur ↔ Chinese communication, with a product architecture that can extend into English metadata, language learning, speech, OCR, phrase libraries, dialect-aware workflows, and offline-ready experiences.

</div>

---

# Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Why KAMRAN Exists](#2-why-kamran-exists)
- [3. Product Vision](#3-product-vision)
- [4. Core Capabilities](#4-core-capabilities)
- [5. Supported User Experiences](#5-supported-user-experiences)
- [6. Product Architecture](#6-product-architecture)
- [7. High-Level System Diagram](#7-high-level-system-diagram)
- [8. Mobile Architecture](#8-mobile-architecture)
- [9. Backend Architecture](#9-backend-architecture)
- [10. Translation Pipeline](#10-translation-pipeline)
- [11. Text Translation](#11-text-translation)
- [12. Voice Translation](#12-voice-translation)
- [13. Camera and OCR Translation](#13-camera-and-ocr-translation)
- [14. History and Persistence](#14-history-and-persistence)
- [15. Learning System](#15-learning-system)
- [16. Phrasebook](#16-phrasebook)
- [17. Dialect Extension Architecture](#17-dialect-extension-architecture)
- [18. RTL and Internationalization](#18-rtl-and-internationalization)
- [19. Accessibility](#19-accessibility)
- [20. Design System](#20-design-system)
- [21. Navigation Architecture](#21-navigation-architecture)
- [22. Data Model](#22-data-model)
- [23. API and Service Boundaries](#23-api-and-service-boundaries)
- [24. Async and Error Handling](#24-async-and-error-handling)
- [25. Offline-Ready Architecture](#25-offline-ready-architecture)
- [26. Security and Privacy](#26-security-and-privacy)
- [27. Environment Configuration](#27-environment-configuration)
- [28. Local Development](#28-local-development)
- [29. Installation](#29-installation)
- [30. Running the Application](#30-running-the-application)
- [31. Testing](#31-testing)
- [32. Type Checking and Linting](#32-type-checking-and-linting)
- [33. Database Development](#33-database-development)
- [34. Production Builds](#34-production-builds)
- [35. EAS Deployment](#35-eas-deployment)
- [36. Release Engineering](#36-release-engineering)
- [37. Repository Structure](#37-repository-structure)
- [38. Frontend Engineering Patterns](#38-frontend-engineering-patterns)
- [39. Backend Engineering Patterns](#39-backend-engineering-patterns)
- [40. Translation Quality Strategy](#40-translation-quality-strategy)
- [41. AI and Future Intelligence Layer](#41-ai-and-future-intelligence-layer)
- [42. Performance Strategy](#42-performance-strategy)
- [43. Observability](#43-observability)
- [44. Failure Modes](#44-failure-modes)
- [45. User Journey Diagrams](#45-user-journey-diagrams)
- [46. State Machines](#46-state-machines)
- [47. Sequence Diagrams](#47-sequence-diagrams)
- [48. Technical Decision Records](#48-technical-decision-records)
- [49. Development Roadmap](#49-development-roadmap)
- [50. Contribution Guide](#50-contribution-guide)
- [51. Recommended Engineering Standards](#51-recommended-engineering-standards)
- [52. Future Feature Architecture](#52-future-feature-architecture)
- [53. Example Translation Scenarios](#53-example-translation-scenarios)
- [54. Troubleshooting](#54-troubleshooting)
- [55. FAQ](#55-faq)
- [56. Project Philosophy](#56-project-philosophy)
- [57. License](#57-license)
- [58. Acknowledgements](#58-acknowledgements)

---

# 1. Project Overview

KAMRAN Translate is a cross-platform language companion focused on **Uyghur ↔ Chinese communication**.

The application is designed around an important principle:

> Translation should feel like a communication workflow, not simply a text box connected to a translation API.

That means KAMRAN is structured around several complementary experiences:

- text translation
- voice translation
- camera/OCR translation
- translation history
- saved phrases
- phrasebook functionality
- language learning
- pronunciation
- speech playback
- offline-readiness
- dialect-aware UI foundations
- accessible mobile interaction
- persistent user preferences

The application is built with an Expo-based React Native stack and is designed to share a significant amount of application logic across iOS, Android, and web.

---

# 2. Why KAMRAN Exists

Many translation products treat language as a generic conversion problem:

```text
Input
  ↓
Translation API
  ↓
Output
