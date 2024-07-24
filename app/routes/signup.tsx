import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { addUser, authenticateUser } from "../auth";
import { getSession, commitSession } from "app/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    await addUser({ email, password });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }

  const user = await authenticateUser({ email, password });
  if (!user) {
    return json({ error: "Authentication failed" }, { status: 400 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  return redirect("/students", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

type ActionData = {
  error?: string;
};

export default function Signup() {
  const actionData = useActionData<ActionData>();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <Form method="post">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" required className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" required className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
          </div>
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Signup</button>
        </Form>
      </div>
    </div>
  );
}
