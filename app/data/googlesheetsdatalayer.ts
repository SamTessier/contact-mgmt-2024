
import { DataLayer } from './datalayer';
import { authorize, getData as gsGetData, addData as gsAddData, updateData as gsUpdateData, deleteData as gsDeleteData } from '../googlesheetsserver';

class GoogleSheetsDataLayer implements DataLayer {
  private authClient: any;

  constructor(private spreadsheetId: string, private credentialsPath: string) {
    this.authClient = null;
  }

  private async authenticate() {
    if (!this.authClient) {
      this.authClient = await authorize(this.credentialsPath);
    }
    return this.authClient;
  }

  async getData(sheetName: string) {
    const auth = await this.authenticate();
    return gsGetData(auth, this.spreadsheetId, sheetName);
  }

  async addData(data: any, sheetName: string) {
    const auth = await this.authenticate();
    await gsAddData(auth, this.spreadsheetId, data, sheetName);
  }

  async updateData(data: any, email: string, sheetName: string) {
    const auth = await this.authenticate();
    await gsUpdateData(auth, this.spreadsheetId, data, sheetName, email);
  }

  async deleteData(email: string, sheetName: string) {
    const auth = await this.authenticate();
    await gsDeleteData(auth, this.spreadsheetId, email, sheetName);
  }
}

export default GoogleSheetsDataLayer;
