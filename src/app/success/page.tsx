import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateInvoice } from '../actions/generateInvoice';
import { getSessionData } from '../actions/getStripeData';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export default async function PaymentSuccess({ searchParams }: { searchParams: { session_id: string } }) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    return (
      <div className="grid min-h-screen items-center justify-center p-8 text-center bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Session ID Missing</h1>
        <p>Unable to retrieve session details. Please check the session ID.</p>
      </div>
    );
  }

  // Retrieve the session data using the getSessionData function
  let sessionData;
  try {
    sessionData = await getSessionData(session_id);
    if (!sessionData) {
      throw new Error('Session data not found.');
    }
    console.log('Customer session:', sessionData);
  } catch (error) {
    console.error('Error retrieving session:', error);
    return (
      <div className="grid min-h-screen items-center justify-center p-8 text-center bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>There was an error retrieving your session. Please try again later.</p>
      </div>
    );
  }

  // Generate the invoice and save it locally
  let invoicePaths: string[] | null = null;
  try {
    const productDetails = sessionData.line_items?.data.map((item) => {
      if (item) {
        const product = item;
        console.log(product);
        return product;
      }
      return null;
    }).filter(Boolean); // Remove null items

    if (productDetails.length === 0) {
      console.error('No valid product details found in session.');
    } else {
      invoicePaths = await generateInvoice(sessionData, sessionData.metadata.userId, sessionData.amount_total, productDetails);
      console.log('Generated invoice paths:', invoicePaths);
    }
  } catch (error) {
    console.error('Error generating invoice:', error);
    invoicePaths = null; // Set to null in case of error
  }

  

// Function to convert Windows paths to file:// URLs
const convertToFileUrl = (windowsPath: any) => {
  return windowsPath.replace(/\\/g, '/');  // Replace backslashes with forward slashes
};

// Check if the paths exist and handle the download links
const invoicePdfPath = invoicePaths?.[2] ? convertToFileUrl(invoicePaths[2]) : null; // Assuming PDF is the first path in the list
const invoiceHtmlPath = invoicePaths?.[0] ? convertToFileUrl(invoicePaths[0]) : null; // Assuming HTML is the second path
const invoiceCsvPath = invoicePaths?.[1] ? convertToFileUrl(invoicePaths[1]) : null; // Assuming CSV is the third path


  if (!invoicePdfPath && !invoiceHtmlPath && !invoiceCsvPath) {
    console.error('All invoice paths are null or undefined');
  }

  // Return the success page with the download links to the generated invoices
  return (
    <div className="grid grid-cols-1 items-center justify-items-center min-h-screen bg-gray-900 p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-sm p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 animate-ping" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-green-500 mb-2">Payment Successful!</h1>
        <p className="text-lg text-center text-gray-300">Thank you for your payment, {sessionData.customer_email}!</p>
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold text-gray-100">
            Amount Paid: ${(sessionData.amount_total / 100).toFixed(2)}
          </p>
          {invoicePdfPath && (
            <div className="mt-4">
              <a href={`/api/downloadInvoice?filename=${encodeURIComponent(invoicePdfPath)}`} className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg">
                Download as PDF
              </a>
            </div>
          )}
          {invoiceHtmlPath && (
            <div className="mt-4">
              <a href={`/api/downloadInvoice?filename=${encodeURIComponent(invoiceHtmlPath)}`} className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg">
                Download as HTML
              </a>
            </div>
          )}
          {invoiceCsvPath && (
            <div className="mt-4">
              <a href={`/api/downloadInvoice?filename=${encodeURIComponent(invoiceCsvPath)}`} className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg">
                Download as CSV
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
