import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authorize, authenticateUser } from "../auth";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  const auth = await authorize();
  const user = await authenticateUser(auth, { email, password });

  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }

  return redirect("/");
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
