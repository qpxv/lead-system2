# Lead System — Outreach Pipeline

Personal outbound prospecting tool. Zero friction, flow-state UX.

---

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Run the migration

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lead_system" npx prisma migrate deploy
```

### 3. Generate Prisma client

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lead_system" npx prisma generate
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Daily Pipeline

| Day | Action |
|-----|--------|
| 1 | Add lead, Engage |
| 2 | Engage + Follow |
| 3 | Engage + Send DM |
| 4 | Waiting (no action) |
| 5 | Follow-up (non-replied only) |
| 6 | Auto: delete non-replied, promote replied → Conversations |

---

## Cron (Daily Automation)

Set up a crontab entry to run daily at midnight:

```cron
0 0 * * * curl -s "http://localhost:3000/api/cron"
```

Or click **⚡ Run Daily** in the nav bar to trigger manually.

---

## Environment

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lead_system?schema=public
CRON_SECRET=       # Optional — protects /api/cron endpoint
```
