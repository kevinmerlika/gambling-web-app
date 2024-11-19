import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

type InteractionPanelProps = {
  playerCards: string[];
  socket: Socket;
};

const InteractionPanel: React.FC<InteractionPanelProps> = ({ playerCards, socket }) => {
  const handleAction = () => {
    // Example: Emit an action to the server
    socket.emit('playerAction', { cards: playerCards });
  };


  
  const [betAmount, setBetAmount] = useState(0);
  const [flipped, setFlipped] = useState([false, false]); // Track card flip states

  // Handle bet amount change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(Number(event.target.value));
  };

 // Function to map card code to image path, with ranks 2-10 left as numbers
const getCardImagePath = (cardCode: string) => {
    // Map face cards to their full names
    const rankMap: { [key: string]: string } = {
      A: "ace",
      K: "king",
      Q: "queen",
      J: "jack",
      T: "ten",
    };
  
    // Map suits to their full names
    const suitMap: { [key: string]: string } = {
      S: "spades",
      H: "hearts",
      D: "diamonds",
      C: "clubs",
    };
  
    // Extract rank and suit
    const rank = cardCode.slice(0, -1); // e.g., "A", "10", "3"
    const suit = cardCode.slice(-1);    // e.g., "S", "H"
  
    // Determine the filename for face cards or numbers
    const rankName = rankMap[rank] || rank; // Use mapped name or number as-is
  
    // If both rank and suit are valid, construct the path
    if (rankName && suitMap[suit]) {
      return `/assets/cards/${rankName}_of_${suitMap[suit]}.png`;
    }
  
    // Return placeholder if no valid card was matched
    return "/assets/cards/placeholder.png";
  };
  

  // Handle card click to toggle flip state
  const handleCardClick = (index: number) => {
    setFlipped((prevFlipped) => {
      const newFlipped = [...prevFlipped];
      newFlipped[index] = !newFlipped[index]; // Toggle flip state for clicked card
      return newFlipped;
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 mx-auto mt-6 h-[600px]">
      {/* Cards Placeholder */}
      <div className="flex justify-center space-x-4 mb-6">
        {/* Player's first card */}
       {/* Player's first card */}
       <div
          className="w-24 h-32 bg-gray-600 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
          onClick={() => handleCardClick(0)}
        >
          <div
            className={`w-full h-full ${flipped[0] ? 'rotate-y-180' : ''} transition-transform duration-500`}
          >
            {playerCards[0] ? (
              <img
                src={flipped[0] ? '/assets/cards/back.png' : getCardImagePath(playerCards[0])}
                alt="Card"
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-white text-2xl">?</p>
            )}
          </div>
        </div>

        {/* Player's second card */}
        <div
          className="w-24 h-32 bg-gray-600 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
          onClick={() => handleCardClick(1)}
        >
          <div
            className={`w-full h-full ${flipped[1] ? 'rotate-y-180' : ''} transition-transform duration-500`}
          >
            {playerCards[1] ? (
              <img
                src={flipped[1] ? '/assets/cards/back.png' : getCardImagePath(playerCards[1])}
                alt="Card"
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-white text-2xl">?</p>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center text-white text-xl font-semibold mb-4">Your Action</div>

      {/* Buttons and Slider */}
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-indigo-600 text-white py-4 rounded-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Raise
          </button>
          <button className="bg-red-600 text-white py-4 rounded-md hover:bg-red-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400">
            Fold
          </button>
          <button className="bg-gray-600 text-white py-4 rounded-md hover:bg-gray-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400">
            Check
          </button>
          <button className="bg-green-600 text-white py-4 rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
            Call
          </button>
        </div>

        {/* Slider for bet amount */}
        <div className="flex flex-col space-y-2 text-white">
          <label className="text-sm">Bet Amount: ALL {betAmount}</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="10"
            value={betAmount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-indigo-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractionPanel;
