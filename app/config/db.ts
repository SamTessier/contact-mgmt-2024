import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("Attempting database connection with:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const tablesCreationQueries = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(100) DEFAULT ''
  );`,
  `CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) DEFAULT '',
    lastName VARCHAR(100) DEFAULT '',
    school VARCHAR(100) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    availability VARCHAR(100) DEFAULT ''
  );`,
  `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(100) DEFAULT '',
    studentName VARCHAR(100) DEFAULT '',
    weeklySchedule VARCHAR(100) DEFAULT '',
    notes VARCHAR(100) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    phoneOne VARCHAR(50) DEFAULT '',
    parentOne VARCHAR(100) DEFAULT '',
    parentTwo VARCHAR(100) DEFAULT '',
    phoneTwo VARCHAR(50) DEFAULT ''
  );`,
];

export const setupDb = async () => {
  const connection = await pool.getConnection();

  try {
    for (const query of tablesCreationQueries) {
      try {
        await connection.query(query);
        console.log("Database table created");
      } catch (err) {
        console.error("Error creating table:", err);
        throw err;
      }
    }
  } finally {
    connection.release();
  }
};

// Test connection immediately
pool.getConnection()
  .then(connection => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err);
    throw err; // This will help catch connection issues early
  });

export default pool;
