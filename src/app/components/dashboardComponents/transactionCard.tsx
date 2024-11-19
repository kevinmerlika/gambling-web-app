'use client';

import React from 'react';

type TransactionCardProps = {
  transactionId: string;
  total: number;
  type: string;
  status: string;
  currency: string;
  referenceLink?: string;
};

const TransactionCard = ({
  transactionId,
  total,
  type,
  status,
  currency,
  referenceLink,
}: TransactionCardProps) => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <h3 className="font-semibold text-xl text-white mb-2">Transaction ID: {transactionId}</h3>
      <p className="text-gray-300 mb-2">
        <span className="font-medium text-gray-100">Amount:</span> {currency} {total.toFixed(2)}
      </p>
      <p className="text-gray-300 mb-2">
        <span className="font-medium text-gray-100">Type:</span> {type}
      </p>
      <p className={`text-sm font-medium ${status === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
        Status: {status}
      </p>
      {referenceLink && (
        <a
          href={referenceLink}
          className="text-blue-400 hover:text-blue-600 mt-4 inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Details
        </a>
      )}
    </div>
  );
};

export default TransactionCard;
