// components/DailySpendingChart.tsx
'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Transaction {
  id: number;
  userId: number;
  transactionId: string;
  total: number;
  currency: string;
  status: string;
  date: Date | string; // Allow date to be either a string or Date object
  createdAt: Date;
  updatedAt: Date;
  referenceLink: string;
}

type DailySpendingChartProps = {
  transactions: Transaction[];
};

const DailySpendingChart: React.FC<DailySpendingChartProps> = ({ transactions }) => {
  // Prepare daily spending data
  const dailySpendingData = transactions.reduce((acc, transaction) => {
    // Ensure date is a Date object
    const date = new Date(transaction.date); // Convert string or Date to Date object

    // If it's an invalid date, skip this transaction
    if (isNaN(date.getTime())) {
      return acc;
    }

    const dateString = date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format

    if (!acc[dateString]) acc[dateString] = 0;
    acc[dateString] += transaction.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(dailySpendingData), // Dates
    datasets: [
      {
        label: 'Daily Spending',
        data: Object.values(dailySpendingData), // Total amounts for each day
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h3 className="text-xl text-gray-300">Daily Spending</h3>
      <Line data={chartData} />
    </div>
  );
};

export default DailySpendingChart;
