'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RefundButton: React.FC<{ chargeId: string }> = ({ chargeId }) => {
  const router = useRouter()
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundStatus, setRefundStatus] = useState<string | null>(null);

  const handleRefund = async () => {
    setIsRefunding(true);
    setRefundStatus(null); // Reset status

    try {
      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chargeId }),
      });

      const data = await response.json();

      if (data.error) {
        setRefundStatus(`Error: ${data.error}`);
      } else {
        setRefundStatus('Refund successful!');
      }
    } catch (error) {
      setRefundStatus('Refund failed, please try again.');
    } finally {
      setIsRefunding(false);
      router.refresh()
      
      
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleRefund}
        disabled={isRefunding}
        className={`px-6 py-2 rounded-md text-white font-semibold transition-colors 
          ${isRefunding ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'}
        `}
      >
        {isRefunding ? 'Processing Refund...' : 'Request Refund'}
      </button>
      {refundStatus && (
        <p className="text-center text-sm text-gray-300 mt-2">
          {refundStatus}
        </p>
      )}
    </div>
  );
};

export default RefundButton;
