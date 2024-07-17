export interface DataLayer {
  getData(sheetName: string): Promise<any>;
  addData(data: any, sheetName: string): Promise<void>;
  updateData(data: any, email: string, sheetName: string): Promise<void>;
  deleteData(email: string, sheetName: string): Promise<void>;
}
