
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import connection from "../config/db";

export const loader: LoaderFunction = async () => {
  try {
    const results = await connection.query("SELECT 1 + 1 AS solution");
    return json({ status: "ok", solution: results[0].solution });
  } catch (err) {
    return json({ error: "Database connection failed", details: err });
  }
};

export default function TestDb() {
  return (
    <div>
      <h1>Database Test</h1>
      <p>Check the console for the database connection test result.</p>
    </div>
  );
}
