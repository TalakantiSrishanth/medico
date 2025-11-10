import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();

let pool;

if (!global._pool) {
  global._pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "certs", "ca.pem")),
      rejectUnauthorized: true,
    },
  });
}

pool = global._pool;

export default pool;
