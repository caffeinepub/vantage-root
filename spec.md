# Plantly

## Current State
- Marketing site with hero, services, plants/planters showcase, and balcony transformation sections
- Consultation booking form (name, email, phone, balcony size, sunlight, style, message)
- Admin panel at `/admin` with username/password login (`admin` / `plantly2024`)
- Admin features: view/delete consultation requests, set priority, set status (New/In Progress/Completed), sort
- Session management at `/admin/sessions` — view active sessions, block/unblock devices
- Backend stores ConsultationRequests and admin sessions in Motoko
- Authorization component is installed

## Requested Changes (Diff)

### Add
- **Customer signup page** (`/signup`): form with Full Name, Email, Password, Phone Number, Delivery Address (required), plus optional City, State, Country, Pincode fields
- **Customer login page** (`/login`): form with Email + Password
- **User dashboard page** (`/dashboard`): shows saved address, wishlist (empty placeholder), order history (empty placeholder), newsletter subscriptions (empty placeholder), account settings (change name/address/password)
- **Backend: CustomerUser type** — stores full name, email, hashed password (salted), phone, full address fields
- **Backend: customer auth functions** — `signupCustomer`, `loginCustomer` (returns session token), `logoutCustomer`, `getCustomerProfile`, `updateCustomerProfile`
- **Navbar links**: add "Login" and "Sign Up" buttons; when logged in show user's name + "Dashboard" + "Logout"
- **Newsletter subscription field** on homepage and footer (email input + subscribe button, stores email in backend)
- **Backend: newsletter subscriptions** — `subscribeNewsletter(email)`, `getNewsletterSubscribers()` (admin only)

### Modify
- Navbar to include auth state (login/signup links vs logged-in user menu)
- Footer to include newsletter subscription widget

### Remove
- Nothing removed

## Implementation Plan
1. Add `CustomerUser`, `CustomerSession`, `NewsletterSubscription` types to backend
2. Add `signupCustomer`, `loginCustomer`, `logoutCustomer`, `getCustomerProfile`, `updateCustomerProfile` functions
3. Add `subscribeNewsletter`, `getNewsletterSubscribers` functions
4. Regenerate `backend.d.ts`
5. Create `/signup` page with full registration form
6. Create `/login` page with email/password form
7. Create `/dashboard` page with profile, address, wishlist placeholder, order history placeholder
8. Update navbar with auth-aware links
9. Add newsletter subscription widget to homepage and footer
10. Add routes for `/signup`, `/login`, `/dashboard`
