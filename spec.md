# Vantage Root

## Current State

The app is a balcony landscaping business site with:
- A public homepage with services, plants, planters, and a consultation booking form
- An admin dashboard at `/admin` protected by a frontend username/password form (username: `admin`, password: `vantageroot2024`)
- The backend uses the `authorization` component with Internet Identity-based admin checks
- All admin backend functions (`getAllConsultationRequests`, `deleteConsultationRequest`, `updateRequestPriority`, `updateRequestStatus`) require an authenticated admin principal
- Internet Identity was removed from the frontend in a previous update, so the actor is always anonymous
- This causes "Error Loading Data / Unable to fetch consultation requests" on the admin dashboard because the anonymous caller fails the backend authorization check

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Remove the `authorization` component dependency from the backend
- Make all consultation management functions publicly callable (no caller-based authorization) since security is enforced on the frontend via username/password

### Remove
- Backend authorization checks on `getAllConsultationRequests`, `deleteConsultationRequest`, `updateRequestPriority`, `updateRequestStatus`, `getConsultationRequestCount`, `getConsultationRequestCountAdmin`
- Remove unused user profile functions and authorization mixin

## Implementation Plan

1. Regenerate backend without the `authorization` component — all consultation functions become public query/shared functions with no permission checks
2. Keep the same data model: ConsultationRequest with id, name, email, phone, balconySize, sunlightExposure, stylePreference, message, timestamp, priority, status
3. Keep the same frontend code — no changes needed to AdminPage.tsx or useQueries.ts
