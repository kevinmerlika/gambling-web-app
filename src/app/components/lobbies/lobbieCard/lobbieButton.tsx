// LobbyButton.tsx
import React from 'react';

interface LobbyButtonProps {
  onJoin: () => void;
  isConnected: boolean;
}

const LobbyButton: React.FC<LobbyButtonProps> = ({ onJoin, isConnected }) => (
  <button
    onClick={onJoin}
    className={`w-full mt-4 py-2 px-4 rounded-lg text-white ${isConnected ? 'bg-red-700' : 'bg-green-700'} hover:${isConnected ? 'bg-red-800' : 'bg-green-800'} transition`}
  >
    {isConnected ? 'Leave Lobby' : 'Join Lobby'}
  </button>
);

export default LobbyButton;
