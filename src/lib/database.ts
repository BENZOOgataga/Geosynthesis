import { neon } from '@neondatabase/serverless';

// Get Neon connection
const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || '');

let initialized = false;

export async function getDatabase() {
  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }
  return sql;
}

async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMPTZ
      )
    `;

    // Create game_saves table
    await sql`
      CREATE TABLE IF NOT EXISTS game_saves (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        save_name TEXT NOT NULL,
        game_state JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

    console.log('✓ Neon Postgres database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw - tables might already exist
  }
}

export function closeDatabase() {
  // Neon serverless doesn't require explicit closing
  console.log('Neon connection will be closed automatically');
}
