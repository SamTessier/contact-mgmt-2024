import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession, destroySession } from "app/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Logout() {
  return <div>Logging out...</div>;
}
