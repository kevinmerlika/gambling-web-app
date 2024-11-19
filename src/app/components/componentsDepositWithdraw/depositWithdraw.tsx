import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';

type DepositWithdrawProps = {
  balance: number;
};

const stripePromise = loadStripe('pk_test_51MhYj2FJi7XWQWAUbpIwiZ2uSVvRaKQrFBU5QSe1iFUxPEiocTZsPjhTGvrDcF21ksgrOFYdkql8FbZTeNTXakPd00Lag3JAox');

const DepositWithdraw = ({ balance }: DepositWithdrawProps) => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [transactionMessage, setTransactionMessage] = useState<string>('');
  const [depositLoading, setDepositLoading] = useState<boolean>(false); // Track deposit button loading state
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false); // Track withdraw button loading state

  const handleDeposit = async () => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setDepositLoading(true); // Show spinner on deposit button

    try {
      const response = await fetch('/api/converter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chipsToRaise: amount }),
      });

      const data = await response.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        const error = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,  // Use sessionId returned from your API
        });

        if (error) {
          console.error('Error during checkout redirect:', error);
          alert('Error during redirect');
        }
      } else {
        alert('Failed to create Stripe session');
      }
    } catch (error) {
      console.error('Error during deposit:', error);
      alert('Error during deposit');
    } finally {
      setDepositLoading(false); // Hide spinner after deposit is complete
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > balance) {
      alert('Insufficient funds');
      return;
    }

    setWithdrawLoading(true); // Show spinner on withdraw button

    try {
      const response = await fetch('/api/converter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chipsToDeduct: amount,
        }),
      });

      const data = await response.json();
      if (data.message) {
        setTransactionMessage(data.message);
      } else {
        setTransactionMessage('Withdrawal failed');
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);
      setTransactionMessage('Error during withdrawal');
    } finally {
      setWithdrawLoading(false); // Hide spinner after withdrawal is complete
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-white text-center mb-6">Deposit / Withdraw</h2>

      <div className="mb-6 text-center">
        <span className="text-lg text-white">Current Balance: </span>
        <span className="text-xl font-bold text-green-500">${balance.toFixed(2)}</span>
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter amount"
      />

      <div className="flex justify-between space-x-4">
        <button
          onClick={handleDeposit}
          className="w-full bg-green-500 p-3 rounded-lg text-white font-semibold hover:bg-green-600 transition duration-300"
          disabled={depositLoading} // Disable deposit button while loading
        >
          {depositLoading ? <LoadingSpinner /> : 'Deposit'} {/* Show spinner if deposit is loading */}
        </button>

        <button
          onClick={handleWithdraw}
          className="w-full bg-red-500 p-3 rounded-lg text-white font-semibold hover:bg-red-600 transition duration-300"
          disabled={withdrawLoading} // Disable withdraw button while loading
        >
          {withdrawLoading ? <LoadingSpinner /> : 'Withdraw'} {/* Show spinner if withdraw is loading */}
        </button>
      </div>

      {transactionMessage && (
        <p className="mt-6 text-center text-white text-lg">{transactionMessage}</p>
      )}
    </div>
  );
};

export default DepositWithdraw;
