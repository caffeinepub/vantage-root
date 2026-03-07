# Florilic

## Current State
- Marketing site with a dark forest-green theme, hero section, services, consultation booking form, and admin panel.
- Admin panel at `/admin` uses hardcoded username/password (`admin` / `florilic2024`), stored in frontend only.
- Admin dashboard shows consultation requests with sort, priority, status, and delete features.
- No session or device tracking of any kind.

## Requested Changes (Diff)

### Add
- **Device Session Management page** at `/admin/sessions`:
  - Accessible only when logged in as admin.
  - Shows a list of all active admin sessions, each with:
    - Device/browser name (user-agent parsed: e.g. "Chrome on Windows", "Safari on iPhone")
    - Approximate location (city/country derived from IP using a public IP-geolocation API via HTTP outcall is not available — use browser-provided info or store timezone on login as a proxy)
    - Login timestamp
    - Session ID (unique token generated at login, stored in localStorage)
    - "Current device" badge if it matches the active session
  - Password confirmation flow: entering the admin password twice unlocks destructive actions (log out device, add to blocklist).
  - Per-device actions: **Log Out** (removes session), **Block** (adds to blocklist, forces logout).
  - Multi-select: select multiple devices to log out or block in bulk.
  - Blocklist management section: shows blocked session tokens, with **Unblock** per entry.
- **"Manage Sessions" button** in the admin panel header (when logged in), linking to `/admin/sessions`.
- Backend stores sessions in-memory: a `sessions` map of `sessionToken -> SessionInfo`, and a `blocklist` set of tokens.
- On admin login, frontend generates a UUID session token, saves it to localStorage, and registers it with the backend.
- On admin page load, frontend checks if its session token is in the blocklist — if so, force-logs out.
- Backend exposes:
  - `registerAdminSession(token, deviceInfo, loginTime)` — stores session
  - `getAllAdminSessions()` — returns all sessions array
  - `removeAdminSession(token)` — removes a session (logout)
  - `blockSession(token)` — moves to blocklist, removes from active sessions
  - `unblockSession(token)` — removes from blocklist
  - `isSessionBlocked(token)` — returns Bool
  - `getBlockedSessions()` — returns list of blocked tokens

### Modify
- `AdminPage.tsx`: Add "Manage Sessions" button in header (visible when logged in), linking to `/admin/sessions`.
- `routeTree.ts`: Add `/admin/sessions` route pointing to new `SessionsPage` component.
- `main.mo`: Add session management data structures and functions.
- On admin login: generate session token, call `registerAdminSession`.
- On admin page load (when token exists in localStorage): call `isSessionBlocked` and force-logout if true.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo` to add `SessionInfo` type, `sessions` map, `blocklist` set, and all 7 session management functions.
2. Regenerate `backend.d.ts` to expose new APIs.
3. Create `src/frontend/src/pages/SessionsPage.tsx` — full device management UI with:
   - Session list (device name, timezone/location proxy, login time, current badge)
   - Password confirmation dialog (enter password twice to unlock destructive actions)
   - Per-row log out and block buttons
   - Multi-select + bulk actions
   - Blocklist panel with unblock
4. Update `AdminPage.tsx`:
   - On login: generate UUID, save to localStorage, call `registerAdminSession` with user-agent + timezone.
   - On load: check localStorage token, call `isSessionBlocked`, auto-logout if blocked.
   - Add "Manage Sessions" button in header.
5. Update `routeTree.ts` to register `/admin/sessions`.
