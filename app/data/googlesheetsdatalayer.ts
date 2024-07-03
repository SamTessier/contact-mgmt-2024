import { DataLayer } from "./datalayer";

class GoogleSheetsDataLayer extends DataLayer {
  private authClient: any;

  constructor(
    private spreadsheetId: string,
    private sheetName: string,
    private credentialsPath: string
  ) {
    super();
    this.authClient = null;
  }

  private async authenticate() {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }

    if (!this.authClient) {
      const { authorize } = await import('../googlesheetsserver');
      this.authClient = await authorize(this.credentialsPath);
    }
    return this.authClient;
  }

  async getData() {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }

    const auth = await this.authenticate();
    const { getData } = await import('../googlesheetsserver');
    return getData(auth, this.spreadsheetId, this.sheetName);
  }

  async addData(data: { [key: string]: any }) {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }

    const auth = await this.authenticate();
    const { addData } = await import('../googlesheetsserver');
    await addData(auth, this.spreadsheetId, data, this.sheetName);
  }

  async updateData(data: { [key: string]: any }, email: string) {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }

    const auth = await this.authenticate();
    const { updateData } = await import('../googlesheetsserver');
    await updateData(auth, this.spreadsheetId, data, this.sheetName, email);
  }

  async deleteData(email: string) {
    if (typeof window !== 'undefined') {
      throw new Error('This method should only be called on the server');
    }

    const auth = await this.authenticate();
    const { deleteData } = await import('../googlesheetsserver');
    await deleteData(auth, this.spreadsheetId, email, this.sheetName);
  }
}

export default GoogleSheetsDataLayer;
