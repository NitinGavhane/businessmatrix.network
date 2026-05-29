# BusinessMatrix.network

Global B2B Directory Listing Platform — Connect & Grow Together.

## Overview

BusinessMatrix is a full-featured B2B business directory where manufacturers, suppliers, wholesalers, exporters, and service providers can list their businesses, post Give & Ask requirements, get AI-powered matchmaking, and connect with trading partners.

### Domains

| Domain | Purpose |
|--------|---------|
| `businessmatrix.network` | Static landing page |
| `app.businessmatrix.network` | Full app — auth, directory, dashboard |

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js (App Router) | 16.2.2 |
| React | 19.2.4 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| Prisma | ^7.6.0 |
| PostgreSQL (Neon) | — |
| NextAuth.js | ^4.24.14 |
| bcryptjs | ^2.4.3 |
| Fuse.js (search) | ^7.1.0 |
| Lucide React (icons) | ^1.7.0 |

## Features

- **🔐 Authentication** — Email/password + Google OAuth via NextAuth.js
- **📋 Directory Listing** — Public business directory with search & filter
- **📝 List Your Business** — 5-step form to create a detailed business profile
- **📊 User Dashboard** — Overview with live-editable Buy/Sell lists, stats, matches
- **🤝 Smart Matchmaking** — AI algorithm scoring matches based on Give & Ask alignment
- **💬 Direct Messaging** — Premium feature for connecting with matched partners
- **🎯 Give & Ask** — Post requirements for what you offer and what you need
- **👑 Admin Panel** — Full platform overview and management

## Getting Started

### Prerequisites

- Node.js >= 20.9
- PostgreSQL database (Neon recommended)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/businessmatrix-network.git
cd businessmatrix-network
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Visit `http://localhost:3000` — landing page. Navigate to `/directory` for the directory, `/directory/auth/login` for auth.

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@businessmatrix.network | admin123 |
| User | test@test.com | test123 |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Static landing page
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Tailwind + custom styles
│   ├── api/
│   │   ├── auth/                         # Auth routes (NextAuth + register)
│   │   ├── directory/
│   │   │   ├── list/                     # Create business listing
│   │   │   ├── listings/                 # Public directory API
│   │   │   ├── onboarding/               # Post-signup wizard
│   │   │   ├── requirements/             # Give & Ask CRUD
│   │   │   ├── dashboard/                # User dashboard stats & profile
│   │   │   └── admin/                    # Admin stats & profile
│   │   ├── matchmaking/                  # AI matchmaking engine
│   │   └── search/                       # Fuse.js search
│   └── directory/
│       ├── page.tsx                      # Public directory
│       ├── auth/login/                   # Login page
│       ├── auth/signup/                  # Signup page
│       ├── dashboard/                    # Protected dashboard
│       ├── admin/                        # Admin panel
│       ├── onboarding/                   # Setup wizard
│       └── list/                         # Listing form
├── lib/
│   ├── auth.ts                           # NextAuth configuration
│   └── db.ts                             # Prisma client
├── components/
│   └── auth/SignOutButton.tsx
└── middleware.ts                         # Route protection
prisma/
├── schema.prisma                         # Database schema
└── seed.ts                               # Seed data
```

## Deployment

### Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set build command: `npm run vercel-build`
4. Add environment variables
5. Add domains in Vercel settings

### Build Command

```
npm run vercel-build
```

This runs `prisma generate`, `prisma migrate deploy`, and `next build`.

## Dashboard Overview

The user dashboard features a live-editable **What I Buy / What I Sell** panel with an **Edit Live** toggle, allowing users to update their buy/sell lists in real time. **Top Matches** are displayed in a dedicated section, sorted by match score from the matchmaking engine.

## License

Private — All rights reserved.
