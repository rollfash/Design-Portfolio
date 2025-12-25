# Gal Shinhorn Portfolio

## Overview

A bilingual (Hebrew/English) portfolio website for an interior and set designer. The application showcases design projects with a modern, visually-driven interface featuring animated galleries, project management via an admin panel, and a contact form system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for app state (projects, language)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and scroll-based animations
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful endpoints under `/api/*`
- **Data Storage**: Firebase Firestore for project data (persists across deployments)
- **File Uploads**: Multipart/form-data uploads to `/api/upload`, stored in Replit Object Storage for persistence. Supports images and videos (up to 100MB).

### Data Models
- **Users**: Basic authentication (id, username, password)
- **Projects**: Portfolio items with bilingual fields (Hebrew + English), gallery arrays, metadata
- **Contact Submissions**: Form submissions storage

### Key Design Decisions

1. **Bilingual Support**: All content fields have English variants (e.g., `title`/`titleEn`). Language context determines which to display with RTL/LTR direction switching.

2. **File Uploads**: Files upload directly to `/api/upload` endpoint using multipart/form-data with multer, stored in `public/uploads` directory. This replaced the previous presigned URL flow to eliminate external DNS dependencies.

3. **Firebase Firestore Storage**: Uses Firebase Firestore (external database) for all project data storage via the `FirebaseStorage` class in `server/firebase-storage.ts`. This ensures data persists across republishes and deployments. Firebase credentials are stored as environment secrets (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).

4. **Shared Schema**: Schema types live in `/shared/schema.ts` allowing type sharing between frontend and backend via Drizzle-Zod integration for validation.

5. **Server-Side Rendering Not Used**: This is a client-side React SPA with Express serving static files in production and Vite dev server in development.

## External Dependencies

### Third-Party Libraries
- **multer**: Handles multipart/form-data file uploads
- **framer-motion**: Animation library for scroll effects and transitions
- **react-hook-form** + **zod**: Form handling with validation
- **shadcn/ui** (Radix primitives): Comprehensive UI component library
- **Resend**: Email service for contact form notifications

### Environment Variables
No required environment variables for core functionality. Optional:
- Email integration secrets (managed via Replit integrations)

## SEO Implementation

Comprehensive SEO optimizations implemented for improved search engine visibility and accessibility:

### Meta Tags & Structured Data
- **Dynamic Meta Tags**: useSEO hook manages page-specific title, description, Open Graph, and Twitter Card tags with bilingual support (HE/EN)
- **Canonical URLs**: Auto-generated canonical links for each page to prevent duplicate content issues
- **Hreflang Tags**: Uses x-default hreflang for SPAs with client-side language switching (since the same URL serves all languages, per Google's guidelines)
- **JSON-LD Structured Data**: 
  - Global Person/Organization schema in index.html
  - Project-specific CreativeWork schema on project detail pages
  - Provides rich snippets for search engines

### Site Discovery
- **Dynamic Sitemap**: `/sitemap.xml` endpoint auto-generates XML sitemap with all pages and projects, including hreflang alternates
- **Robots.txt**: `/robots.txt` endpoint with proper crawl directives (allows all except /admin, references sitemap)

### Accessibility & Semantic HTML
- Proper HTML5 landmarks (nav, main, footer) with aria-labels
- H1 hierarchy maintained across all pages
- Skip-to-content link for keyboard navigation
- Meaningful alt text for all images via generateAltText helper
- Lazy loading for images (eager for hero images, lazy for below-fold)
- ARIA labels on interactive elements (buttons, links, menus)
- WCAG 2.2 AA compliant navigation and footer

### Performance
- Font preconnect to Google Fonts for faster loading
- Lazy loading images to reduce initial page load
- Meta viewport configured for responsive behavior

### Admin & Error Pages
- Admin panel has noindex meta tag to prevent search indexing
- Custom 404 page with noindex and helpful navigation links