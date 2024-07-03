import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {  addUser, authenticateUser } from "app/auth";
import { createSession, authorize } from "../googlesheetsserver";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  const auth = await authorize();
  try {
    await addUser(auth, { email, password });
  } catch (error) {
    return json({ error: "User already exists" }, { status: 400 });
  }

  const user = await authenticateUser(auth, { email, password });
  const sessionId = await createSession(auth, user.email, { email: user.email });
  const headers = new Headers();
  headers.append("Set-Cookie", `session=${sessionId}; HttpOnly; Path=/`);

  return redirect("/students", { headers });
};

type ActionData = {
  error?: string;
};

export default function Signup() {
  const actionData = useActionData<ActionData>();
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
