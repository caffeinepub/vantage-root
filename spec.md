# Vantage Root

## Current State
Admin dashboard at `/admin` requires both username/password AND an Internet Identity (II) popup to authenticate. The backend `getAllConsultationRequests` checks `isAdmin` via II principal. The frontend verifies credentials then triggers `login()` from `useInternetIdentity`, which opens the II popup.

## Requested Changes (Diff)

### Add
- New backend query `getAllConsultationRequestsWithPassword(password: Text)` that checks the password against `CAFFEINE_ADMIN_TOKEN` env var and returns all requests if it matches — no II principal needed.
- New backend query `getConsultationRequestCountWithPassword(password: Text)` — same password gate, returns request count.

### Modify
- Frontend `AdminPage.tsx`: remove all Internet Identity dependency. After username/password are verified, directly fetch requests using the new password-based backend calls. No `login()` call, no II popup, no `identity` state checks.

### Remove
- The two-step II flow from the admin page (credential form → II popup → dashboard).
- All references to `useInternetIdentity`, `credVerified`, and II waiting screen in `AdminPage.tsx`.

## Implementation Plan
1. Regenerate Motoko backend with the two new password-gated query functions.
2. Update `AdminPage.tsx` to use the new queries, storing the verified password in local state and passing it directly to backend calls — no II required.
