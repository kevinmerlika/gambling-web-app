import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// The directory where the invoices are stored
const invoiceDirectory = 'C:/invoices'; // Adjust this path as necessary

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filename = searchParams.get('filename'); // Expecting filename query parameter

  console.log("Requested filename:", filename); // Debugging log
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename parameter is missing' }, { status: 400 });
  }

  // Clean the filename and prevent path traversal or invalid file paths
  const cleanedFilename = filename.replace(/^file:\/\//, ''); // Remove 'file://' if it's part of the filename
  const filePath = path.resolve(invoiceDirectory, cleanedFilename); // Resolve the full path
  console.log("Full file path:", filePath); // Debugging log

  try {
    // Check if the file exists and is readable
    fs.accessSync(filePath, fs.constants.R_OK); // Check read access
    console.log("File exists and is accessible:", filePath);

    // Read the file and serve it
    const fileBuffer = fs.readFileSync(filePath);

    // Determine the correct content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default binary type

    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.html') {
      contentType = 'text/html';
    } else if (ext === '.csv') {
      contentType = 'text/csv';
    }

    // Return the file with the appropriate content type and disposition for download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error accessing file:', error);
    return NextResponse.json({ error: 'File not found or not accessible' }, { status: 404 });
  }
}
