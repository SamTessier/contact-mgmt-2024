import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authorize, addUser } from "../auth";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  const auth = await authorize();
  const user = await addUser(auth, { email, password });

  if (!user) {
    return json({ error: "User already exists" }, { status: 400 });
  }

  return redirect("/login");
};

export default function Signup() {
  const actionData = useActionData();
  return (
    <div>
      <h2>Signup</h2>
      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        {actionData?.error && <p>{actionData.error}</p>}
        <button type="submit">Signup</button>
      </Form>
    </div>
  );
}
