# Secure Escort

Secure Escort is a full‑stack platform for managing security escort, personal protection, and delivery requests. It provides role‑based experiences for users, guards, and admins—covering request creation, guard assignment, status updates, tracking, analytics, and secure authentication.

## Features

- Role‑based access for Users, Guards, and Admins
- Request lifecycle management (create, assign, track, complete)
- Guard workflows for job acceptance, status updates, and checkpoints
- Admin dashboards for oversight, analytics, and audit logging
- Email verification and password reset flows
- Cloudinary‑backed avatar uploads
- Responsive, mobile‑first UI with skeleton loading states

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS + Radix UI
- Prisma ORM + MongoDB
- NextAuth (Credentials)
- Zod validation
- Leaflet (maps)
- Nodemailer (transactional emails)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB connection string

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a .env file in the project root and configure the required variables (see below).

3. Sync Prisma schema to your database

   ```bash
   npx prisma db push
   ```

4. Start the dev server

   ```bash
   npm run dev
   ```

The app runs at http://localhost:3000.

## Environment Variables

Create a .env file in the project root:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_NAME="Secure Escort"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# Admin access
ADMIN_EMAILS="admin1@example.com,admin2@example.com"
NEXT_PUBLIC_ADMIN_EMAILS="admin1@example.com,admin2@example.com"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SENDER_EMAIL="no-reply@secure-escort.com"
SENDER_NAME="Secure Escort"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI (Hugging Face)
HF_API_KEY="your-huggingface-api-key"
HF_MODEL="mistralai/Mistral-7B-Instruct-v0.2"
```

## Scripts

- npm run dev — start development server
- npm run build — build for production
- npm run start — start production server
- npm run lint — run lint checks

## Project Structure

- app — routes and layouts (App Router)
- components — shared UI + feature components
- lib — utilities, actions, validators, and helpers
- prisma — Prisma schema
- db — Prisma client setup
- email — email templates
- types — shared TypeScript types

## Deployment

1. Set all environment variables in your hosting provider.
2. Build the app: npm run build
3. Run the server: npm run start

## License

License not specified. Add a LICENSE file if you want to open‑source this project.
