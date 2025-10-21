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

### 3. Setup Database

#### Generate Prisma Client

```bash
npm run prisma:generate
```

#### Run Migration & Seeding (First Time Setup)

```bash
npm run db:setup
```

Atau jalankan secara terpisah:

```bash
# Run migration
npm run prisma:migrate

# Run seeding
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Available Scripts

### Development
- `npm run dev` - Jalankan development server
- `npm run build` - Build project ke folder `dist`
- `npm start` - Jalankan production build

### Database Management
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:seed` - Run database seeding
- `npm run prisma:studio` - Buka Prisma Studio (GUI database)
- `npm run db:setup` - Run migration + seeding (first time setup)
- `npm run db:reset` - Reset database + run migration + seeding

## Database Seeding

Seeder akan mengisi database dengan data dummy:

- **4 Users** - admin, johndoe, janedoe, bookworm
- **10 Genres** - Fiction, Non-Fiction, Sci-Fi, Fantasy, Mystery, dll
- **10 Books** - To Kill a Mockingbird, 1984, The Hobbit, Harry Potter, dll
- **3 Orders** - Sample transactions dengan order items

⚠️ **Catatan**: Seeder akan **menghapus semua data** yang ada sebelum mengisi data baru. Jika ingin mempertahankan data, comment out bagian `deleteMany()` di file `prisma/seed.ts`

## Project Structure

```
src/
├── index.ts                      # Entry point aplikasi
├── controllers/                  # Controller untuk handle logic
│   ├── auth.controller.ts
│   ├── genre.controller.ts
│   ├── library.controller.ts
│   └── transaction.controller.ts
├── routes/                       # Route definitions
│   ├── auth.route.ts
│   ├── genre.route.ts
│   ├── library.route.ts
│   └── transaction.route.ts
├── middleware/                   # Custom middleware
│   ├── auth.middleware.ts
│   └── error.middleware.ts
└── lib/
    └── prisma.ts                # Prisma client instance
prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Database seeder
.env                             # Environment variables
package.json
tsconfig.json
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Routes
- `/api/auth` - Authentication endpoints
- `/api/genre` - Genre management
- `/api/library` - Book/Library management
- `/api/transaction` - Transaction/Order management

## Catatan

- Pastikan Neon Database sudah setup sebelum menjalankan aplikasi
- Update `prisma/schema.prisma` untuk menambahkan model sesuai kebutuhan
- Jalankan `npm run prisma:generate` setelah mengubah schema
- Jalankan `npm run prisma:migrate` untuk apply perubahan ke database
- Gunakan `npm run prisma:studio` untuk melihat data di database dengan GUI