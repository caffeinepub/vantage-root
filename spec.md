# Plantly

## Current State
The app has:
- A marketing homepage with hero, services, plants/planters showcase, and consultation booking form
- Customer authentication (signup/login/dashboard) at /signup, /login, /dashboard
- Shop section at /shop with 6 categories, filters, cart, wishlist — all showing "Products Coming Soon"
- Admin panel at /admin with consultation requests management, priority/status cycling, delete, and a Shop tab (static placeholder)
- Session management at /admin/sessions
- Backend stores: ConsultationRequest, CustomerUser, CustomerSession, NewsletterSubscription

## Requested Changes (Diff)

### Add
- New "Sell With Us" page at /sell-with-us with a detailed vendor registration form
- Backend VendorApplication type and storage with full CRUD for admin
- Admin panel "Vendors" tab showing pending/approved/rejected applications with approve/reject actions
- Navbar link to "Sell With Us" page
- Footer link to "Sell With Us" page

### Modify
- Backend main.mo: add VendorApplication type, submitVendorApplication (public), getAllVendorApplications (admin), updateVendorApplicationStatus (admin), deleteVendorApplication (admin)
- AdminPage.tsx: add "Vendors" tab with approval workflow (approve/reject/delete) and application details view
- Navbar: add "Sell With Us" link

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo with VendorApplication type and all vendor functions
2. Update backend.d.ts with new types and function signatures
3. Create SellWithUsPage.tsx with the full vendor registration form (business info, contact, location, products, verification, logistics, agreement)
4. Add route for /sell-with-us in routeTree and App routing
5. Update AdminPage.tsx to add a Vendors tab with table, status badges, approve/reject/delete actions, and application detail modal
6. Update Navbar to include "Sell With Us" link
7. Update Footer to include "Sell With Us" link
