import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { InvoiceForm } from "~/components/ui/invoice-form";
import { requireUser } from "@/lib/utils";
import { generateInvoicePDF, sendInvoiceEmail } from "~/config/invoice.server";
import { toast } from "sonner";
import { useEffect } from "react";

export const loader: LoaderFunction = async (args) => {
  try {
    await requireUser(args);
    return json({ userIsAuthenticated: true });
  } catch (error) {
    console.error("Failed to load data:", error);
    return redirect("/login");
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    await requireUser({ request });
    const formData = await request.formData();
    
    // Process form data
    const data = {
      contractorName: formData.get("contractorName"),
      schoolName: formData.get("schoolName"),
      invoiceDate: formData.get("invoiceDate"),
      days: Array.from({ length: 5 }, (_, i) => ({
        hoursWorked: Number(formData.get(`days[${i}].hoursWorked`)) || 0,
        rateOfPay: Number(formData.get(`days[${i}].rateOfPay`)) || 0,
      })).filter(day => day.hoursWorked > 0 && day.rateOfPay > 0),
      suppliesAmount: Number(formData.get("suppliesAmount")) || 0,
    };

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(data);
    
    // Send email
    await sendInvoiceEmail(data, pdfBuffer);

    return json({ success: true, message: "Invoice submitted successfully" });
  } catch (error) {
    console.error("Failed to process invoice:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export default function InvoiceSubmissionPage() {
  const { userIsAuthenticated } = useLoaderData<{ userIsAuthenticated: boolean }>();
  const actionData = useActionData();

  // Show success/error messages
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Invoice submitted successfully!");
    } else if (actionData?.error) {
      toast.error(`Error: ${actionData.error}`);
    }
  }, [actionData]);

  if (!userIsAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Invoice</h1>
        <InvoiceForm />
      </div>
    </div>
  );
}
