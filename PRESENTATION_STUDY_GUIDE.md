# Karger Admin — Project Structure Study Guide

Use this before your teacher presentation. Practice saying the short answers out loud.

---

## 1. What this project is (say this first)

**Karger Admin** is an **admin panel frontend** for the Karger platform.

> “Karger connects clients to professionals for various services. This project is the admin dashboard where admins manage users, posts, fields, and search.”

**Important facts:**

- This repo = **UI + authentication + API calls**
- The **backend + database** are separate (usually `http://localhost:3001`)
- This app runs on **port 3000** with `npm run dev`
- Package name in `package.json`: `one-stop-admin-panel`

```
Browser
   ↓
Next.js Admin (port 3000)
   ├── middleware.ts  → checks login + admin role
   ├── app/ pages     → screens (Dashboard, Employees, …)
   ├── app/actions    → Server Actions (talk to API)
   └── NextAuth       → JWT session with accessToken
          ↓
External REST API (port 3001)  ← real backend + database
```

---

## 2. Tech stack (short answer)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Radix) |
| Auth | NextAuth v5 (credentials + JWT) |
| Forms | react-hook-form + Zod |
| Tables / charts | TanStack Table, Recharts |
| Client state | Zustand (some stores; many pages use local React state) |

**One sentence for teacher:**  
“I built the admin frontend with Next.js and TypeScript; it uses NextAuth for login and talks to a separate REST API.”

---

## 3. Main folders (memorize these)

| Folder / file | What it is | What you say |
|---------------|------------|--------------|
| `app/` | Pages, routes, Server Actions, NextAuth API route | “All screens and server-side API calls live here.” |
| `components/` | Reusable UI (sidebar, header, shadcn `ui/`, providers) | “Shared layout and UI components.” |
| `lib/` | Auth config, API endpoints, helpers, stores | “Configuration and helpers.” |
| `types/` | TypeScript types (employee, employer, post, field…) | “Type definitions for our data.” |
| `hooks/` | Small React hooks | “Reusable client hooks.” |
| `public/` | Images and logos | “Static assets.” |
| `middleware.ts` | Protects `/admin` | “Blocks non-admin users from admin pages.” |

---

## 4. How routing works

Next.js **App Router**: **folder name = URL**.

| URL | Meaning |
|-----|---------|
| `/` | Redirects to `/login` |
| `/login`, `/forgot-password`, `/reset-password` | Auth pages |
| `/admin` | Dashboard |
| `/admin/admins` | Manage admins |
| `/admin/employees`, `/admin/employees/[id]` | Employees list + detail |
| `/admin/employers`, `/admin/employers/[id]` | Employers list + detail |
| `/admin/posts`, `/admin/posts/[id]` | Posts |
| `/admin/fields` | Service / job fields |
| `/admin/search` | Search |
| `/admin/profile` | Admin profile |

**Admin shell** (sidebar + header): `app/admin/layout.tsx`  
**Menu items**: `components/layout/sidebar.tsx`  
**Feature UI**: colocated in `_components/` next to each page (tables, dialogs)

**What to say:**  
“I use file-based routing. For example, `app/admin/employees/page.tsx` becomes `/admin/employees`. Detail pages use `[id]` for dynamic routes.”

---

## 5. How data flows (very important)

1. Admin opens a page under `/admin/...`
2. Page calls a **Server Action** in `app/actions/` (`admin.ts`, `post.ts`, `fields.ts`, etc.)
3. Action reads the NextAuth session token and `fetch`es the backend
4. API URLs are centralized in `lib/config/api-endpoints.ts`
5. Response is shown in tables, charts, or dialogs

**There is no database in this frontend repo.**

**What to say:**  
“The page does not talk to a database directly. It calls a Server Action, which sends an authenticated request to our backend API, then shows the result.”

---

## 6. Auth (if teacher asks “how is login secured?”)

1. Login form → NextAuth Credentials → backend `/admin/login`
2. Session stores JWT with `accessToken` and `role`
3. `middleware.ts`:
   - `/admin/*` without login → redirect `/login`
   - role must be `admin`
   - already logged in on `/login` → redirect `/admin`
4. Only Next.js API route in this project: `app/api/auth/[...nextauth]/route.ts`

**What to say:**  
“Login goes through NextAuth. The middleware checks that the user is logged in and has the admin role before allowing access to `/admin` pages.”

---

## 7. Likely teacher questions — practice aloud

**Q: What is this project?**  
A: Admin dashboard for Karger to manage admins, employees, employers, posts, fields, and search.

**Q: Frontend or backend?**  
A: Frontend (Next.js). Backend is a separate REST API.

**Q: Where is the database?**  
A: Not in this repo; on the backend API server.

**Q: Why folders like `app/admin/employees/_components`?**  
A: Feature colocation — keep page UI next to the route that uses it.

**Q: What is a Server Action?**  
A: Server-side functions (`"use server"`) the UI calls to talk to the API securely with the auth token.

**Q: How do you start it?**  
A: Set `.env.local` (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_API_BASE_URL`), run backend on 3001, then `npm run dev` on 3000.

**Q: What can an admin do?**  
A: View dashboard stats, manage admins, list/ban/delete employees and employers, manage posts and fields, and search users.

---

## 8. Live demo path (practice this order)

Do this live for the teacher. Keep it short (about 2–3 minutes).

### Before you start

1. Backend API is running on **port 3001**
2. Admin app is running: `npm run dev` → **http://localhost:3000**
3. You have a valid admin email and password

### Demo steps

| Step | What you do | What you say |
|------|-------------|--------------|
| 1 | Open `http://localhost:3000` | “Root redirects to login.” |
| 2 | Show `/login` | “Admin signs in with email and password. Forms are validated with Zod.” |
| 3 | Log in | “NextAuth creates a session. Middleware only allows role admin into `/admin`.” |
| 4 | Show Dashboard `/admin` | “Dashboard loads stats via Server Actions: admins, employees, employers, fields, posts.” |
| 5 | Open sidebar | “Navigation: Admins, Employees, Employers, Posts, Search, Fields, Profile.” |
| 6 | Go to **Employees** | “List of employees from the API. I can open a detail page with `[id]`.” |
| 7 | Open one employee detail (optional) | “Detail route: `/admin/employees/[id]`.” |
| 8 | Go to **Posts** (or Fields) | “Same pattern: page + `_components` table/dialogs + Server Actions.” |
| 9 | Try opening `/admin` in a private window without login (optional) | “Middleware redirects unauthenticated users to `/login`.” |

### Recommended short path if time is limited

**Login → Dashboard → Employees → Posts**

That shows: auth, layout, list pages, and the API connection pattern.

### If something fails during demo

| Problem | Likely cause | What to say |
|---------|--------------|-------------|
| Login fails | Backend not running or wrong credentials | “Admin auth depends on the API at port 3001.” |
| Empty tables | Backend has no data / API error | “UI is ready; data comes from the API.” |
| Images broken | Backend uploads URL / `next.config` | “Images are loaded from the backend uploads folder.” |

---

## 9. Suggested 2–3 minute talk order

1. **Purpose:** Karger Admin panel  
2. **Stack:** Next.js + TypeScript + Tailwind/shadcn + NextAuth  
3. **Structure:** `app` pages, `components` UI, `lib` config/auth, `actions` API calls  
4. **Demo:** Login → Dashboard → Employees/Posts  
5. **Architecture:** Browser → Next.js → Server Actions → External API  

---

## 10. Files you can open if teacher asks to see code

| Topic | File |
|-------|------|
| Protect routes | `middleware.ts` |
| Login page | `app/login/page.tsx` |
| Admin layout / sidebar shell | `app/admin/layout.tsx` |
| Sidebar menu | `components/layout/sidebar.tsx` |
| Dashboard | `app/admin/page.tsx` |
| API URL map | `lib/config/api-endpoints.ts` |
| Server Actions example | `app/actions/admin.ts` |
| NextAuth route | `app/api/auth/[...nextauth]/route.ts` |
