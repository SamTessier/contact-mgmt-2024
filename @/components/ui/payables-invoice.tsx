"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const daySchema = z.object({
  hoursWorked: z.number().min(0, "Hours worked must be a positive number."),
  rateOfPay: z.number().min(0, "Rate of pay must be a positive number."),
});

const invoiceSchema = z.object({
  contractorName: z.string().min(2, "Name must be at least 2 characters."),
  schoolName: z.string().min(2, "School name is required."),
  invoiceDate: z.string().min(10, "Date is required."),
  days: z.array(daySchema).length(14),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceSubmissionForm() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      contractorName: "",
      schoolName: "",
      invoiceDate: "",
      days: Array(14).fill({ hoursWorked: 0, rateOfPay: 0 }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "days",
  });

  function onSubmit(values: InvoiceFormValues) {
    console.log(values);
    // TODO: Handle PDF conversion and email submission here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input placeholder="Example School" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <h3 className="text-lg font-bold">Day {index + 1}</h3>
            <FormField
              control={form.control}
              name={`days.${index}.hoursWorked`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours Worked</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                  <FormLabel>Rate of Pay</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
