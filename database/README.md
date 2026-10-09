# Database

Create a Supabase project and store its rotated database connection string in a local `.env` file as `DATABASE_URL`. Never commit `.env` or share the connection string.

Apply the migration and seed data with:

```bash
npm run db:migrate
```

The migration runner uses TLS for Supabase connections and applies files in order.

All timestamps use `TIMESTAMPTZ` and are stored in UTC. Queries must include `owner_id` and `deleted_at IS NULL` unless intentionally operating on deleted records.
