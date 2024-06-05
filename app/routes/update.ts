// import { json } from "@remix-run/node";
// import type { ActionFunction } from "@remix-run/node";
// import { authorize, updateData as updateSheetData } from "./sheets.server"; 

// export const action: ActionFunction = async ({ request }) => {
//   try {
//     const { data, isStudent } = await request.json();
//     const parsedData = JSON.parse(data);
//     const client = await authorize();
//     const range = isStudent === 'true' ? `Students!A2:I101` : `Staff!A2:F101`; 

//     await updateSheetData(client, parsedData, range); 
//     return json({ message: "Data updated" });
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return json({ error: "Failed to update data" }, { status: 500 });
//   }
// };
