'use client';
import { useState } from 'react';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { PiPokerChipFill } from "react-icons/pi";
import { FiRefreshCw } from 'react-icons/fi';


type GetBalanceParams = {
  id: string;  // The email of the user whose balance you want to fetch
  balance: number | null; // The balance passed as a prop
  chips: number | null;   // The chips passed as a prop
};

const Balance = ({ id, balance, chips }: GetBalanceParams) => {
  // State to track whether to show balance or chips
  const [showBalance, setShowBalance] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  // Toggle between balance and chips and add spinning effect
  const handleToggleView = () => {
    setIsSpinning(true); // Start spinning the button
    setShowBalance(!showBalance); // Toggle between balance and chips
    setTimeout(() => setIsSpinning(false), 500); // Stop spinning after animation duration
  };

  return (
    <div className="text-white flex items-center space-x-2">
      <button
        onClick={handleToggleView}
        className="cursor-pointer relative flex items-center justify-center"
      >

{/* Reverse Card Icon with Spin Effect */}
<span
  role="img"
  aria-label="reverse-card"
  className={`inline-block text-xl transition-transform duration-500 transform ${isSpinning ? 'rotate-180' : ''}`}
>
  <FiRefreshCw />
</span>
      </button>

     {/* Balance Label */}
<span className="font-medium text-xs sm:text-base">
  {showBalance ? (
    'Balance:'
  ) : (
    <>
      <PiPokerChipFill color='#FF0000'/>
    </>
  )}
</span>


      {/* Balance Value */}
      <span className="font-bold text-xs sm:text-lg text-green-400">
        {showBalance ? (
          balance === null ? (
            <LoadingSpinner /> // Show loading spinner if balance is null
          ) : (
            `ALL ${balance.toFixed(2)}` // Show balance when available
          )
        ) : (
          chips === null ? (
            <LoadingSpinner /> // Show loading spinner if chips is null
          ) : (
            `${chips}` // Show chips when available
          )
        )}
      </span>
    </div>
  );
};

export default Balance;
