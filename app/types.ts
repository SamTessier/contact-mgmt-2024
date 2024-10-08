export interface ServerEntryModule {
    default: Function;
    imports: string[];
  }
  
  export interface ServerBuild {
    assets: {
      entry: ServerEntryModule;
      routes: {
        [key: string]: {
          id: string;
          parentId?: string;
          path?: string;
          index?: boolean;
          caseSensitive?: boolean;
          module: string;
          imports: string[];
          hasAction?: boolean;
          hasLoader?: boolean;
          hasCatchBoundary?: boolean;
          hasErrorBoundary?: boolean;
        };
      };
    };
    mode: string;
    entry: string;
    routes: string;
    publicPath: string;
    assetsBuildDirectory: string;
    future: any; // Adjust this to a more specific type if possible
    [key: string]: any; // Allow additional properties
  }
  

export interface Student {
  id: number;
  studentName: string;
  school: string;
  weeklySchedule: string;
  phoneOne: string;
  phoneTwo: string;
  email: string;
}

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  school: string;
  weeklySchedule: string;
  phoneOne: string;
  phoneTwo: string;
  email: string;
}