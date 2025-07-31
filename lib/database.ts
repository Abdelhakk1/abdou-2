import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
  queryOne: async (text: string, params: any[]) => {
    const result = await pool.query(text, params);
    return result.rows[0];
  },
};
