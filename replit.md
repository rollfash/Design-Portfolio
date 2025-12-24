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
- **Data Storage**: Local JSON file storage (`server/projects.json`) with atomic writes (data persists across deployments)
- **File Uploads**: Direct multipart/form-data uploads to `/api/upload`, stored in `public/uploads` directory

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

### Third-Party Libraries
- **multer**: Handles multipart/form-data file uploads
- **framer-motion**: Animation library for scroll effects and transitions
- **react-hook-form** + **zod**: Form handling with validation
- **shadcn/ui** (Radix primitives): Comprehensive UI component library
- **Resend**: Email service for contact form notifications

### Environment Variables
No required environment variables for core functionality. Optional:
- Email integration secrets (managed via Replit integrations)