# Allo Reservation System

Inventory reservation platform built using Next.js, Prisma, PostgreSQL and TypeScript.

## Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- TailwindCSS

## Features

- Product inventory across warehouses
- Temporary reservation system
- Concurrency-safe reservation handling
- Reservation confirmation flow
- Reservation cancellation flow
- Automatic reservation expiry
- Live countdown timer
- Inventory updates without refresh

## Reservation Flow

1. User reserves stock
2. Inventory reserved temporarily
3. Reservation valid for 10 minutes
4. Payment success → reservation confirmed
5. Payment failed/cancelled → stock released
6. Expired reservation → automatically released

## Concurrency Strategy

Reservation endpoint uses:

- PostgreSQL transaction
- Serializable isolation
- Row-level locking (`FOR UPDATE`)

This guarantees:

Example:

Inventory = 1

Two simultaneous reserve requests:

Request A → succeeds

Request B → receives 409

Overselling prevented.

## Expiry Mechanism

Expired reservations are cleaned through:

```

GET /api/cron/expire

```

Cron execution:

- Find expired reservations
- Release reserved inventory
- Mark reservation EXPIRED

Production deployment can schedule this endpoint through Vercel Cron.

## Local Setup

Install:

```bash
npm install
```

Environment variables:

```

DATABASE_URL=

```

Run migrations:

```bash
npx prisma migrate deploy
```

Seed:

```bash
npx prisma db seed
```

Run app:

```bash
npm run dev
```

## Tradeoffs

- Redis locking skipped to reduce complexity
- PostgreSQL row locking provides sufficient concurrency guarantees
- Cron cleanup chosen for simplicity and reliability

## Future Improvements

- Redis distributed locking
- Idempotency keys
- Reservation retry handling
- Better UI feedback