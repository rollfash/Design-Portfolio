# Gal Shinhorn Portfolio — Complete Codebase Documentation

## What This Project Is

A bilingual portfolio website for **Gal Shinhorn**, an interior and set designer based in Israel. The site is the designer's professional online presence — it showcases past projects with rich image and video galleries, describes services offered, tells her story on an About page, and provides a contact form for potential clients to reach out.

The entire website is written in both **Hebrew** and **English**, with full right-to-left (RTL) support for Hebrew and left-to-right (LTR) for English. Visitors can switch languages instantly with a toggle in the navigation bar. The site is also fully accessible (WCAG 2.2 AA) and SEO-optimized.

A private **Admin Panel** at `/admin` allows Gal to manage all project content — adding, editing, and deleting projects, uploading images and videos, controlling which projects appear on the home page, and reordering gallery images — all without touching any code.

---

## Tech Stack at a Glance

| Layer | Technology |
|---|---|
| Frontend framework | React 18 with TypeScript |
| Routing | Wouter |
| Server state | TanStack React Query |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Build tool | Vite |
| Backend | Node.js + Express |
| Project data | Firebase Firestore |
| Media storage | Replit Object Storage |
| Analytics data | PostgreSQL (via Drizzle ORM) |
| Email | Resend |
| Auto-translation | OpenAI GPT-4.1 Mini (via Replit AI Integrations) |

---

## Directory Structure

```
/
├── client/                    # Everything the browser runs
│   ├── index.html             # Single HTML shell; contains meta/OG tags and JSON-LD
│   └── src/
│       ├── App.tsx            # Root — providers, router, analytics hook
│       ├── pages/
│       │   ├── Home.tsx       # Landing page with hero and featured projects
│       │   ├── Portfolio.tsx  # Full project grid
│       │   ├── ProjectDetail.tsx  # Individual project page with gallery
│       │   ├── Services.tsx   # Services offered page
│       │   ├── About.tsx      # About the designer
│       │   ├── Contact.tsx    # Contact form
│       │   ├── Admin.tsx      # Admin panel (password-protected)
│       │   └── not-found.tsx  # 404 page
│       ├── components/
│       │   ├── layout/        # Shared layout components (Nav, Footer, etc.)
│       │   ├── ObjectUploader.tsx  # Reusable drag-and-drop file uploader
│       │   └── ui/            # shadcn/ui component library (Button, Dialog, etc.)
│       ├── hooks/
│       │   ├── use-analytics.ts    # Fires page view events on route change
│       │   ├── use-upload.ts       # File upload logic (images + videos)
│       │   ├── use-translation.ts  # Calls /api/translate for Hebrew→English
│       │   ├── use-mobile.tsx      # Responsive breakpoint detection
│       │   └── use-toast.ts        # Toast notification helper
│       └── lib/
│           ├── project-context.tsx   # Global project state (fetch, add, update, delete)
│           ├── language-context.tsx  # Global language state (he/en) + RTL toggle
│           ├── admin-token.ts        # Reads admin session token from sessionStorage
│           ├── seo.tsx               # useSEO hook — sets page title, description, og tags
│           ├── project-utils.ts      # Helpers (bilingual field selection, etc.)
│           ├── queryClient.ts        # TanStack Query client configuration
│           └── utils.ts              # General utilities (cn class merger, etc.)
│
├── server/                    # Express backend
│   ├── index.ts               # Server entry point — middleware, helmet, rate limiting
│   ├── routes.ts              # All API route definitions
│   ├── storage.ts             # IStorage interface (data abstraction layer)
│   ├── firebase-storage.ts    # Firebase Firestore implementation of IStorage
│   ├── database-storage.ts    # PostgreSQL implementation of IStorage (unused in prod)
│   ├── db.ts                  # Drizzle + PostgreSQL connection with retry logic
│   ├── translate.ts           # OpenAI translation utility
│   ├── resend-client.ts       # Resend email client setup
│   ├── static.ts              # Static file serving for production
│   ├── vite.ts                # Vite dev server integration
│   └── replit_integrations/   # Auto-generated integration boilerplate
│       ├── object_storage/    # Object Storage service helpers
│       ├── chat/              # (unused) chat integration scaffold
│       └── image/             # (unused) image generation scaffold
│
├── shared/
│   └── schema.ts              # Drizzle schema + Zod types shared by client and server
│
├── replit.md                  # Living architecture summary (kept up to date)
└── DOCS.md                    # This file
```

---

## How Data Flows

### Reading projects (public)

```
Browser → GET /api/projects → FirebaseStorage.getAllProjects() → Firestore → JSON response
```

The `ProjectProvider` in `project-context.tsx` fetches all projects once on mount and caches them with React Query. Every page that needs project data reads from this context — no extra network requests.

### Writing projects (admin only)

```
Admin panel → POST/PATCH/DELETE /api/projects
  → requireAdmin middleware checks x-admin-token header
  → sanitizeObject() strips XSS from all string fields
  → Zod schema validates types and required fields
  → FirebaseStorage updates Firestore document
  → React Query cache invalidated → UI updates
```

### File uploads (admin only)

```
Admin selects image/video
  → use-upload.ts sends POST /api/upload (multipart/form-data)
  → requireAdmin middleware checks token
  → multer parses file (100 MB max, image/video MIME types only)
  → Server gets presigned URL from Replit Object Storage
  → File buffer PUT to Object Storage
  → Server returns the object path
  → Admin panel stores the path as the project's image/gallery URL
```

### Contact form

```
Visitor fills form → POST /api/contact
  → Rate limited: 5 submissions per IP per hour
  → Zod validation + XSS sanitization
  → Saved to Firebase Firestore (contactSubmissions collection)
  → Resend sends email notification to galart1@gmail.com
```

### Analytics

```
Every route change → useAnalytics hook → POST /api/analytics/pageview
  → Bot filter (user-agent regex) — bots are silently dropped
  → Human visits saved to PostgreSQL page_views table
  → Admin panel reads GET /api/analytics/stats → dashboard numbers
```

---

## Key Features Explained

### Bilingual Support (Hebrew / English)

Every project has parallel fields for both languages:

| Hebrew field | English field |
|---|---|
| `title` | `titleEn` |
| `description` | `descriptionEn` |
| `category` | `categoryEn` |
| `role` | `roleEn` |
| `location` | `locationEn` |
| `services[]` | `servicesEn[]` |

The `LanguageContext` (`client/src/lib/language-context.tsx`) stores the current language (`"he"` or `"en"`) and exposes a `t(hebrewValue, englishValue)` helper that every component uses to pick the right string. When Hebrew is active, the document gets `dir="rtl"` and all flexbox/text directions flip accordingly.

### Auto-Translation

When an admin saves a project, the `use-translation.ts` hook checks whether any English fields are empty while their Hebrew counterparts have content. If so, it calls `POST /api/translate` for each missing field. The server uses OpenAI GPT-4.1 Mini to produce a professional English translation, and those values are merged back into the save payload. There is a toggle in the admin form to disable this for a particular save.

### Admin Panel

Located at `/admin`. The workflow:

1. Admin visits `/admin`, enters password.
2. `POST /api/admin/login` checks the password against the `ADMIN_PASSWORD` environment secret (never the client). On success, a cryptographically random 64-hex-character session token is returned.
3. Token stored in `sessionStorage` (clears on tab close). All subsequent write requests include `x-admin-token: <token>` header.
4. The server's `requireAdmin` middleware validates the token against an in-memory session map with a 24-hour TTL.
5. Admin can: create/edit/delete projects, toggle which projects appear on the home page (`showOnHome`), upload and reorder gallery images, and enable/disable auto-translation.

### SEO

- `useSEO` hook sets `<title>`, `<meta name="description">`, Open Graph, and Twitter Card tags per page.
- JSON-LD structured data (Person/CreativeWork schemas) lives in `index.html` and is extended per project page.
- `/sitemap.xml` — dynamically generated endpoint listing all pages and projects with hreflang tags.
- `/robots.txt` — allows all crawlers, blocks `/admin`, references the sitemap.
- Admin panel has a `noindex` meta tag.

---

## Database Models

Defined in `shared/schema.ts` using Drizzle ORM. The schema is the single source of truth — types are imported by both the frontend and backend.

### `projects` (stored in Firebase Firestore)
The schema in `shared/schema.ts` defines the shape; Firebase uses the same field names. Firebase was chosen because it persists data across Replit republishes automatically.

| Field | Type | Notes |
|---|---|---|
| id | string | Firebase auto-ID |
| title | string | Hebrew title (required) |
| titleEn | string | English title |
| category | string | Hebrew category (required) |
| categoryEn | string | English category |
| image | string | URL of cover image (required) |
| year | string | Year of project (required) |
| date | string | Full date string |
| location | string | Hebrew location |
| locationEn | string | English location |
| role | string | Hebrew role/credit |
| roleEn | string | English role/credit |
| description | string | Hebrew description |
| descriptionEn | string | English description |
| services | string[] | Hebrew services list |
| servicesEn | string[] | English services list |
| gallery | string[] | Array of media URLs |
| showOnHome | boolean | Whether shown on homepage |
| createdAt | timestamp | Auto-set on creation |

### `contactSubmissions` (stored in Firebase Firestore)

| Field | Type |
|---|---|
| id | string |
| name | string |
| email | string |
| type | string |
| budget | string |
| message | string |
| submittedAt | timestamp |

### `page_views` (stored in PostgreSQL)

| Field | Type |
|---|---|
| id | varchar UUID |
| path | string |
| sessionId | string |
| ip | string |
| userAgent | string |
| duration | integer (ms) |
| viewedAt | timestamp |

---

## API Reference

All endpoints are under the Express server on port 5000. In development, Vite proxies the frontend on the same port.

### Public endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/analytics/pageview` | Record a page view |
| GET | `/api/analytics/stats` | Get analytics summary |
| GET | `/api/translate/status` | Is translation available? |
| GET | `/sitemap.xml` | Dynamic XML sitemap |
| GET | `/robots.txt` | Robots instructions |

### Admin-only endpoints (require `x-admin-token` header)

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/login` | Login (rate-limited: 5/15 min) |
| POST | `/api/admin/logout` | Logout (clears session) |
| GET | `/api/admin/verify` | Check if token is still valid |
| POST | `/api/projects` | Create a new project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| POST | `/api/upload` | Upload image or video |
| POST | `/api/translate` | Translate Hebrew text to English |

---

## Security Layers

The app has several overlapping layers of protection:

### HTTP headers (Helmet)
`server/index.ts` applies Helmet middleware with a Content Security Policy that:
- Allows scripts only from self (plus inline for React)
- Allows styles from self, inline, and Google Fonts
- Blocks object embeds entirely
- Enforces HTTPS upgrades

### Rate limiting
Three tiers of rate limiting:
- **General API**: 100 requests per IP per 15 minutes
- **Contact form**: 5 submissions per IP per hour (prevents spam)
- **Admin login**: 5 attempts per IP per 15 minutes (prevents brute force)

### Admin authentication
- Password stored as `ADMIN_PASSWORD` environment secret — never in code or sent to the browser
- Login returns a 64-character random session token (stored in `sessionStorage`, clears on tab close)
- All write endpoints check `x-admin-token` header via `requireAdmin` middleware
- Sessions expire after 24 hours

### Input validation and sanitization
- All incoming data is passed through `sanitizeObject()` which uses the `xss` library to strip any HTML/script injection from string fields
- Data is then validated against strict Zod schemas derived from the Drizzle table definitions
- Project IDs in URL params are validated with a regex (`/^[a-zA-Z0-9_\-]+$/`) — any SQL injection or path traversal attempt is rejected before it reaches the database

### SQL injection
Not possible by design. The only SQL database (PostgreSQL for analytics) is accessed exclusively through Drizzle ORM's parameterized query builder. No raw SQL strings are ever built from user input.

### Image protection
Gallery images have `onContextMenu` and `onDragStart` set to `preventDefault`, `draggable="false"`, and `user-select: none` CSS — a soft deterrent against casual right-click saving.

---

## Environment Variables / Secrets

All secrets are stored in Replit's secret manager and are never committed to the codebase.

| Secret | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for the admin panel |
| `FIREBASE_PROJECT_ID` | Firebase project identifier |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | Replit Object Storage bucket |
| `PRIVATE_OBJECT_DIR` | Private object storage directory path |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Public object storage search paths |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Auto-set by Replit AI Integrations |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Auto-set by Replit AI Integrations |

Email (Resend) is configured via the Replit Resend integration and does not require a manually set API key.

---

## Development Setup

The project runs as a single workflow:

```
npm run dev
```

This starts the Express server on port 5000. In development, the Vite dev server is embedded into Express (via `server/vite.ts`) so both the API and the frontend are served from the same port with hot module replacement.

In production (`NODE_ENV=production`), Vite builds the frontend to `dist/public/` and Express serves it as static files.

---

## How to Add a New Page

1. Create `client/src/pages/MyPage.tsx`
2. Register the route in `client/src/App.tsx`:
   ```tsx
   <Route path="/my-page" component={MyPage} />
   ```
3. Add a nav link in the layout component
4. Use the `useSEO` hook at the top of the page for proper meta tags
5. Use `useLanguage()` from `language-context` to support bilingual text

## How to Add a New API Endpoint

1. Open `server/routes.ts`
2. Add the route handler (use `requireAdmin` middleware for any write operation)
3. Use `sanitizeObject()` + Zod validation on all `req.body` data
4. If storing to PostgreSQL: add the table to `shared/schema.ts` and run `npm run db:push`
5. If storing to Firebase: add the method to the `IStorage` interface in `storage.ts` and implement it in `firebase-storage.ts`
