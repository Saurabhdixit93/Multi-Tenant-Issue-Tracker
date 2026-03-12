# RUDRATEK V1 | Multi-Tenant Issue Tracker

A Senior-level Mini SaaS architecture evaluating systemic vision, isolated data layers, and AI integration.

## 🏗️ System Architecture

### 1. Data Layer Isolation (Strict Tenancy)

We employ **Column-based Isolation** using Prisma and PostgreSQL.

- Every `User` and `Issue` is linked to a `TenantId`.
- **Logic Enforcement**: The backend uses mandatory `tenantContext` middleware that extracts `tenantId` from JWT and forces all database queries to include the `tenantId` filter. This prevents Cross-Tenant Data Leakage (IDOR).

### 2. Authentication Flow

- **Framework**: NextAuth.js (Frontend) + JWT (Backend).
- **Process**:
  1. Frontend authenticates with the Backend.
  2. Backend returns a JWT containing `userId`, `tenantId`, and `role`.
  3. Frontend stores this in a secure session and attaches it to every API call.

### 3. AI Categorization (Gemini Integration)

- Every issue log is processed by the **Google Gemini SDK** in the backend.
- The LLM analyzes the `title` and `description` to automatically assign a category (Bug, Feature, Security, etc.), reducing manual triaging.

### 4. Radical UI/UX

- Built with **Next.js 15, Tailwind CSS, and Framer Motion**.
- **Design Philosophy**: Geometric Brutalism. We avoid overused components (shadcn/Radix defaults) in favor of custom-built, micro-animated interfaces that feel premium and unique.

## 🚀 Deployment Strategy

- **Frontend**: Vercel (Optimized for Next.js 15 Edge Runtime).
- **Backend**: Render/Railway (Dedicated Node.js environment).
- **Database**: Neon (Serverless Postgres with branching support for safe migrations).

## 🛠️ Tech Stack

- **Languages**: TypeScript (Strict Mode)
- **Backend**: Node.js, Express, Prisma, Google Gemini AI
- **Frontend**: Next.js 15, Framer Motion, Axios, NextAuth
- **Security**: Helmet, JWT, bcrypt, Tenant-aware Middleware

## 🚀 Getting Started

### Single Command Startup (Professional)

Run both services with automated port cleanup:

```bash
./start.sh
```

### Manual Setup

#### 1. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Ensure you have `.env` files in both `backend/` and `frontend/` with the following:

- `DATABASE_URL` (Backend)
- `JWT_SECRET` (Backend)
- `GEMINI_API_KEY` (Backend)
- `NEXTAUTH_SECRET` (Frontend)
- `NEXTAUTH_URL` (Frontend)
- `NEXT_PUBLIC_BACKEND_URL` (Frontend)
