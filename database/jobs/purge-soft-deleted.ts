import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required.');
}

const database = new URL(databaseUrl);
const client = new Client({
  connectionString: databaseUrl,
  ssl: database.hostname.endsWith('.supabase.co') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const result = await client.query(`
    WITH deleted AS (
      DELETE FROM attachments WHERE deleted_at < now() - interval '30 days' RETURNING id
    ) SELECT count(*)::int AS count FROM deleted
  `);
  console.log(
    `Purged ${result.rows[0].count} attachment(s). Other entity tables should use the same policy.`,
  );
} finally {
  await client.end();
}
