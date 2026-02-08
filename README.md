# Patient Notes Module

A full-stack application for managing medical notes for patients, built with Next.js, React, TypeScript, and PostgreSQL.

## Features

- **Backend API**: Create and retrieve patient notes with validation
- **React Form**: Create notes with client-side validation
- **Notes List**: Display all notes for a selected patient
- **Database**: PostgreSQL with Drizzle ORM and type-safe schemas
- **UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Error Handling**: User-friendly error messages via toast notifications

## Tech Stack

- Next.js 16, TypeScript, PostgreSQL (Neon), Drizzle ORM
- React Hook Form + Zod, SWR, Tailwind CSS v4, shadcn/ui

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
# you can grab a quick neon postgres database url for testing in: https://neon.new
DATABASE_URL=your_database_url_here
```

### 3. Set up the database

```bash
pnpm db:push      # Push schema to database
pnpm db:seed      # (Optional) Seed with sample data
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

- **Clean separation**: API routes, database layer, UI components, utilities
- **Validation**: Zod schemas on both client and server
- **Error handling**: Custom try-catch wrapper with user-friendly messages
- **Data fetching**: SWR for caching and automatic revalidation

## Potential Improvements

### High Priority

- Authentication/authorization with better-auth
- Edit and delete notes
- Unit and E2E tests
- Pagination for large note lists

### Nice to Have

- Replace patient select with combobox + server-side search for scalability
- Search and filter notes
- Rate limiting and CSRF protection
