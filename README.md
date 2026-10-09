# YSSE Alumni Directory (Frontend Demo)

A modern, high-fidelity frontend demo for the **YSSE Alumni Directory** (Youth School for Social Entrepreneurs). Built strictly according to the specifications with a decoupled mock service layer (`src/services/*.ts` returning Promises + localStorage) so an Express/PostgreSQL API can replace it later without touching any React UI components.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🎨 Theme & Design System (Single Source of Truth)

All colors are strictly defined as CSS variables in `src/styles/tokens.css` and mapped in `tailwind.config.js`. Zero hardcoded hexes in markup:

```css
--bg:            #18251D   /* page background */
--surface:       #1F3027   /* cards, inputs, modals */
--border:        #2E4336   /* dividers, card borders */
--border-strong: #3B5244   /* input borders, outline buttons */
--text:          #EEF3E8   /* primary text */
--muted:         #9DB0A2   /* secondary text, labels */
--accent:        #B7FF72   /* primary buttons, links, active states */
--on-accent:     #18251D   /* text on accent */
```

### Visual Style Rules
- **Flat Surfaces & 1px Borders**: No gradients, glows, glassmorphism, heavy shadows, emoji, or decorative blobs.
- **Accents Used Sparingly**: Reserved for primary action buttons, active indicator bars, and small highlights.
- **Geometry**: Strict `8px` corner radius for cards, inputs, dialogs, drawers; `999px` strictly for chips and badges.
- **Typography**:
  - Headings: `Bricolage Grotesque`
  - Body: `Instrument Sans` (16px / 1.6 line-height)
  - Small labels & chips: `JetBrains Mono`
- **Buttons**: Minimum `44px` height touch targets, visible focus-visible rings (`2px solid var(--accent)`).
- **Motion**: Subtle 150–200ms ease transitions; smooth carousel drift with pause on hover/focus and `prefers-reduced-motion` compliance.

---

## 👥 Roles & Access Control

Account and profile are **separate concepts**:
- `User { id, name, email, avatarUrl?, role: "member" | "alumni" | "admin", lastLoginAt }`
- `AlumniProfile { id, userId, ... }` (only alumni have one; admin never does)

### Capability Matrix (enforced by `ProtectedRoute` & `useCan(permission)`)
| Capability | Visitor | Member | Alumni | Admin |
|:---|:---:|:---:|:---:|:---:|
| View landing, directory, public profiles | ✅ | ✅ | ✅ | ✅ |
| See verified email/LinkedIn (if alumnus privacy permits) | ❌ | ✅ | ✅ | ✅ |
| Always see full contact data | ❌ | ❌ | ❌ | ✅ |
| Browse sessions | ✅ | ✅ | ✅ | ✅ |
| Request a 1:1 session | ❌ | ✅ | ✅ | ✅ |
| Create/edit own AlumniProfile at `/me` | ❌ | ❌ | ✅ | ❌ |
| Upload photo (~400px resize) & privacy flags | ❌ | ❌ | ✅ | ❌ |
| Offer sessions, accept/decline incoming requests | ❌ | ❌ | ✅ | ❌ |
| See own request history | ❌ | ✅ | ✅ | ✅ |
| Approve/reject profiles with reason | ❌ | ❌ | ❌ | ✅ |
| Edit/hide/delete any alumnus | ❌ | ❌ | ❌ | ✅ |
| Import CSV (3-step stepper) & export CSV | ❌ | ❌ | ❌ | ✅ |
| View admin dashboard, charts, activity log | ❌ | ❌ | ❌ | ✅ |
| Send stale-profile reminders (6+ months) | ❌ | ❌ | ❌ | ✅ |
| Manage directory settings and admin accounts | ❌ | ❌ | ❌ | ✅ |

### Quick Role Switcher
Click the **Role Switcher pill** or user avatar menu at the top right to switch between **Visitor**, **Member**, **Alumni**, and **Admin** on the fly.

---

## 🗺️ Application Features

### 1. Public & Member Portal
- **Landing Page (`/`)**:
  - Sticky navbar with logo, directory links, sessions, role menu.
  - Hero with value statement, search input navigating directly to `/alumni?q=`.
  - Dynamic stats strip computed directly from mock data (32+ verified alumni, batches, top companies, countries).
  - "Find alumni by" preset filter cards (City, Field, Wing, Batch).
  - Embla Carousel: Smooth drift, pause on hover/focus, cards with 4:5 portraits.
  - Alumni success stories, sessions teaser, 3-step onboarding guide, accessible Radix FAQ accordion.
- **Directory (`/alumni`)**:
  - URL-synced search, multi-faceted filtering (Batch, Wing, Company, Country, Field, "Open to sessions").
  - Grid / List view toggle, sort options, active filter chips with one-click clear.
  - Skeleton loading states and empty state with reset filter action.
- **Alumni Profile (`/alumni/:id`)**:
  - 4:5 portrait, role, organization, bio, career timeline nodes, expertise tags.
  - Privacy-gated email and LinkedIn URLs (Visitors prompted to sign in).
  - "Request a session" Radix Dialog with form validation.
  - Similar alumni recommendations based on shared wing or field.
- **Sessions Portal (`/sessions`)**:
  - Tabs for "Browse offers" and "My requests" (plus "Requests to me" with Accept / Decline / Mark Done actions for alumni).
- **My Profile (`/me`)** (Alumni only):
  - Profile completion meter (0–100%).
  - Photo upload with client-side canvas crop/resize to ~400px.
  - Approval status badge (`Pending`, `Approved`, `Rejected` with admin reason).
  - Privacy toggles (`isEmailPublic`, `isLinkedinPublic`), session availability, and career history editor.
- **Account (`/account`)** (Member, Alumni, Admin):
  - Personal account settings, avatar, interests tags.

### 2. Admin Portal (`/admin/*`)
Dense, professional internal tool shell (Linear / Stripe Dashboard caliber):
- **Fixed Left Sidebar (240px)**: Grouped into Overview, Manage, and System.
- **Top Bar**: Breadcrumbs, **Cmd/Ctrl + K Command Palette** (jump to any page or alumnus instantly), notifications, role switcher, admin profile.
- **Admin Dashboard (`/admin`)**:
  - 4 stat tiles with 30-day delta trends and quick click-throughs.
  - Recharts visualizations: Alumni by batch, industry, country, and registrations over time with date-range filters.
  - "Needs attention" panel & recent audit activity feed.
- **Approvals (`/admin/approvals`)**:
  - Review queue with status tabs (`Pending`, `Approved`, `Rejected`).
  - Right-side drawer inspection with side-by-side edit diffs.
  - One-click Approve and Reject (with mandatory rejection reason dialog). Bulk approve.
- **Master Alumni Table (`/admin/alumni`)**:
  - Dense data table, live search, multi-column filters, column visibility toggles, density toggles.
  - Row actions: View, Edit drawer, Hide/Show, Delete confirmation.
  - **Export Filtered CSV** via PapaParse respecting active filters.
- **Session Requests (`/admin/sessions`)**:
  - Mentorship session request overview, status tabs, message inspection drawer, override controls.
- **Import CSV (`/admin/import`)**:
  - 3-step stepper: Drag-and-drop upload & sample template download -> Column mapping & first 20 rows preview with per-row validation and duplicate detection -> Summary confirmation and error report download.
- **Stale Profiles (`/admin/stale`)**:
  - Profiles unupdated for 6+ months; bulk & single reminder dispatch (recorded in activity log).
- **Activity Log (`/admin/activity`)**:
  - Audit trail filterable by actor, action, and target.
- **Settings (`/admin/settings`)**:
  - Account, Directory approval toggle & default privacy, reminder schedule & email preview, admin user roster & invite modal.

---

## 🛠️ Decoupled Service Layer

All mock data is isolated under `src/mock/` and accessed exclusively through `src/services/*.ts` returning Promises:
- `alumniService.ts`: Alumnus directory filtering, pagination, profile fetching, profile updates, and similar alumni queries.
- `sessionService.ts`: Mentorship offers and request lifecycle management (`createRequest`, `respondToRequest`).
- `adminService.ts`: Approvals, bulk updates, statistics aggregation, stale detection, reminder dispatches, and CSV import ingestion.
- `authService.ts`: Session simulation and role switcher.

Replacing the mock data with a real Express/PostgreSQL API requires only updating the endpoint URLs inside `src/services/*.ts`.

---

## 🧪 Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + `src/styles/tokens.css`
- **Routing**: React Router v6 (Lazy code splitting with `<Suspense>`)
- **Primitives**: Radix UI (Dialog, DropdownMenu, Select, Tabs, Accordion, Tooltip)
- **Data Fetching**: TanStack Query (React Query v5)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **CSV Ingestion/Export**: PapaParse
- **Icons**: Lucide React
