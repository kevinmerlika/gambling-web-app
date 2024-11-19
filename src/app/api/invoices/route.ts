import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return NextResponse.json({ error: "File name is required" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "invoices", fileName);

  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Return the file as a response
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving the file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
