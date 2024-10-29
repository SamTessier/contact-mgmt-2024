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
  console.log("🔍 Authenticating user:", email);
  
  try {
    console.log("📊 Querying database...");
    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("📊 Query results length:", results.length);

    if (results.length > 0) {
      console.log("👤 User found, checking password...");
      const passwordMatch = await bcrypt.compare(password, results[0].password_hash);
      console.log("🔐 Password match:", passwordMatch);
      
      if (passwordMatch) {
        console.log("✅ Authentication successful");
        return results[0];
      }
    }
    
    console.log("❌ Authentication failed");
    return null;
  } catch (error) {
    console.error("💥 Authentication error:", error);
    throw error;
  }
}
