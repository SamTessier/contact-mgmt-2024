import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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

type InvoiceFormValues = {
  contractorName: string;
  schoolName: string;
  invoiceDate: string;
  days: Array<{ hoursWorked: number; rateOfPay: number }>;
};

export function InvoiceSubmissionForm() {
  const form = useForm<InvoiceFormValues>({
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
              <FormMessage>
                {form.formState.errors.contractorName?.message}
              </FormMessage>
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
              <FormMessage>{form.formState.errors.schoolName?.message}</FormMessage>
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
              <FormMessage>{form.formState.errors.invoiceDate?.message}</FormMessage>
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
                    <Input placeholder="0" type="number" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.days?.[index]?.hoursWorked?.message}
                  </FormMessage>
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
                    <Input placeholder="0" type="number" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.days?.[index]?.rateOfPay?.message}
                  </FormMessage>
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
