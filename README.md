# ExamVault — Complete Examination Management Platform

> **ExamVault** is a personal examination management platform designed to help candidates seamlessly navigate the entire competitive examination lifecycle: discovering recruitment notifications, tracking application deadlines, securely storing admit cards and portal credentials, monitoring answer keys, and managing results.

---

## 🚀 Key Modules

ExamVault features 8 core dedicated modules designed with a premium, dark-themed SaaS aesthetic:

1. **Dashboard (`/`)**: Real-time KPI statistics calculated dynamically from examination records, upcoming application & fee deadlines with urgency badges, test dates with admit card status, recent activity logs, and recruitment year & status filters.
2. **My Examinations (`/examinations`)**: Complete examination tracking supporting basic recruitment details, application timeline, examination center/city, and post-examination answer key and scorecard tracking.
3. **Exam Discovery (`/discovery`)**: Verified recruitment notifications across UPSC, SSC, ISRO, DRDO, GATE, State PSC, Banking, and PSU sectors.
4. **Calendar (`/calendar`)**: Interactive examination agenda and timeline with automated milestone alerts (30d, 15d, 7d, 3d, 1d, and day-of-event).
5. **Document Vault (`/documents`)**: Private, organized document management supporting official notifications, application forms, payment receipts, admit cards, scorecards, and camera scanning integration.
6. **Password Vault (`/vault`)**: Zero-knowledge, client-side encrypted credential store using AES-GCM and PBKDF2 key derivation for government and examination recruitment portals (OTR IDs, roll numbers, and login credentials).
7. **Notifications (`/notifications`)**: Alert center tracking upcoming deadlines, admit card releases, result announcements, and recruitment website change detection.
8. **Settings (`/settings`)**: User profile, master vault password, reminder intervals, data export/import (JSON), and cloud synchronization controls.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **UI Primitives**: Radix UI Headless Components (`@radix-ui/react-slot`, dialogs, dropdowns, etc.)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Security**: Web Crypto API (AES-GCM encryption, PBKDF2 key derivation)
- **Backend (Target)**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage

---

## 🎨 Design System

- **Background**: Deep Dark Charcoal (`#0b0d13`)
- **Card Surfaces**: Dark Charcoal Slate (`#121620`, `#141a27`)
- **Accent Colors**: Indigo (`#6366f1`) and Royal Blue (`#3b82f6`)
- **Borders**: Subtle Slate Borders (`#1e2536`)
- **Typography**: Clean system font stack with high legibility and contrast
- **Mobile First**: Optimized for Samsung Android smartphones and tablets with touch-friendly tap targets (>= 44px), native-feeling bottom navigation, and viewport handling (`viewport-fit=cover`).

---

## 📦 Getting Started

### Prerequisites

- Node.js `v20.x` or `v22.x`
- npm `v10+` or `v11+`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ExamVault

# Install dependencies
npm install
```

### Running Locally

```bash
# Run Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Run TypeScript compilation and production build
npm run build

# Start production server
npm run start
```

### Code Quality & Linting

```bash
# Run ESLint validation
npm run lint
```

---

## 🔒 Security Principles

- **Zero Plaintext Credentials in Cloud**: Examination portal passwords and recovery notes are encrypted on the client side using AES-GCM before transfer.
- **Master Password Protection**: Client-side PBKDF2 derivation with unique cryptographically secure salts.
- **No Secret Leakage**: Passwords never enter URLs, browser console logs, or unencrypted localStorage.
- **Private Document Isolation**: Candidate identity documents and admit cards are stored with strict Row Level Security (RLS).
