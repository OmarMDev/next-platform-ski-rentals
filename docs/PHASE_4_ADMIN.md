# Phase 4: Admin Override

> **Project:** SkiNB - Ski Rental Platform  
> **Phase:** 4 of 4 - Admin Configuration

---

## Overview

By default, all new users signing up through the application receive the `user` role. This phase covers how to manually promote users to `admin` or `renter` roles.

---

## 4.1 Manually Promote First Admin User

After a user signs up through the normal flow, promote them to admin using the Supabase MCP tool.

### Method 1: Update by Email

**MCP Tool:** `mcp_supabase_execute_sql`

```sql
-- Replace 'admin@example.com' with the actual admin's email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Method 2: Update by User ID

If you know the user's UUID (visible in Supabase Auth dashboard):

```sql
-- Replace the UUID with the actual user ID
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

---

## 4.2 Promote Users to Renter Role

For users who want to list gear for rent:

```sql
-- Promote a user to renter by email
UPDATE public.profiles
SET role = 'renter'
WHERE email = 'renter@example.com';
```

---

## 4.3 Verify Role Changes

After updating a user's role, verify the change:

```sql
-- Check all admins
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE role = 'admin';

-- Check all renters
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE role = 'renter';

-- Check a specific user's role
SELECT id, email, role 
FROM public.profiles 
WHERE email = 'user@example.com';
```

---

## 4.4 Role Permissions Summary

| Role | View Listings | Create Listings | Delete Own | Delete Any |
|------|---------------|-----------------|------------|------------|
| `user` | ✅ | ❌ | ❌ | ❌ |
| `renter` | ✅ | ✅ | ✅ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ |

---

## 4.5 Future: Admin Dashboard (Optional Enhancement)

For a production app, consider building an admin dashboard at `/admin` where admins can:

1. View all users and their roles
2. Promote/demote users
3. View all listings
4. Moderate content

### Quick Admin User List Query

```sql
-- Get all users with their listings count
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  COUNT(r.id) as listings_count
FROM public.profiles p
LEFT JOIN public.rentals r ON r.owner_id = p.id
GROUP BY p.id
ORDER BY p.created_at DESC;
```

---

## 4.6 Security Reminder

⚠️ **Important:** Role changes should ONLY be done via:
- Direct SQL through Supabase MCP tools
- A protected admin API route (future enhancement)

**Never allow users to change their own role** through the frontend. The RLS policies prevent this, but it's good to keep this in mind when building additional features.

---

## 4.7 Testing Role-Based Access

After setting up roles, test the following scenarios:

### As `user`:
- [ ] Can view all listings on home page
- [ ] Can view individual listing details
- [ ] Cannot see "Create Listing" option
- [ ] Cannot see delete buttons on any cards
- [ ] Profile page shows "user" role

### As `renter`:
- [ ] Can view all listings
- [ ] Can access `/rentals/create` page
- [ ] Can create new listings with image upload
- [ ] Can see delete button ONLY on own listings
- [ ] Profile page shows own listings with delete option

### As `admin`:
- [ ] Can view all listings
- [ ] Can create listings
- [ ] Can see delete button on ALL listings
- [ ] Can delete any listing (not just own)
- [ ] Profile page shows "admin" badge

---

## Quick Reference: Common SQL Commands

```sql
-- Make someone an admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'email@example.com';

-- Make someone a renter  
UPDATE public.profiles SET role = 'renter' WHERE email = 'email@example.com';

-- Demote to regular user
UPDATE public.profiles SET role = 'user' WHERE email = 'email@example.com';

-- List all admins
SELECT email, full_name FROM public.profiles WHERE role = 'admin';

-- List all renters
SELECT email, full_name FROM public.profiles WHERE role = 'renter';

-- Count users by role
SELECT role, COUNT(*) FROM public.profiles GROUP BY role;
```

---

**Previous:** [Phase 3: Frontend Implementation](./PHASE_3_FRONTEND.md)  
**Back to:** [Implementation Plan Overview](../IMPLEMENTATION_PLAN.md)
