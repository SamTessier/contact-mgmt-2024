import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InvoiceSubmissionForm } from "@/components/ui/payables-invoice";
import { requireUser } from "@/lib/utils";

export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    return { userIsAuthenticated: true };
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
};

export default function InvoiceSubmissionPage() {
  const { userIsAuthenticated } = useLoaderData() as { userIsAuthenticated: boolean };

  if (!userIsAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Submit Your Invoice</h1>
      <InvoiceSubmissionForm />
    </div>
  );
}
