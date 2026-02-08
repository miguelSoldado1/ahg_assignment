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
- Vitest for unit testing

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

### 5. Run tests

```bash
pnpm test:run     # Run tests once
pnpm test         # Run tests in watch mode
```

## Testing

The project includes **29 unit tests** covering:

- **API Routes** (8 tests): POST /notes and GET /notes/:patientId endpoints with validation
- **Validation Schemas** (10 tests): Zod schema validation for notes and patient IDs
- **Formatters** (11 tests): Date and timestamp formatting utilities

All tests use Vitest with mocked database calls to ensure isolated, fast test execution.

## Docker

Build and run with Docker:

```bash
# Build the image
docker build -t patient-notes .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL=your_database_url patient-notes
```

The Dockerfile uses Next.js standalone output for optimized production builds.

## Architecture

- **Clean separation**: API routes, database layer, UI components, utilities
- **Validation**: Zod schemas on both client and server
- **Error handling**: Custom try-catch wrapper with user-friendly messages
- **Data fetching**: SWR for caching and automatic revalidation

## Potential Improvements

### High Priority

- Authentication/authorization with better-auth
- Edit notes and confirm delete dialog
- E2E tests with Playwright
- Pagination for large note lists

### Nice to Have

- Replace patient select with combobox + server-side search for scalability
- Search and filter notes by content/date
- Rate limiting and CSRF protection
- Real-time collaboration features
