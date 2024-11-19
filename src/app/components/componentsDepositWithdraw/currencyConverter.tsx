'use client'
// components/CurrencyConverter.tsx
import { useState } from 'react';

const conversionRates = {
  USD: 1.1,  // Example: 1 EUR = 1.1 USD
  EUR: 0.9,  // Example: 1 USD = 0.9 EUR
};

type CurrencyConverterProps = {
  balance: number;
};

const CurrencyConverter = ({ balance }: CurrencyConverterProps) => {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('EUR');

  const convertCurrency = (amount: number, toCurrency: 'USD' | 'EUR') => {
    return toCurrency === 'USD' ? amount * conversionRates.USD : amount * conversionRates.EUR;
  };

  return (
    <div className="w-full text-center bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4">Currency Converter</h2>
      <div className="flex justify-center mb-4">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR')}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <p className="text-lg">
        {currency === 'USD'
          ? `Converted Amount: $${convertCurrency(balance, 'USD')}`
          : `Converted Amount: €${convertCurrency(balance, 'EUR')}`}
      </p>
    </div>
  );
};

export default CurrencyConverter;
