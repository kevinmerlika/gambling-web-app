'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Socket, io } from 'socket.io-client';
import PokerGame from '@/app/components/pokergame/game';

const PokerGamePage: React.FC = () => {
  const { lobbyId } = useParams(); // Get the lobbyId from the URL params
  const [socket, setSocket] = useState<Socket | null>(null);
  const [playerCards, setPlayerCards] = useState<string[]>([]); // To store the player's cards
  const [isConnected, setIsConnected] = useState<boolean>(false); // State to track connection status

  // Logging to verify lobbyId and socket creation
  console.log('Lobby ID:', lobbyId);

  useEffect(() => {
    if (!lobbyId) {
      console.log('Lobby ID is missing');
      return; // If lobbyId is not found, don't attempt to connect the socket
    }

    // Only initialize the socket if it has not been initialized yet
    if (!socket) {
      console.log('Initializing socket connection...');

      const socketInstance = io('http://localhost:3001', {
        query: { lobbyId }, // Send lobbyId as part of the connection query
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id); // Log the socket id when connected
        setIsConnected(true); // Set the connected state to true
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false); // Set the connected state to false
      });

      setSocket(socketInstance); // Store the socket instance in state

      // Listen for the 'game:start' event and log the received data
      socketInstance.on('game:start', (data: { cards: string[] }) => {
        console.log('Received cards:', data.cards);
        if (data.cards && data.cards.length > 0) {
          setPlayerCards(data.cards); // Update player cards with the received data
        } else {
          console.error('No cards received or empty array');
        }
      });

      // Cleanup: Disconnect socket when component unmounts
      return () => {
        console.log('Disconnecting socket');
        socketInstance.disconnect(); // Disconnect socket when component unmounts
      };
    }

    // If the socket already exists, just return early
    return () => {};
  }, [lobbyId, socket]); // Re-run when lobbyId changes or socket is set

  // Show loading or connection status if not connected yet
  if (!isConnected) {
    return <div>Waiting for connection...</div>;
  }

  // Render the PokerGame component once the socket is connected and cards are available
  return (
    <div>
      <div><h1>{playerCards.length > 0 ? playerCards.join(', ') : 'No cards yet'}</h1></div>
      <PokerGame playerCards={playerCards} lobbyId={parseInt(lobbyId as string)} socket={socket} />
    </div>
  );
};

export default PokerGamePage;
