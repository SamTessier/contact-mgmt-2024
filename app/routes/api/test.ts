import { json } from "@remix-run/node";

export const loader = () => {
  return json({ message: "Test route is working" });
};

export default function TestRoute() {
  return <div>Test Route</div>;
}
