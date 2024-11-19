'use client';
import { getLobbies } from '@/app/actions/getLobbies';
import React, { useEffect, useState } from 'react';
import LobbyCard from './lobbieCard/lobbycard';
import { Session } from 'next-auth';
import PokerTable from '../pokergame/pokergame';
import InteractionPanel from '../pokergame/interaction';
import { getToken } from 'next-auth/jwt';

interface Lobby {
  id: number;
  name: string;
  users: { id: number; name: string }[];
}

interface LobbiesProps {
  gameId: number;
  session: Session | null;  // Ensure session can be null
}

const Lobbies: React.FC<LobbiesProps> = ({ gameId, session }) => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLobbiesData = async () => {
      setLoading(true);
      try {
        const data = await getLobbies(gameId);

        // Transform `Players` to `users` to match Lobby type
        const formattedLobbies = data.map((lobby) => ({
          ...lobby,
          users: lobby.Players.map((player) => ({
            id: player.id,
            name: player.username,
          })),
        }));

        setLobbies(formattedLobbies);
      } catch (error) {
        console.error('Error fetching lobbies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLobbiesData();
  }, [gameId]);

  return (
<div className="lobbies-container max-w-6xl mx-auto p-8 bg-gradient-to-r from-indigo-900 via-purple-800 to-gray-900 min-h-screen">
<h2 className="cursor-pointer text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600 mb-12 text-center tracking-wide transform transition-all duration-300 hover:scale-105 hover:text-white">
  Available Lobbies
</h2>
  {loading ? (
    <div className="flex justify-center items-center space-x-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-solid"></div>
      <p className="text-white text-lg">Loading lobbies...</p>
    </div>
  ) : lobbies.length === 0 ? (
    <p className="text-center text-white text-xl">No lobbies available</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {lobbies.map((lobby) => (
        <div key={lobby.id} className="transition-transform transform hover:scale-105 hover:shadow-lg">
          <LobbyCard
            lobbyId={lobby.id}
            name={lobby.name}
            users={lobby.users}
            session={session}  // Pass session to LobbyCard
          />
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Lobbies;
