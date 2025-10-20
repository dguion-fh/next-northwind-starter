import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../drizzle/schema';
import * as relations from '../drizzle/relations';

// Create SQLite database connection
const sqlite = new Database('northwind.db');

// Create Drizzle instance with the connection and relations
export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });
