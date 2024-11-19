'use server'; // This ensures the code runs on the server-side

import { promises as fs } from 'fs';
import path from 'path'; // Ensure this line is included
import Stripe from 'stripe';
import puppeteer from 'puppeteer';
import { CheckoutSession } from '../models/stripeData';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export async function generateInvoice(
  session: CheckoutSession,
  userId: number,
  amountPaid: number,
  products: { description: string, quantity: number, amount_total: number }[] // Assuming this is passed with the session
): Promise<string[]> {
  // Common invoice data
  const invoiceData = {
    customerEmail: session.customer_email,
    amountPaid: (amountPaid / 100).toFixed(2),
    userId: userId,
    transactionId: session.id,
    invoiceDate: new Date().toLocaleDateString(),
    paymentMethod: session.paymentMethod,
    billingAddress: session.shipping ? `${session.shipping.address.line1}, ${session.shipping.address.city}, ${session.shipping.address.country}` : '',
    companyName: 'Your Company Name',
    companyAddress: '123 Business St, City, Country, ZIP',
  };

  // 1. HTML Template for the invoice with product details
  const productRowsHtml = products.map(product => {
    const totalPrice = (product.amount_total * product.quantity) / 100;
    return `
      <tr>
        <td>${product.description}</td>
        <td>${product.quantity}</td>
        <td>$${(product.amount_total / 100).toFixed(2)}</td>
        <td>$${totalPrice.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            color: #4caf50;
          }
          .invoice-details, .company-details, .billing-address {
            margin-top: 20px;
          }
          .invoice-details p, .company-details p, .billing-address p {
            font-size: 14px;
            line-height: 1.5;
          }
          .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .product-table th, .product-table td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #aaa;
          }
          .highlight {
            color: #4caf50;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Invoice</h1>
          
          <!-- Company Details -->
          <div class="company-details">
            <p><strong>Company Name:</strong> ${invoiceData.companyName}</p>
            <p><strong>Company Address:</strong> ${invoiceData.companyAddress}</p>
          </div>

          <!-- Customer Information -->
          <div class="invoice-details">
            <p><strong>Customer Email:</strong> ${invoiceData.customerEmail}</p>
            <p><strong>Invoice Date:</strong> ${invoiceData.invoiceDate}</p>
            <p><strong>Amount Paid:</strong> $${invoiceData.amountPaid}</p>
            <p><strong>User ID:</strong> ${invoiceData.userId}</p>
            <p><strong>Transaction ID:</strong> ${invoiceData.transactionId}</p>
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</p>
          </div>

          <!-- Billing Address -->
          <div class="billing-address">
            <p><strong>Billing Address:</strong> ${invoiceData.billingAddress}</p>
          </div>

          <!-- Products Table -->
          <h2>Product Details</h2>
          <table class="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${productRowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <p>Thank you for your payment!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Custom directory path (e.g., C:/invoices or any other path on your system)
  const customDirPath = 'C:/invoices'; // Adjust this as needed

  // 2. CSV Data for the invoice with product details
  const invoiceCsv = [
    ['Customer Email', 'Invoice Date', 'Amount Paid', 'User ID', 'Transaction ID', 'Payment Method', 'Billing Address', 'Product Name', 'Quantity', 'Unit Price', 'Total Price'],
    ...products.map(product => [
      invoiceData.customerEmail,
      invoiceData.invoiceDate,
      `$${invoiceData.amountPaid}`,
      invoiceData.userId,
      invoiceData.transactionId,
      invoiceData.paymentMethod,
      invoiceData.billingAddress,
      product.description,
      product.quantity,
      `$${(product.amount_total / 100).toFixed(2)}`,
      `$${((product.amount_total * product.quantity) / 100).toFixed(2)}`
    ])
  ];

  // Custom paths for files
  const htmlFileName = `invoice-${userId}-${Date.now()}.html`;
  const htmlFilePath = path.join(customDirPath, htmlFileName);

  const csvFileName = `invoice-${userId}-${Date.now()}.csv`;
  const csvFilePath = path.join(customDirPath, csvFileName);

  const pdfFileName = `invoice-${userId}-${Date.now()}.pdf`;
  const pdfFilePath = path.join(customDirPath, pdfFileName);

  try {
    // Ensure the custom directory exists
    await fs.mkdir(customDirPath, { recursive: true });

    // Save HTML file
    await fs.writeFile(htmlFilePath, invoiceHtml);
    console.log('HTML Invoice saved locally:', htmlFilePath);

    // Save CSV file
    const csvContent = invoiceCsv.map(row => row.join(',')).join('\n');
    await fs.writeFile(csvFilePath, csvContent);
    console.log('CSV Invoice saved locally:', csvFilePath);

    // Save PDF file using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHtml);
    await page.pdf({ path: pdfFilePath, format: 'A4' });
    await browser.close();
    console.log('PDF Invoice saved locally:', pdfFilePath);

    // Return relative paths for HTML, CSV, and PDF
    return [
      `file://${htmlFilePath}`,
      `file://${csvFilePath}`,
      `file://${pdfFilePath}`,
    ];
  } catch (error) {
    console.error('Error saving invoice files:', error);
    throw error;
  }
}
