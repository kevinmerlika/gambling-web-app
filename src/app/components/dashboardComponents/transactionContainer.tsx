'use client'
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code'; // Import the QRCode component
import RefundButton from '../componentsDepositWithdraw/refundComponentButton';
import DailySpendingChart from './displaySpendingChart';

interface Transaction {
  id: number;
  userId: number;
  transactionId: string;
  total: number;
  currency: string;
  status: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  referenceLink: string;
}

type TransactionContainerProps = {
  transactions: Transaction[];
};

const PAGE_SIZE = 5;

const TransactionContainer: React.FC<TransactionContainerProps> = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state for data
  const [filterStatus, setFilterStatus] = useState<string>(''); // Filter by status
  const [minAmount, setMinAmount] = useState<number>(0); // Min amount
  const [maxAmount, setMaxAmount] = useState<number>(20000000); // Max amount

  const transactionStatuses = ['Completed', 'Pending', 'Refunded'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Data loaded
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter transactions
  const totalTransactions = transactions.filter((transaction) => {
    const matchesStatus = filterStatus ? transaction.status.toLowerCase().includes(filterStatus.toLowerCase()) : true;
    const matchesAmount = transaction.total >= minAmount && transaction.total <= maxAmount;
    return  matchesStatus && matchesAmount;
  });

  const totalPages = Math.ceil(totalTransactions.length / PAGE_SIZE);

  const paginateTransactions = (page: number) => {
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return totalTransactions.slice(startIdx, endIdx);
  };

  const transactionsToDisplay = paginateTransactions(currentPage);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-lg">
      {/* Filters Section */}
      <div className="flex justify-between p-4 bg-gray-800 rounded-t-lg">
        <div className="flex space-x-4">

          <select
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Choose Status</option>
            {transactionStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Price Filters */}
          <div className="flex space-x-4 items-center">
            <label className="text-gray-200">Min Amount</label>
            <input
              type="range"
              min="0"
              step={500}
              max="20000000"
              value={minAmount}
              onChange={(e) => setMinAmount(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-gray-200">{minAmount}</span>
          </div>

          <div className="flex space-x-4 items-center">
            <label className="text-gray-200">Max Amount</label>
            <input
              type="range"
              min="0"
              step={500}
              max="20000000"
              value={maxAmount}
              onChange={(e) => setMaxAmount(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-gray-200">{maxAmount}</span>
          </div>
        </div>
      </div>
        <DailySpendingChart transactions={transactions}/>
      {/* Transactions Table */}
      <div className="overflow-y-auto" style={{ minHeight: '400px', maxHeight: '400px' }}>
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-200">Transaction ID</th>
              <th className="px-6 py-3 font-semibold text-gray-200">Amount</th>
              <th className="px-6 py-3 font-semibold text-gray-200">Currency</th>
              <th className="px-6 py-3 font-semibold text-gray-200">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-200">Reference</th>
              <th className="px-6 py-3 font-semibold text-gray-200">QR Code</th> 
              <th className="px-6 py-3 font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionsToDisplay.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactionsToDisplay.map((transaction) => (
                <tr key={transaction.transactionId} className="border-t border-gray-700">
                  <td className="px-6 py-4">{transaction.transactionId}</td>
                  <td className="px-6 py-4">{transaction.total}</td>
                  <td className="px-6 py-4">{transaction.currency}</td>
                  <td className="px-6 py-4">{transaction.status}</td>
                  <td className="px-6 py-4">
                    {transaction.referenceLink ? (
                      <a
                        href={"/success?session_id=" + transaction.referenceLink}
                        className="text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {transaction.referenceLink ? (
                      <QRCode value={"http://192.168.100.40:3000/success?session_id=" + transaction.referenceLink}  size={120}/>
                      ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <RefundButton chargeId={transaction.transactionId} /> {/* Added RefundButton */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-b-lg">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Previous
        </button>
        <div className="text-gray-300">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionContainer;
