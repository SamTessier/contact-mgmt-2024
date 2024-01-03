// app/routes/_index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorize, getData } from "./sheets.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the data structure
interface Data {
  staff: string[][];
  students: string[][];
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (): Promise<Data> => {
  const client = await authorize();
  const data = await getData(client);
  return data;
};

export default function Index() {
  const { staff, students } = useLoaderData<Data>();

  // Combine staff and students data
  const combinedData = [...staff, ...students];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-4xl font-bold text-center p-4 uppercase">
        School App
      </h1>
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Fav color</TableHead>
              {/* Add more TableHeads if needed */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
