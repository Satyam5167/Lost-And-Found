// server/db.js
import pg from 'pg';
const Pool = pg.Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  family: 'ipv4', 
  ssl: { 
    rejectUnauthorized: false
  },
});

export default pool;