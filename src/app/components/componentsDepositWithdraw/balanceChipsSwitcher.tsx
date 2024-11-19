'use client'
// components/BalanceChipsSwitcher.tsx
import { useState } from 'react';

type BalanceChipsSwitcherProps = {
  balance: number;
  chips: number;
};

const BalanceChipsSwitcher = ({ balance, chips }: BalanceChipsSwitcherProps) => {
  const [showBalance, setShowBalance] = useState(true);

  const handleToggleView = () => {
    setShowBalance(!showBalance);  // Toggle between balance and chips
  };

  return (
    <div className="w-full text-center bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4">Balance/Chips</h2>
      <button onClick={handleToggleView} className="bg-blue-500 p-2 rounded-lg mb-4">
        Toggle between Balance and Chips
      </button>
      <div className="mt-4">
        <p className="text-lg">
          {showBalance ? `Balance: ${balance}` : `Chips: ${chips}`}
        </p>
      </div>
    </div>
  );
};

export default BalanceChipsSwitcher;
