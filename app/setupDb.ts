import pool from './config/db';

const tablesCreationQueries = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    password_hash VARCHAR(100)
  );`,
  `CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    school VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    availability TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(100),
    studentName VARCHAR(100),
    weeklySchedule TEXT,
    notes TEXT,
    email VARCHAR(100),
    phoneOne VARCHAR(50),
    parentOne VARCHAR(100),
    parentTwo VARCHAR(100),
    phoneTwo VARCHAR(50)
  );`
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

setupDb().catch((err) => console.error("Error setting up database:", err));
