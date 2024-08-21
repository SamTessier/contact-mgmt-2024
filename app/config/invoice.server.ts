import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

// Type definitions for better type safety
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

// Function to generate a PDF invoice
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Add content to the PDF
      doc.fontSize(25).text("Invoice", { align: "center" });
      doc.text(`Contractor: ${data.contractorName}`);
      doc.text(`School: ${data.schoolName}`);
      doc.text(`Date: ${data.invoiceDate}`);

      data.days.forEach((day, index) => {
        doc.text(`Day ${index + 1}: ${day.hoursWorked} hours @ $${day.rateOfPay}/hr`);
      });

      if (data.suppliesAmount) {
        doc.text(`Supplies Amount: $${data.suppliesAmount}`);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Function to send the invoice via email
export async function sendInvoiceEmail(data: InvoiceData, pdfBuffer: Buffer) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or your preferred email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "samcjtessier@gmail.com", 
      subject: `Invoice from ${data.contractorName}`,
      text: "Please find the attached invoice.",
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed.");
  }
}
