import queryAsync from 'app/config/db';
import bcrypt from 'bcrypt';

const tablesCreationQueries = [
  `CREATE TABLE IF NOT EXISTS roles (
    role_name VARCHAR(10) PRIMARY KEY
  );`,
  `INSERT IGNORE INTO roles (role_name) VALUES ('admin'), ('manager'), ('staff');`,
  `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    role_name VARCHAR(10),
    FOREIGN KEY (role_name) REFERENCES roles(role_name)
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
  for (const query of tablesCreationQueries) {
    try {
      await queryAsync(query);
      console.log("Database table created");
    } catch (err) {
      console.error("Error creating table:", err);
      throw err;
    }
  }
};

