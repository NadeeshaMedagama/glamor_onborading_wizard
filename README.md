# Glamer Onboarding Wizard

> A 3-step team member onboarding wizard built with **React 19 + TypeScript + Vite** for Glamer International (Pvt) Ltd.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & State Management](#architecture--state-management)
- [Wizard Flow](#wizard-flow)
- [Validation Strategy](#validation-strategy)
- [Accessibility](#accessibility)
- [Design System](#design-system)
- [Edge Cases Handled](#edge-cases-handled)
- [Trade-offs & Simplifications](#trade-offs--simplifications)
- [What I Would Do Next](#what-i-would-do-next)
- [Resources Used](#resources-used)

---

## Overview

This project implements a guided onboarding wizard that collects, validates, and summarises information for a new team member. The wizard enforces per-step validation, preserves state across back-navigation, and transitions to a terminal success screen on submission.

**Key highlights:**

- **Zero external UI libraries** — fully custom CSS with a dark glassmorphism theme
- **Strict validation order** — file type/size checked before preview is shown
- **Role-aware skills** — changing the role clears only the skill selections, preserving the avatar and all other data
- **Accessible by default** — keyboard-operable, ARIA labels, screen-reader-friendly error announcements

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
glamer-onboarding-wizard/
├── index.html                         # Entry HTML with SEO meta tags
├── package.json                       # Project metadata & dependencies
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript root config
├── tsconfig.app.json                  # App-specific TS config
├── tsconfig.node.json                 # Node-specific TS config
├── public/
│   └── favicon.svg                    # Gradient "G" favicon
│
└── src/
    ├── main.tsx                       # React DOM entry point
    ├── App.tsx                        # Root component
    ├── index.css                      # Design tokens, resets, shared utilities
    │
    ├── types/
    │   └── index.ts                   # TypeScript interfaces & type aliases
    │
    ├── constants/
    │   └── skills.ts                  # Role-skill mappings, file limits, etc.
    │
    ├── utils/
    │   └── validation.ts              # Pure validation functions (testable)
    │
    └── components/
        ├── wizard/
        │   ├── Wizard.tsx             # State orchestrator & step router
        │   ├── Wizard.css             # Card layout & shared button styles
        │   ├── StepIndicator.tsx      # Progress bar component
        │   └── StepIndicator.css
        │
        ├── steps/
        │   ├── PersonalInfo.tsx       # Step 1: name, email, role, department
        │   ├── PersonalInfo.css
        │   ├── SkillsAvatar.tsx       # Step 2: avatar upload + skill chips
        │   ├── SkillsAvatar.css
        │   ├── Review.tsx             # Step 3: summary + edit links
        │   ├── Review.css
        │   ├── Success.tsx            # Terminal success screen
        │   └── Success.css
        │
        └── ui/
            ├── ErrorMessage.tsx       # Reusable inline error component
            └── ErrorMessage.css
```

---

## Architecture & State Management

### State Ownership

All form state lives in the **Wizard** component — the single source of truth:

```
Wizard (state owner)
├── personalInfo: { fullName, email, role, department }
├── skillsAvatar: { avatarFile, avatarPreviewUrl, selectedSkills }
├── currentStep: 1 | 2 | 3
└── submitted: boolean
```

Each step receives its data slice via props and reports changes back through `onChange` callbacks. This pattern ensures:

1. **State survives navigation** — going back never clears data
2. **Cross-step logic is centralised** — role-change detection happens in one place
3. **Steps are purely presentational** — they validate and render, nothing more

### Role Change → Skill Reset

When the user navigates from Step 1 to Step 2, the Wizard compares the current role against a `useRef`-stored previous role. If they differ, `selectedSkills` is reset to `[]` while `avatarFile` and `avatarPreviewUrl` are preserved.

### Terminal Success State

Once `submitted` becomes `true`, the Wizard renders only the Success screen — no step indicator, no Back button. The `handleGoToStep` function also short-circuits when `submitted` is truthy.

---

## Wizard Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Step 1           │     │  Step 2           │     │  Step 3           │     │  Success      │
│  Personal Info    │────►│  Skills & Avatar  │────►│  Review & Submit  │────►│  (terminal)   │
│                   │◄────│                   │◄────│                   │     │               │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────┘
        ▲                                                  │
        └──────────── Edit shortcuts ──────────────────────┘
```

---

## Validation Strategy

| Layer | Where | What |
|-------|-------|------|
| **Pure functions** | `utils/validation.ts` | `validatePersonalInfo()`, `validateAvatarFile()`, `validateSkillsAvatar()` |
| **Step components** | `PersonalInfo.tsx`, `SkillsAvatar.tsx` | Manage touched state, call validators, render errors |
| **Wizard** | `Wizard.tsx` | Never validates — trusts steps to gate navigation |

### Validation Behaviour

- **On blur**: the field is marked as touched and validated
- **On change** (if touched): immediate re-validation for instant feedback
- **On "Next" click**: all fields are validated and all errors are shown
- **File upload**: type is checked first, then size — preview is never shown for invalid files

---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Keyboard navigation | All interactive elements are focusable and operable via keyboard |
| Focus outline | Custom `:focus-visible` outline using the accent colour |
| ARIA labels | Every button has a descriptive `aria-label` |
| Error association | Errors linked to fields via `aria-describedby` |
| Error announcements | Error messages use `role="alert"` for live announcements |
| Step indicator | Uses `<nav>` with `aria-label` and `aria-current="step"` |
| Skill chips | Use `aria-pressed` to convey toggle state |
| Decorative icons | All SVG icons have `aria-hidden="true"` |

---

## Design System

The visual design uses a **dark glassmorphism** theme with curated tokens defined in `src/index.css`:

- **Typography**: Inter (Google Fonts) — 300–800 weights
- **Colour palette**: Deep navy backgrounds with purple (`#7c5cfc`) and teal (`#00d4aa`) accents
- **Glassmorphism**: `backdrop-filter: blur(24px)` on the wizard card
- **Animations**: `fadeSlideIn` for step transitions, `successPulse` + confetti for the success screen
- **Responsive**: CSS grid collapses to single-column on mobile; step labels hide below 600px

---

## Edge Cases Handled

| Scenario | Behaviour |
|----------|-----------|
| Invalid file type selected | Error shown immediately, preview is **not** rendered |
| File exceeds 3 MB | Error shown immediately, file is rejected |
| Re-upload avatar | Previous `objectURL` is revoked before creating a new one (prevents memory leaks) |
| Role changed on Step 1 | Skills are cleared when returning to Step 2; avatar is preserved |
| Back from Step 2 → Step 1 | All Step 1 fields remain filled |
| Navigate back from Review via Edit | Jumps directly to the relevant step |
| Submit → terminal state | No back navigation is possible from the Success screen |
| Select fewer than 2 skills | Inline error on Next click; error clears as soon as 2+ are selected |

---

## Trade-offs & Simplifications

1. **No routing library** — steps are managed via simple state rather than URL-based routing. For a 3-step wizard, this avoids unnecessary complexity.

2. **No external state library** — React's built-in `useState` + `useRef` is sufficient. For 10+ steps with branching logic, I'd use `useReducer` or Zustand with a step configuration model.

3. **No component library** — plain CSS gives complete design control and zero dependency overhead. Trade-off: more CSS to maintain.

4. **No unit tests** — given time constraints, I prioritised correct behaviour and clean architecture over test coverage. The validation logic is extracted into pure functions specifically to make it easy to test.

5. **Avatar stored client-side only** — `URL.createObjectURL` for preview, no server upload. In production, I'd upload on final submit to avoid orphaned files from abandoned sessions.

---

## What I Would Do Next

### Testing
- **Playwright e2e**: happy path, invalid file types/sizes, role change clearing skills, back navigation preserving data
- **Unit tests** for `utils/validation.ts` — pure functions are trivially testable
- **Highest-risk flows**: file validation order, role-change-then-back, submit-then-redirect

### Scalability (10+ Steps with Branching)
- Replace step number with a **step machine configuration** — each step declares its fields, validation, and conditional next/previous transitions
- Use `useReducer` with typed actions (`NEXT`, `BACK`, `SET_FIELD`, `CLEAR_SKILLS`)
- Support branching logic via a `getNextStep(data)` function per step

### Real Upload
- Upload the avatar **on final submit** — not on step change — to avoid orphaned files
- Use a pre-signed URL pattern to upload directly to S3/GCS from the browser
- Show upload progress in the Submit button

### Mobile
- Convert the skill grid to a scrollable horizontal strip on small screens
- Use a bottom-sheet pattern for step contents on very small viewports
- Increase touch targets for chips to 44×44px minimum

---

## Resources Used

- **Vite** — React + TypeScript template (`npm create vite@latest`)
- **Google Fonts** — Inter typeface
- **AI Assistant** — Gemini/Antigravity for code generation and architecture guidance
