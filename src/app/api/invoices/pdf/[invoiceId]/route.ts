import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

export async function GET(req: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;

  // Resolve the file path to the invoice PDF
  const filePath = path.resolve('invoices', `${invoiceId}.html`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Create a ReadStream from the file
    const fileStream = fs.createReadStream(filePath);

    // Create a new ReadableStream for the Next.js Response
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => {
          controller.enqueue(chunk); // Enqueue data to the response stream
        });

        fileStream.on('end', () => {
          controller.close(); // Close the stream when the file ends
        });

        fileStream.on('error', (err) => {
          controller.error(err); // Handle errors
        });
      },
    });

    // Return the stream as a response with appropriate headers
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf', // Set content type to PDF
        'Content-Disposition': `attachment; filename="${invoiceId}.pdf"`, // Set content disposition for download
      },
    });
  } else {
    // Return a 404 if the file is not found
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
}
