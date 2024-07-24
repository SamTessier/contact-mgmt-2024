import { DataLayer } from "./datalayer";
import connection from "../config/db";

class SQLDataLayer implements DataLayer {
  private async getConnection() {
    if (typeof window !== "undefined") {
      throw new Error("This method should only be called on the server");
    }
    return connection;
  }

  async getData() {
    const connection = await this.getConnection();
    const [students] = await connection.query(`SELECT * FROM students`);
    const [staff] = await connection.query(`SELECT * FROM staff`);
    return { students, staff };
  }

  async addData(data: any, sheetName: string) {
    const connection = await this.getConnection();
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const query = `INSERT INTO ${sheetName} (${columns}) VALUES (${placeholders})`;
    await connection.query(query, values);
  }

  async updateData(data: any, email: string, sheetName: string) {
    const connection = await this.getConnection();
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), email];
    const query = `UPDATE ${sheetName} SET ${setClause} WHERE email = ?`;
    await connection.query(query, values);
  }

  async deleteData(email: string, sheetName: string) {
    const connection = await this.getConnection();
    const query = `DELETE FROM ${sheetName} WHERE email = ?`;
    await connection.query(query, [email]);
  }
}

export default SQLDataLayer;
