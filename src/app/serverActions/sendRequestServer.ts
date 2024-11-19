// app/sendRequest.ts
'use server';

export async function sendRequest(endpoint: string, data: any) {
  const API_KEY = process.env.API_KEY;
  
  try {
    console.log('Sending request to the external API...');
    
    const response = await fetch(`http://localhost:3001/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY || '', // Ensure API key is being passed correctly
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData; // Return the response from the external API
  } catch (error) {
    console.error('Error while sending the request:', error);
    return { message: 'Error occurred while processing the request' };
  }
}
