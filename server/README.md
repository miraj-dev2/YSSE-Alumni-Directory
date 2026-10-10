# YSSE Alumni Directory - Backend API

Robust, secure backend API for the **Youth School for Social Entrepreneurs (YSSE)** Alumni Directory platform.

## Tech Stack
- **Runtime & Framework**: Node.js, Express, TypeScript (strict)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Auth & Security**: Google OAuth (google-auth-library), JWT, Helmet, CORS, Cookie Parser, Express Rate Limit
- **Data & Processing**: Zod validation, Sharp, Multer, CSV Parse, Pino logging
- **Testing**: Vitest, Supertest

## Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```
Key environment variables:
- `PORT`: HTTP server port (default 5000)
- `DATABASE_URL`: PostgreSQL connection URL
- `GOOGLE_CLIENT_ID`: Google OAuth 2.0 Web Client ID
- `JWT_SECRET`: Secret key (min 32 characters)
- `CLIENT_ORIGIN`: Allowed frontend origin (e.g. `http://localhost:5173`)
- `ADMIN_EMAILS`: Comma-separated list of admin email addresses
- `UPLOAD_DIR`: Local photo upload folder

## Scripts
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run development server
npm run dev

# Seed demo data (refuses in production)
npm run prisma:seed

# Run test suite
npm test

# Build for production
npm run build
```

## Key Architecture & Business Rules
- **Layering Rule**: Routes only map paths; Controllers parse requests; Services hold business rules.
- **Computed `openToSessions`**: Never stored in DB; dynamically derived from active session offers.
- **Privacy Sanitization**: Redacts email and LinkedIn for unauthenticated viewers in `lib/publicProfile.ts`.
- **CSV Security**: Strict per-row validation and formula injection defenses (`='`, `+'`, `-'`, `@'`).
