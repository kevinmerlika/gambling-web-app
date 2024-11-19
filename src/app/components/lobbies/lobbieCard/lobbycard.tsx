import React, { useState } from 'react';
import io, { Socket } from 'socket.io-client';
import LobbyHeader from './lobbieHeader';
import LobbyButton from './lobbieButton';
import ChipDialog from './chipDialog';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
}

type PokerGameProps = {
  playerCards: string[]; // Cards for the player
  lobbyId: number;
  lobbyType: 'premium' | 'regular' | 'vip' | 'classic' | 'luxury'; // Restrict to specific lobby types
  socket: any;
};

interface LobbyCardProps {
  lobbyId: number;
  name: string;
  users: User[];
  session: Session | null;
}

const LobbyCard: React.FC<LobbyCardProps> = ({ lobbyId, name, users, session }) => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showChipDialog, setShowChipDialog] = useState(false);
  const [chips, setChips] = useState(0);

  const onJoin = async () => {
    if (!session) {
      console.log('No session found. Please log in first.');
      return;
    }

    if (isConnected) {
      socket!.emit('leaveLobby', { lobbyId, session });
      socket!.disconnect();
      setIsConnected(false);
      setSocket(null);
      return;
    }

    setShowChipDialog(true);
  };

  const handleChipSubmit = async () => {
    if (chips < 100) {
      alert('You must have at least 100 chips to join the game.');
      return;
    }

    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);

    try {
      // Call API to deduct chips from the user's balance
      const response = await fetch('/api/lobby/convertBalanceToChips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balanceToTransfer: chips }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to deduct chips');
        return;
      }

      const data = await response.json();
      console.log(data.message);

      // Proceed with joining the lobby
      socketInstance.emit('joinLobby', { lobbyId, session, chips });
      setIsConnected(true);

      console.log(`Player ${session?.user?.name} joined lobby ${lobbyId} with ${chips} chips`);

      // Redirect to the PokerGame page with the lobbyId and socket connection info
      router.push(`/game/${lobbyId}`); // Redirect to the game page

    } catch (error) {
      console.error('Error adding player to lobby:', error);
    }

    setShowChipDialog(false);

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setSocket(null);
    });
  };

  // Render the LobbyCard UI
  return (
    <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <LobbyHeader name={name} users={users} />
        <LobbyButton onJoin={onJoin} isConnected={isConnected} />
        <ChipDialog
          show={showChipDialog}
          chips={chips}
          setChips={setChips}
          onSubmit={handleChipSubmit}
          onClose={() => setShowChipDialog(false)}
        />
      </div>
    </div>
  );
};

export default LobbyCard;
