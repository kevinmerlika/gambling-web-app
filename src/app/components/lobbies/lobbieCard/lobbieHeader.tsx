// LobbyHeader.tsx
import React from 'react';

interface User {
  id: number;
  name: string;
}

interface LobbyHeaderProps {
  name: string;
  users: User[];
}

const LobbyHeader: React.FC<LobbyHeaderProps> = ({ name, users }) => (
  <div>
    <h3 className="text-2xl font-bold text-white">{name}</h3>
    <p className="text-gray-400 mt-2">{users.length} player(s) in the lobby</p>
  </div>
);

export default LobbyHeader;
