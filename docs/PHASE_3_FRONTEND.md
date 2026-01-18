# Phase 3: Frontend Implementation

> **Project:** SkiNB - Ski Rental Platform  
> **Phase:** 3 of 4 - Building the UI

---

## ⚠️ Phase 3 Has Been Split Into Sub-Phases

This phase was large and has been split into **5 sub-phases** for easier implementation and testing. Each sub-phase has its own documentation with detailed code and testing checkpoints.

---

## Sub-Phase Overview

| Sub-Phase | Description | Est. Time | Doc Link | Status |
|-----------|-------------|-----------|----------|--------|
| **3A** | Authentication System | 45 min | [📄 PHASE_3A_AUTH.md](./PHASE_3A_AUTH.md) | ⬜ Not Started |
| **3B** | Reusable Components | 35 min | [📄 PHASE_3B_COMPONENTS.md](./PHASE_3B_COMPONENTS.md) | ⬜ Not Started |
| **3C** | Home Page (Public Feed) | 30 min | [📄 PHASE_3C_HOME.md](./PHASE_3C_HOME.md) | ⬜ Not Started |
| **3D** | Create Listing + Detail View | 60 min | [📄 PHASE_3D_LISTINGS.md](./PHASE_3D_LISTINGS.md) | ⬜ Not Started |
| **3E** | Profile Dashboard + Navigation | 40 min | [📄 PHASE_3E_PROFILE.md](./PHASE_3E_PROFILE.md) | ⬜ Not Started |

**Total Estimated Time:** ~3.5 hours

---

## 🧪 Testing Checkpoints Summary

Each sub-phase has a checkpoint to verify before proceeding:

| Checkpoint | After Sub-Phase | What to Test | Tests |
|------------|-----------------|--------------|-------|
| **CP-3A** | 3A - Auth | Sign up, login, logout, session persistence | 9 tests |
| **CP-3B** | 3B - Components | RentalCard renders, delete button visibility | 11 tests |
| **CP-3C** | 3C - Home | Home page loads, shows rentals correctly | 10 tests |
| **CP-3D** | 3D - Listings | Create listing works, detail page displays | 13 tests |
| **CP-3E** | 3E - Profile | Profile shows user info, nav links work | 16 tests |

---

## Implementation Order

Follow this exact order:

```
Phase 1 & 2 Complete
        │
        ▼
┌───────────────────┐
│ 3A: Auth System   │ ─── CP-3A: Test auth flows
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 3B: Components    │ ─── CP-3B: Test component rendering
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 3C: Home Page     │ ─── CP-3C: Test rental feed
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 3D: Listings CRUD │ ─── CP-3D: Test create/view/delete
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 3E: Profile & Nav │ ─── CP-3E: Test dashboard + navigation
└───────────────────┘
        │
        ▼
    Phase 4
```

---

## File Structure After Phase 3

```
app/
├── page.jsx                    # Home page (rental feed)
├── layout.jsx                  # Root layout
├── auth/
│   ├── login/page.jsx          # Login page
│   ├── signup/page.jsx         # Signup page
│   └── callback/route.js       # OAuth callback handler
├── rentals/
│   ├── create/page.jsx         # Create listing (protected)
│   └── [id]/
│       ├── page.jsx            # Rental detail view
│       └── not-found.jsx       # 404 for invalid rental
├── profile/
│   └── page.jsx                # User dashboard
components/
├── auth-button.jsx             # Login/Logout button
├── rental-card.jsx             # Rental card component
├── delete-button.jsx           # Delete action button
├── image-upload.jsx            # Image upload component
├── create-rental-form.jsx      # Create listing form
├── header.jsx                  # Site header (updated)
├── footer.jsx                  # Site footer
lib/
├── supabase.js                 # Browser Supabase client
├── supabase-server.js          # Server Supabase client
└── database.types.ts           # Auto-generated types
```

---

## Quick Start

1. **Ensure Phase 1 & 2 are complete**
   - Database tables exist
   - Environment variables set
   - Supabase client configured

2. **Start with Sub-Phase 3A**
   - Open [PHASE_3A_AUTH.md](./PHASE_3A_AUTH.md)
   - Create auth pages
   - Test with CP-3A checklist

3. **Proceed through each sub-phase in order**
   - Complete checkpoint tests before moving on
   - Don't skip - each builds on the previous

4. **After Phase 3 is complete**
   - Proceed to [Phase 4: Admin Override](./PHASE_4_ADMIN.md)

---

## Role Permissions Reminder

| Role | View | Create | Delete Own | Delete Any |
|------|------|--------|------------|------------|
| `anonymous` | ✅ | ❌ | ❌ | ❌ |
| `user` | ✅ | ❌ | ❌ | ❌ |
| `renter` | ✅ | ✅ | ✅ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ |

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Session not persisting | Ensure using `netlify dev`, not `npm run dev` |
| Profile not created on signup | Check Phase 1 trigger exists in database |
| Images not loading | Add Supabase domain to `next.config.js` images config |
| Delete button always hidden | Check `userProfile` is being passed to components |
| "Row level security" errors | Review Phase 1 RLS policies |

---

## Dependencies to Install

Before starting Phase 3, ensure these are installed:

```bash
npm install @supabase/ssr @supabase/supabase-js
```

---

**Previous:** [Phase 2: Environment & Types](./PHASE_2_ENVIRONMENT.md)  
**Next:** Start with [Sub-Phase 3A: Authentication](./PHASE_3A_AUTH.md)
