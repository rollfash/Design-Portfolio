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
- **Data Storage**: File-based storage (JSON) in `server/projects.json` (workaround for PostgreSQL DNS issues)
- **File Uploads**: Presigned URL flow using Google Cloud Storage via Replit's object storage integration

### Data Models
- **Users**: Basic authentication (id, username, password)
- **Projects**: Portfolio items with bilingual fields (Hebrew + English), gallery arrays, metadata
- **Contact Submissions**: Form submissions storage

### Key Design Decisions

1. **Bilingual Support**: All content fields have English variants (e.g., `title`/`titleEn`). Language context determines which to display with RTL/LTR direction switching.

2. **Presigned URL Uploads**: Files upload directly to cloud storage via presigned URLs, avoiding server memory constraints. The flow is: request URL → upload to storage → store path reference.

3. **File-Based Storage**: Due to persistent PostgreSQL DNS errors ("getaddrinfo EAI_AGAIN helium"), the application uses file-based storage via `FileStorage` class in `server/file-storage.ts`. Data is stored in `server/projects.json` with atomic writes (temp file + rename), cache invalidation, and concurrent write protection.

4. **Shared Schema**: Database schema lives in `/shared/schema.ts` allowing type sharing between frontend and backend via Drizzle-Zod integration.

5. **Server-Side Rendering Not Used**: This is a client-side React SPA with Express serving static files in production and Vite dev server in development.

## External Dependencies

### Data Storage
- **File-based storage**: Projects and contact submissions are stored in `server/projects.json`
- **PostgreSQL (disabled)**: Originally used Drizzle ORM with PostgreSQL, but switched to file-based storage due to persistent DNS errors with Neon database hostname resolution
- Note: The Drizzle schema in `shared/schema.ts` is maintained for type definitions but not actively used for persistence

### Cloud Services
- **Google Cloud Storage**: Object storage for file uploads, accessed via Replit sidecar endpoint at `127.0.0.1:1106`

### Third-Party Libraries
- **@uppy**: File upload UI with AWS S3-compatible presigned URL support
- **framer-motion**: Animation library for scroll effects and transitions
- **react-hook-form** + **zod**: Form handling with validation
- **shadcn/ui** (Radix primitives): Comprehensive UI component library

### Environment Variables Required
- `PUBLIC_OBJECT_SEARCH_PATHS`: Optional paths for public object storage access
- `DATABASE_URL`: (Deprecated) PostgreSQL connection string - no longer used due to DNS errors