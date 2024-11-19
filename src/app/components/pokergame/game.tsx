'use client';

import React, { useEffect, useState } from 'react';
import InteractionPanel from './interaction';
import PokerTable from './pokergame';
import { io, Socket } from 'socket.io-client';

type PokerGameProps = {
  playerCards: string[]; // Cards for the player
  lobbyId: number;
  lobbyType: 'premium' | 'regular' | 'vip' | 'classic' | 'luxury'; // Restrict to specific lobby types
  socket: Socket | null; // Update the socket type for better type safety
};

const PokerGame: React.FC<PokerGameProps> = ({ playerCards, lobbyId, lobbyType, socket }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  console.log(playerCards);
  
  // If no socket is provided, show a connecting message
  if (!socket) {
    return <div>Connecting to the game...</div>;
  }

  useEffect(() => {
    // Verify if the socket is connected
    if (socket?.connected) {
      setIsConnected(true);
    }

    // Handle socket disconnect
    socket?.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket?.off('disconnect'); // Clean up listener on component unmount
    };
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Connection status */}
      <div className="mb-4 text-xl font-bold">
        {isConnected ? 'Connected to the game' : 'Waiting for connection...'}
      </div>

      {/* Row layout for game panels */}
      <div className="flex flex-row space-x-4 w-full max-w-screen-xl">
        {/* Interaction Panel */}
        <div className="flex-1">
          <InteractionPanel playerCards={playerCards} socket={socket} />
        </div>

        {/* Poker Table */}
        <div className="flex-2">
          <PokerTable lobbyType={lobbyType} lobbyId={lobbyId} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default PokerGame;
