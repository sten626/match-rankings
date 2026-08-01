import pgPromise from 'pg-promise';
import 'dotenv/config';

const config = {
  host: process.env['DB_HOST'] || 'localhost',
  port: Number(process.env['DB_PORT'] || 5432),
  user: process.env['DB_USER'] || '',
  password: process.env['DB_PASSWORD'] || '',
  database: process.env['DB_DATABASE'] || '',
};

const pgp = pgPromise();

export const db = pgp(config);

export function closeDb(): void {
  pgp.end();
}
