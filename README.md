# PWeb Express Project - P27 2025

Project template untuk Express API dengan TypeScript, PostgreSQL (Neon), dan Prisma ORM.

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database (Neon Cloud)
- **Prisma ORM** - Database ORM

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Edit file `.env` dan ganti `DATABASE_URL` dengan connection string dari Neon Database:

```
DATABASE_URL="postgresql://user:password@host/dbname"
NODE_ENV="development"
PORT=3000
```

Dapatkan connection string dari [Neon Dashboard](https://neon.tech/)

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Available Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build project ke folder `dist`
- `npm start` - Jalankan production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:studio` - Buka Prisma Studio

## Project Structure

```
src/
  ├── index.ts          # Entry point aplikasi
prisma/
  └── schema.prisma     # Prisma schema
.env                    # Environment variables
package.json
tsconfig.json
```

## Catatan

- Pastikan Neon Database sudah setup sebelum menjalankan aplikasi
- Update `prisma/schema.prisma` untuk menambahkan model sesuai kebutuhan
- Jalankan `npm run prisma:migrate` setelah mengubah schema