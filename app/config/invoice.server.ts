import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { format } from "date-fns";

interface Day {
  hoursWorked: number;
  rateOfPay: number;
}

interface InvoiceData {
  contractorName: string;
  schoolName: string;
  invoiceDate: string;
  days: Day[];
  suppliesAmount?: number;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Add letterhead
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();

      // Add invoice details
      doc.fontSize(12);
      doc.text(`Invoice Date: ${format(new Date(data.invoiceDate), 'MMMM d, yyyy')}`);
      doc.text(`Contractor: ${data.contractorName}`);
      doc.text(`School: ${data.schoolName}`);
      doc.moveDown();

      // Add table header
      const tableTop = doc.y;
      const tableHeaders = ["Day", "Hours", "Rate", "Total"];
      const columnWidth = 120;
      
      tableHeaders.forEach((header, i) => {
        doc.text(header, 50 + (i * columnWidth), tableTop);
      });

      // Add table rows
      let yPosition = tableTop + 20;
      let totalAmount = 0;

      data.days.forEach((day, index) => {
        if (day.hoursWorked && day.rateOfPay) {
          const rowTotal = day.hoursWorked * day.rateOfPay;
          totalAmount += rowTotal;

          doc.text(`Day ${index + 1}`, 50, yPosition);
          doc.text(day.hoursWorked.toString(), 50 + columnWidth, yPosition);
          doc.text(`$${day.rateOfPay.toFixed(2)}`, 50 + (columnWidth * 2), yPosition);
          doc.text(`$${rowTotal.toFixed(2)}`, 50 + (columnWidth * 3), yPosition);

          yPosition += 20;
        }
      });

      // Add supplies if present
      if (data.suppliesAmount) {
        doc.moveDown();
        doc.text(`Supplies: $${data.suppliesAmount.toFixed(2)}`);
        totalAmount += data.suppliesAmount;
      }

      // Add total
      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: $${totalAmount.toFixed(2)}`, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendInvoiceEmail(data: InvoiceData, pdfBuffer: Buffer) {
  // Create reusable transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL, // You might want to make this configurable
    subject: `Invoice from ${data.contractorName} - ${format(new Date(data.invoiceDate), 'MMM d, yyyy')}`,
    text: `Please find attached the invoice from ${data.contractorName} for ${data.schoolName}.`,
    attachments: [{
      filename: `invoice-${format(new Date(data.invoiceDate), 'yyyy-MM-dd')}.pdf`,
      content: pdfBuffer
    }]
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
