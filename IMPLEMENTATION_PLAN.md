# Ski Rental Web App - Implementation Plan

> **Project:** SkiNB - Ski Rental Platform  
> **Stack:** Next.js 16 (App Router) + Supabase + Netlify + Tailwind CSS v4  
> **Date:** January 2026

---

## Overview

This document serves as the master index for the Ski Rental Web App implementation. Each phase is documented in its own file for easier navigation and reference.

---

## Phase Documentation

| Phase | Description | Link |
|-------|-------------|------|
| **Phase 1** | Database Initialization (Supabase MCP) | [📄 PHASE_1_DATABASE.md](./docs/PHASE_1_DATABASE.md) |
| **Phase 2** | Environment & Types | [📄 PHASE_2_ENVIRONMENT.md](./docs/PHASE_2_ENVIRONMENT.md) |
| **Phase 3** | Frontend Implementation (Index) | [📄 PHASE_3_FRONTEND.md](./docs/PHASE_3_FRONTEND.md) |
| ↳ 3A | Authentication System | [📄 PHASE_3A_AUTH.md](./docs/PHASE_3A_AUTH.md) |
| ↳ 3B | Reusable Components | [📄 PHASE_3B_COMPONENTS.md](./docs/PHASE_3B_COMPONENTS.md) |
| ↳ 3C | Home Page (Public Feed) | [📄 PHASE_3C_HOME.md](./docs/PHASE_3C_HOME.md) |
| ↳ 3D | Create Listing + Detail View | [📄 PHASE_3D_LISTINGS.md](./docs/PHASE_3D_LISTINGS.md) |
| ↳ 3E | Profile Dashboard + Navigation | [📄 PHASE_3E_PROFILE.md](./docs/PHASE_3E_PROFILE.md) |
| **Phase 4** | Admin Override | [📄 PHASE_4_ADMIN.md](./docs/PHASE_4_ADMIN.md) |

---

## Quick Summary

### Phase 1: Database Initialization
- Create `user_role` ENUM type (`admin`, `renter`, `user`)
- Create `profiles` table (extends auth.users)
- Create `rentals` table (listings)
- Create `gear` storage bucket for images
- Set up auto-profile creation trigger
- Configure Row Level Security (RLS) policies

### Phase 2: Environment & Types
- Configure `.env.local` with Supabase credentials
- Generate TypeScript types from schema
- Update Supabase client with helper functions

### Phase 3: Frontend Implementation
- **Sub-Phase 3A:** Authentication (login, signup, logout)
- **Sub-Phase 3B:** Reusable Components (RentalCard, DeleteButton, ImageUpload)
- **Sub-Phase 3C:** Home Page with public rental feed
- **Sub-Phase 3D:** Create Listing + Detail View pages
- **Sub-Phase 3E:** Profile Dashboard + Navigation updates

> ⚠️ Phase 3 has been split into 5 sub-phases with checkpoints. See [PHASE_3_FRONTEND.md](./docs/PHASE_3_FRONTEND.md) for details.

### Phase 4: Admin Override
- SQL commands to promote users to admin/renter roles
- Verification queries
- Testing checklist

---

## Implementation Order

| Order | Task | Est. Time | Phase |
|-------|------|-----------|-------|
| 1 | Execute SQL migrations via MCP | 30 min | Phase 1 |
| 2 | Set up environment variables | 10 min | Phase 2 |
| 3 | Generate TypeScript types | 5 min | Phase 2 |
| 4 | Update `lib/supabase.js` | 15 min | Phase 2 |
| 5 | **CP-1/2:** Verify database + env setup | 10 min | Checkpoint |
| 6 | Create auth pages (3A) | 45 min | Phase 3A |
| 7 | **CP-3A:** Test auth flows | 15 min | Checkpoint |
| 8 | Create reusable components (3B) | 35 min | Phase 3B |
| 9 | **CP-3B:** Test component rendering | 10 min | Checkpoint |
| 10 | Implement Home Page feed (3C) | 30 min | Phase 3C |
| 11 | **CP-3C:** Test rental feed | 10 min | Checkpoint |
| 12 | Implement Create + Detail pages (3D) | 60 min | Phase 3D |
| 13 | **CP-3D:** Test listing CRUD | 15 min | Checkpoint |
| 14 | Implement Profile + Nav (3E) | 40 min | Phase 3E |
| 15 | **CP-3E:** Test dashboard + navigation | 15 min | Checkpoint |
| 16 | Promote first admin | 5 min | Phase 4 |
| 17 | **Final:** Full user journey testing | 30 min | All |

**Total Estimated Time:** ~6.5 hours (including checkpoints)

---

## File Structure (After Implementation)

```
app/
├── page.jsx                    # Public Feed
├── auth/
│   ├── login/page.jsx          # Login page
│   ├── signup/page.jsx         # Signup page
│   └── callback/route.js       # OAuth callback
├── rentals/
│   ├── create/page.jsx         # Create listing (protected)
│   └── [id]/page.jsx           # Rental detail view
├── profile/
│   └── page.jsx                # User dashboard
components/
├── rental-card.jsx             # Rental card component
├── delete-button.jsx           # Delete action (client)
├── auth-button.jsx             # Login/Logout button
└── image-upload.jsx            # Image upload component
lib/
├── supabase.js                 # Supabase client
└── database.types.ts           # Auto-generated types
docs/
├── PHASE_1_DATABASE.md         # Database setup
├── PHASE_2_ENVIRONMENT.md      # Environment config
├── PHASE_3_FRONTEND.md         # Frontend implementation
└── PHASE_4_ADMIN.md            # Admin configuration
```

---

## Security Checklist

- [ ] RLS enabled on all tables (`profiles`, `rentals`)
- [ ] Storage bucket policies restrict uploads to authenticated users
- [ ] Role checks happen server-side before sensitive operations
- [ ] No sensitive data exposed in client-side code
- [ ] `owner_id` cannot be spoofed (set server-side from `auth.uid()`)
- [ ] Admin actions verified via RLS, not just UI hiding
- [ ] Environment variables not committed to git

---

## Role Permissions Matrix

| Role | View | Create | Delete Own | Delete Any |
|------|------|--------|------------|------------|
| `user` | ✅ | ❌ | ❌ | ❌ |
| `renter` | ✅ | ✅ | ✅ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ |

---

## Getting Started

1. Start with [Phase 1: Database Initialization](./docs/PHASE_1_DATABASE.md)
2. Proceed through each phase in order
3. Test each phase before moving to the next
4. Use the Security Checklist before deploying
