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
- **Data Storage**: PostgreSQL database via Drizzle ORM (data persists across deployments)
- **File Uploads**: Presigned URL flow using Google Cloud Storage via Replit's object storage integration

### Data Models
- **Users**: Basic authentication (id, username, password)
- **Projects**: Portfolio items with bilingual fields (Hebrew + English), gallery arrays, metadata
- **Contact Submissions**: Form submissions storage

### Key Design Decisions

1. **Bilingual Support**: All content fields have English variants (e.g., `title`/`titleEn`). Language context determines which to display with RTL/LTR direction switching.

2. **File Uploads**: Files upload directly to `/api/upload` endpoint using multipart/form-data with multer, stored in `public/uploads` directory. This replaced the previous presigned URL flow to eliminate external DNS dependencies.

3. **File-Based Storage**: Uses local JSON file storage (`server/projects.json`) via the FileStorage class for all project data. This replaced PostgreSQL to eliminate intermittent database connection errors ("getaddrinfo EAI_AGAIN helium"). Projects persist across deployments via the file system. Atomic writes (temp file + rename) prevent data corruption.

4. **Shared Schema**: Schema types live in `/shared/schema.ts` allowing type sharing between frontend and backend via Drizzle-Zod integration for validation.

5. **Server-Side Rendering Not Used**: This is a client-side React SPA with Express serving static files in production and Vite dev server in development.

## External Dependencies

### Database
- **PostgreSQL**: Projects and contact submissions are stored in PostgreSQL database (persists across deployments)
- **Drizzle ORM**: Type-safe database operations with schema defined in `shared/schema.ts`
- **Drizzle Kit**: Schema migrations via `npm run db:push`

### Cloud Services
- **Google Cloud Storage**: Object storage for file uploads, accessed via Replit sidecar endpoint at `127.0.0.1:1106`

### Third-Party Libraries
- **@uppy**: File upload UI with AWS S3-compatible presigned URL support
- **framer-motion**: Animation library for scroll effects and transitions
- **react-hook-form** + **zod**: Form handling with validation
- **shadcn/ui** (Radix primitives): Comprehensive UI component library

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required for data persistence)
- `PUBLIC_OBJECT_SEARCH_PATHS`: Optional paths for public object storage access