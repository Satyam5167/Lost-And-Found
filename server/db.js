// server/db.js
import pg from 'pg';
const Pool = pg.Pool;

// This one line is all you need.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;