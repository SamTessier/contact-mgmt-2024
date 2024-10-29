import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { authenticateUser } from "../auth";
import { getSession, commitSession } from "app/session.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("📝 Login action started");
  
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  console.log("📧 Login attempt for email:", email);

  if (!email || !password) {
    console.log("❌ Missing email or password");
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    console.log("🔐 Attempting authentication...");
    const user = await authenticateUser({ email, password });
    console.log("🔑 Authentication result:", user ? "Success" : "Failed");

    if (!user) {
      console.log("❌ Invalid credentials");
      return json({ error: "Invalid credentials" }, { status: 400 });
    }

    console.log("📦 Creating session...");
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);

    console.log("✅ Session created for user:", user.id);
    console.log("🔄 Redirecting to /students");

    return redirect("/students", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    return json({ 
      error: "An error occurred during login",
      details: error.message 
    }, { status: 500 });
  }
};

type ActionData = {
  error?: string;
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Form method="post">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {actionData?.error && (
            <p className="text-red-500">{actionData.error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </Form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sm text-blue-600 underline">
            or create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
