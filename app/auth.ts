import bcrypt from "bcrypt";
import connection from "./config/db";
import { redirect } from "@remix-run/node";

export async function addUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await connection.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hashedPassword]
    );
    return true;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return false;
    }
    throw err;
  }
}

export async function authenticateUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [results] = await connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (
    results.length > 0 &&
    (await bcrypt.compare(password, results[0].password_hash))
  ) {
    return results[0];
  } else {
    throw new Error("Authentication failed");
  }
}
