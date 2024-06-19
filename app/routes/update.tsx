// import { useFetcher, useLoaderData } from "@remix-run/react";
// import { json } from "@remix-run/node";
// import type { ActionFunction, LoaderFunction } from "@remix-run/node";
// import { ProfileViewModal } from "@/components/profile-view-modal";
// // import { authorize, getData, updateData } from "./sheets.server";

// export const loader: LoaderFunction = async ({ params }) => {
//   const auth = await authorize();
//   const profile = await getData(auth, process.env.GOOGLE_SHEETS_ID);
//   return json(profile);
// };

// export const action: ActionFunction = async ({ request }) => {
//   const { data } = await request.json();
//   const auth = await authorize();
//   const updatedProfile = await updateData(auth, data); // Update based on actual function
//   return json(updatedProfile);
// };

// export default function UpdateProfilePage() {
//   const fetcher = useFetcher();
//   const profile = useLoaderData();

//   return (
//     <ProfileViewModal
//       isOpen={true}
//       profile={profile}
//       onClose={() => window.history.back()}
//       onUpdate={() => fetcher.submit({}, { method: "get" })}
//     />
//   );
// }
