import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const Pool = pg.Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME
});

export default pool;