// server/db.js
import dns from 'dns';
import pg from 'pg';
const Pool = pg.Pool;
// Force Node to prefer IPv4 instead of IPv6
dns.setDefaultResultOrder("ipv4first");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  family: 4, 
  ssl: { 
    rejectUnauthorized: false
  },
});

export default pool;