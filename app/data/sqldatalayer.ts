import { DataLayer } from './datalayer';

class SQLDataLayer extends DataLayer {
  private async getConnection() {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }
    const { default: connection } = await import('../config/db');
    return connection;
  }

  async getData() {
    const connection = await this.getConnection();
    const result = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM your_table', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    return result;
  }

  async addData(data: { value1: any, value2: any }) {
    const connection = await this.getConnection();
    const result = await new Promise((resolve, reject) => {
      connection.query('INSERT INTO your_table (column1, column2) VALUES (?, ?)', [data.value1, data.value2], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    return result;
  }

  async updateData(data: { value1: any, value2: any }, id: number) {
    const connection = await this.getConnection();
    const result = await new Promise((resolve, reject) => {
      connection.query('UPDATE your_table SET column1 = ?, column2 = ? WHERE id = ?', [data.value1, data.value2, id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    return result;
  }

  async deleteData(id: number) {
    const connection = await this.getConnection();
    const result = await new Promise((resolve, reject) => {
      connection.query('DELETE FROM your_table WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    return result;
  }
}

export default SQLDataLayer;
