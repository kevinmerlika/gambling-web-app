// app/components/SendRequestComponent.tsx
'use client';

import { useState } from 'react';
import { sendRequest } from '../serverActions/sendRequestServer';

export default function SendRequestComponent() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequestToServer = async () => {
    setLoading(true);
    try {
      // Call the server action directly (it runs on the server side)
      const res = await sendRequest('kot', { userId: '123' });
      setResponse(res);
      console.log('Response from server:', res);
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendRequestToServer} disabled={loading}>
        {loading ? 'Sending...' : 'Send Request'}
      </button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
