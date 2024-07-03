import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/");
};

export default function Logout() {
  return <div>Logging out...</div>;
}
