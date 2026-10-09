import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and set it locally.');
}

const database = new URL(databaseUrl);
const client = new Client({
  connectionString: databaseUrl,
  ssl: database.hostname.endsWith('.supabase.co') ? { rejectUnauthorized: false } : undefined,
});
const databaseDirectory = fileURLToPath(new URL('../', import.meta.url));

async function main() {
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

    const migrationFiles = (await readdir(join(databaseDirectory, 'migrations')))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [
        file,
      ]);
      if (applied.rowCount === 0) {
        await client.query(await readFile(join(databaseDirectory, 'migrations', file), 'utf8'));
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      }
    }

    await client.query(await readFile(join(databaseDirectory, 'seed.sql'), 'utf8'));
    await client.query('COMMIT');
    console.log(`Applied ${migrationFiles.length} migration(s) and seed data.`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
