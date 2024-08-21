import { LoaderFunction, ActionFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InvoiceSubmissionForm } from "@/components/ui/payables-invoice";
import { requireUser } from "@/lib/utils";
import { generateInvoicePDF, sendInvoiceEmail } from "app/config/invoice.server";

// The loader function remains unchanged
export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    return { userIsAuthenticated: true };
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
};

// Action function to handle the form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Parse and structure the incoming form data
  const invoiceData = {
    contractorName: formData.get("contractorName") as string,
    schoolName: formData.get("schoolName") as string,
    invoiceDate: formData.get("invoiceDate") as string,
    days: JSON.parse(formData.get("days") as string), // Assuming `days` is a JSON string in the form data
  };

  // Validate that `days` is an array of objects with `hoursWorked` and `rateOfPay` as numbers
  if (!Array.isArray(invoiceData.days)) {
    throw new Error("Invalid format for days");
  }

  invoiceData.days.forEach((day, index) => {
    if (typeof day.hoursWorked !== "number" || typeof day.rateOfPay !== "number") {
      throw new Error(`Invalid data type for day ${index + 1}`);
    }
  });

  try {
    // Generate the PDF invoice
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    // Send the invoice via email
    await sendInvoiceEmail(invoiceData, pdfBuffer);

    return json({ success: true });
  } catch (error) {
    console.error("Failed to process invoice:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export default function InvoiceSubmissionPage() {
  const { userIsAuthenticated } = useLoaderData<{ userIsAuthenticated: boolean }>();

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
