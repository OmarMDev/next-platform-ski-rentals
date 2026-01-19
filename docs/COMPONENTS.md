# Components Reference

> Reusable UI components for SkiNB

---

## Overview

| Component | Type | Description |
|-----------|------|-------------|
| [`RentalCard`](#rentalcard) | Server | Displays a rental listing card |
| [`DeleteButton`](#deletebutton) | Client | Delete rental with confirmation |
| [`EditButton`](#editbutton) | Server | Link to edit rental page |
| [`AuthButton`](#authbutton) | Client | Login/Logout toggle button |
| [`Card`](#card) | Server | Generic content card wrapper |
| [`ContextAlert`](#contextalert) | Server | Environment-aware alert banner |
| [`FeedbackForm`](#feedbackform) | Client | Contact/feedback form |
| [`ImageUpload`](#imageupload) | Client | Supabase storage image uploader |
| [`SubmitButton`](#submitbutton) | Client | Form submit with loading state |

---

## RentalCard

Displays a rental listing with image, price, owner info, and action buttons.

**Location:** `components/rental-card.jsx`

**Type:** Server Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rental` | `Rental` | Yes | Rental object with owner relation |
| `userProfile` | `Profile \| null` | No | Current user's profile for action visibility |

### Usage

```jsx
import { RentalCard } from '@/components/rental-card';

<RentalCard 
  rental={rental} 
  userProfile={userProfile} 
/>
```

### Rental Object Shape

```typescript
interface Rental {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  owner_id: string;
  owner?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}
```

### Features

- Displays rental image or placeholder emoji
- Shows price badge overlay
- Owner name display
- "Details" link button
- Conditional Edit/Delete buttons based on permissions

---

## DeleteButton

Client component for deleting rentals with confirmation dialog.

**Location:** `components/delete-button.jsx`

**Type:** Client Component (`'use client'`)

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rentalId` | `string` | Yes | UUID of rental to delete |
| `userProfile` | `Profile \| null` | No | Current user's profile |
| `ownerId` | `string` | Yes | UUID of rental owner |

### Usage

```jsx
import { DeleteButton } from '@/components/delete-button';

<DeleteButton 
  rentalId={rental.id}
  userProfile={userProfile}
  ownerId={rental.owner_id}
/>
```

### Behavior

- Only renders if user can delete (owner or admin)
- Shows confirmation dialog before deletion
- Displays loading state during operation
- Refreshes page on success
- Shows error toast on failure

---

## EditButton

Server component that renders an edit link if user has permission.

**Location:** `components/edit-button.jsx`

**Type:** Server Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rentalId` | `string` | Yes | UUID of rental to edit |
| `userProfile` | `Profile \| null` | No | Current user's profile |
| `ownerId` | `string` | Yes | UUID of rental owner |

### Usage

```jsx
import { EditButton } from '@/components/edit-button';

<EditButton 
  rentalId={rental.id}
  userProfile={userProfile}
  ownerId={rental.owner_id}
/>
```

### Visibility Rules

- Shows for rental owner (any role)
- Shows for admins (any rental)
- Hidden for non-owners and guests

---

## AuthButton

Client component that toggles between Login and Logout states.

**Location:** `components/auth-button.jsx`

**Type:** Client Component (`'use client'`)

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `User \| null` | No | Current authenticated user |

### Usage

```jsx
import { AuthButton } from '@/components/auth-button';

// In header component
<AuthButton user={user} />
```

### Behavior

- Shows "Sign In" link when logged out
- Shows "Sign Out" button when logged in
- Handles sign out and redirects to home

---

## Card

Generic card wrapper with consistent styling.

**Location:** `components/card.jsx`

**Type:** Server Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Card content |
| `className` | `string` | No | Additional CSS classes |
| `title` | `string` | No | Card header title |

### Usage

```jsx
import { Card } from '@/components/card';

<Card title="Settings">
  <p>Card content here</p>
</Card>
```

---

## ContextAlert

Displays environment-aware alert banners (dev, preview, production).

**Location:** `components/context-alert.jsx`

**Type:** Server Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'info' \| 'warning' \| 'error'` | No | Alert style variant |

### Usage

```jsx
import { ContextAlert } from '@/components/context-alert';

<ContextAlert type="info" />
```

### Behavior

- Auto-detects Netlify deployment context
- Shows different messages for dev/preview/production
- Can be hidden in production

---

## ImageUpload

Client component for uploading images to Supabase Storage.

**Location:** `components/image-upload.jsx`

**Type:** Client Component (`'use client'`)

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bucket` | `string` | Yes | Supabase storage bucket name |
| `onUpload` | `(url: string) => void` | Yes | Callback with uploaded image URL |
| `existingUrl` | `string \| null` | No | Current image URL for preview |

### Usage

```jsx
import { ImageUpload } from '@/components/image-upload';

const [imageUrl, setImageUrl] = useState(null);

<ImageUpload 
  bucket="gear"
  onUpload={setImageUrl}
  existingUrl={imageUrl}
/>
```

### Features

- Drag and drop support
- Image preview
- Upload progress indicator
- File type validation
- Size limit enforcement (5MB)

---

## SubmitButton

Form submit button with loading state using React 19's `useFormStatus`.

**Location:** `components/submit-button.jsx`

**Type:** Client Component (`'use client'`)

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Button label |
| `className` | `string` | No | Additional CSS classes |
| `loadingText` | `string` | No | Text shown while submitting |

### Usage

```jsx
import { SubmitButton } from '@/components/submit-button';

<form action={handleSubmit}>
  <SubmitButton loadingText="Saving...">
    Save Changes
  </SubmitButton>
</form>
```

### Behavior

- Auto-disables during form submission
- Shows loading spinner and custom text
- Works with Server Actions

---

## Design System

All components follow the "Lodge & Luxury" design system:

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-teal` | `#7C9C95` | Primary accent |
| `--color-sage` | `#A4B4A8` | Secondary accent |
| `--color-white` | `#FFFFFF` | Backgrounds |
| `--color-off-white` | `#F8F8F8` | Card backgrounds |

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| `rounded-full` | `9999px` | Buttons, badges |
| `rounded-3xl` | `24px` | Cards |
| `rounded-2xl` | `16px` | Inputs |

### Buttons

```jsx
// Primary (pill)
<button className="px-6 py-3 bg-black text-white rounded-full">
  Primary Action
</button>

// Secondary (outline)
<button className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-full">
  Secondary Action
</button>
```

### Cards

```jsx
<div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
  Card content
</div>
```
