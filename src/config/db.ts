import { createPool } from 'mysql2/promise';

const db = {
  host: 'localhost',
  port: 3306,
  username: 'root', 
  password: '123456',
  database: 'sys',
};

export const pool = createPool({
  host: db.host,
  port: db.port,
  user: db.username,
  password: db.password,
  database: db.database,
});