'use client'

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm: React.FC = () => {
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      setIsProcessing(false);
      return;
    }

    setPaymentMethodId(paymentMethod?.id || null);
    await createPayment(paymentMethod?.id || '');
  };

  const createPayment = async (paymentMethodId: string) => {
    try {
      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 5000, // Amount in cents (e.g., 5000 = $50.00)
          currency: 'usd',
          paymentMethodId,
        }),
      });

      const result = await response.json();
      console.log(result);
      
      // Handle the result (success or failure) based on your needs
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 w-full max-w-sm shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border p-4 rounded-md">
            <CardElement />
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={!stripe || isProcessing} 
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 transition"
            >
              {isProcessing ? 'Processing...' : 'Pay $50.00'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StripeWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default StripeWrapper;
