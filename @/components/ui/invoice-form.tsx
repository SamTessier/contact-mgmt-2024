import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

const invoiceSchema = z.object({
  contractorName: z.string().min(1, "Contractor name is required"),
  schoolName: z.string().min(1, "School name is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  days: z.array(z.object({
    hoursWorked: z.number().min(0).max(24),
    rateOfPay: z.number().min(0),
  })).min(1, "At least one day must be added"),
  suppliesAmount: z.number().min(0).default(0),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      contractorName: "",
      schoolName: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      days: Array(5).fill({ hoursWorked: 0, rateOfPay: 0 }),
      suppliesAmount: 0,
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      const response = await fetch("/getpaid", {
        method: "POST",
        body: new FormData(form.formState.submitCount),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit invoice");
      }

      form.reset();
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contractorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contractor Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="ABC School" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="invoiceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Work Days</h3>
          {form.watch('days').map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name={`days.${index}.hoursWorked`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Worked (Day {index + 1})</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.5"
                        min="0"
                        max="24"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`days.${index}.rateOfPay`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate of Pay ($/hr)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="suppliesAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplies Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Generate Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
} 