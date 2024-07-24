import bcrypt from "bcrypt";
import connection from "./config/db";

export async function addUser({ email, password }: { email: string, password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err: any) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return reject(new Error("User already exists"));
          }
          return reject(err);
        }
        resolve(true);
      }
    );
  });
}

export async function authenticateUser({ email, password }: { email: string, password: string }) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return reject(err);
        if (results.length > 0 && await bcrypt.compare(password, results[0].password_hash)) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
}
