'use client'; // Ensure this is rendered on the client-side

import { useState } from 'react';
import DepositWithdraw from './depositWithdraw';
import BalanceChipsSwitcher from './balanceChipsSwitcher';
import CurrencyConverter from './currencyConverter';
import StripeWrapper from './refundButton';
import RefundButton from './refundComponentButton';

type SliderComponentProps = {
  balance: {
    balance: number;
    chips: number;
  };
};

const SliderComponent = ({ balance }: SliderComponentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const components = [
    <DepositWithdraw balance={balance.balance} />,
    <BalanceChipsSwitcher balance={balance.balance} chips={balance.chips} />,
    <CurrencyConverter balance={balance.balance} />,
    // <StripeWrapper />
    <RefundButton chargeId='ch_3QLbOxFJi7XWQWAU1XpwyWLj'/>
  ];

  // Handle the next and previous buttons
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Slider controls */}
      <div className="flex justify-center mb-6">
        <button
          onClick={prevSlide}
          className="bg-blue-600 p-4 rounded-full text-white hover:bg-blue-500 focus:outline-none transition duration-200 mx-2"
          aria-label="Previous Slide"
        >
          Prev
        </button>
        <button
          onClick={nextSlide}
          className="bg-blue-600 p-4 rounded-full text-white hover:bg-blue-500 focus:outline-none transition duration-200 mx-2"
          aria-label="Next Slide"
        >
          Next
        </button>
      </div>

      {/* Slider Content */}
      <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[350px]">
        {/* Slide transition with animation */}
        <div className="transition-all duration-500 ease-in-out h-full">
          <div className="flex justify-center items-center h-full px-4">
            {/* Content Container */}
            <div className="w-full h-full bg-gray-900 p-6 rounded-lg shadow-xl flex justify-center items-center">
              {components[currentIndex]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
