# ScreenTracker — Step 1 Foundation

This repository currently implements **Step 1 (Foundation)** of the MVP specification only.

## What is implemented in Step 1

- Mobile-first React + TypeScript web app scaffolded with Vite
- PWA shell using `vite-plugin-pwa` (manifest + service worker registration)
- Firebase integration points (Auth + Firestore client setup)
- Email/password authentication UI flow
- Basic role model stored in Firestore (`staffProfiles/{uid}`)
  - roles: `cleaner`, `supervisor`, `admin`
  - first registration path creates a `cleaner` profile
- Protected routes:
  - `/app` for authenticated active users
  - `/admin` for `supervisor` and `admin`
  - unauthorized/unauthenticated access is blocked with redirects
- Firebase project separation scaffolding for development and production

## Environment separation (dev/prod)

Two environment templates are provided:

- `/home/runner/work/screentracker/screentracker/.env.development.example`
- `/home/runner/work/screentracker/screentracker/.env.production.example`

Create real environment files from these templates:

- `/home/runner/work/screentracker/screentracker/.env.development`
- `/home/runner/work/screentracker/screentracker/.env.production`

The app uses Vite mode-based loading (`npm run dev` for development, `npm run build` for production build).

Firebase project aliases are separated in `/home/runner/work/screentracker/screentracker/.firebaserc`.

## Local run

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run lint
npm run build
```

## Test role flow (Step 1)

1. Configure `.env.development` with valid Firebase web config.
2. Enable **Email/Password** provider in Firebase Authentication (dev project).
3. Open app and create a test cleaner account from the login screen.
4. Sign in and confirm profile details render in `/app`.
5. Confirm role-gated route behavior:
   - cleaner should be blocked from `/admin`
   - supervisor/admin profile should access `/admin`

## Data model used in Step 1

- `staffProfiles/{uid}`
  - `uid`, `email`, `displayName`, `role`, `active`, `createdAt`, `updatedAt`

## Hard-constraint documentation (required)

### HTTPS requirement for geolocation

Production geolocation access requires **HTTPS** (localhost is allowed for development only).
This impacts Step 2+ attendance GPS behavior and QA.

### Blaze requirement for Cloud Functions features

Any scheduled archiving, backend automation, or email triggers implemented via Firebase Cloud Functions require the **Blaze plan** with billing enabled.
Do not treat Cloud Functions-based features as Spark/free-tier-only.

### SMTP dependency for email alerts

Email alerts require configured SMTP/provider credentials (for example Gmail SMTP, SendGrid, or similar).
Firebase Trigger Email is **not** zero-config.

## What is intentionally not yet implemented

Step 2 and later scope remains pending, including:

- attendance clock-in/out with GPS capture
- shift history
- supervisor/admin attendance dashboard and flagged events
- reverse geocoding throttling/caching for Nominatim
- staff photo handling and compression
- archiving and alert delivery logic
- 12-hour inactivity logout hardening
- Safari iPhone / Chrome Android QA validation matrix
