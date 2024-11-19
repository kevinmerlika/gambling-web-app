import { NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY || ''; // Provide fallback empty string if undefined

export async function POST(req: Request) {
  try {
    const requestBody = await req.json(); // Get the body from the incoming request

    console.log(requestBody);
    
    // Extract endpoint and data from the request body
    const { endpoint, data } = requestBody;
    console.log(`Requesting URL: http://localhost:3001/auth/${endpoint}`);

    if (!endpoint) {
      return NextResponse.json({ message: 'Endpoint is required' }, { status: 400 });
    }

    // Send the request to the dynamic endpoint on the other server using fetch
    const response = await fetch(`http://localhost:3001/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY, // Send the API key in the header
      } as HeadersInit, // Explicitly cast to HeadersInit
      body: JSON.stringify(data), // Forward the data from the client
    });

    if (!response.ok) {
        console.log(response);
        
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Parse the response data
    const responseData = await response.json();

    // Return the response from the other server
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error while sending the request:', error);
    return NextResponse.json({ message: 'Error occurred while processing the request' }, { status: 500 });
  }
}
