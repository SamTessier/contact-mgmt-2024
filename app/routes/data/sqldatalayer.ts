import { DataLayer } from './datalayer';
import connection from '../../config/db';

class SQLDataLayer extends DataLayer {
  async getData() {
    const result = await connection.query('SELECT * FROM your_table');
    return result;
  }

  async addData(data: { value1: any, value2: any }) {
    const result = await connection.query('INSERT INTO your_table (column1, column2) VALUES (?, ?)', [data.value1, data.value2]);
    return result;
  }

  async updateData(data: { value1: any, value2: any }, id: number) {
    const result = await connection.query('UPDATE your_table SET column1 = ?, column2 = ? WHERE id = ?', [data.value1, data.value2, id]);
    return result;
  }

  async deleteData(id: number) {
    const result = await connection.query('DELETE FROM your_table WHERE id = ?', [id]);
    return result;
  }
}

export default SQLDataLayer;