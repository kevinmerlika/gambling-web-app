'use server';

import { prisma } from '@/lib/prisma';

export const getLobbies = async (gameId: number) => {
  try {
    // Query the lobbies from the database, filtered by the gameId
    const lobbies = await prisma.lobby.findMany({
      where: {
        gameId: gameId,  // Use gameId to filter lobbies
      },
      include: {
        Players: true,  // Optionally, include the users currently in the lobby
      },
    });

    console.log(lobbies);
    
    return lobbies;  // Return the filtered list of lobbies
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    throw new Error('Error fetching lobbies');
  }
};
