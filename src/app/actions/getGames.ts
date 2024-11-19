'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const getGames = async (searchQuery: string) => {
  try {
    // Trim whitespace from the search query
    const trimmedQuery = searchQuery.trim();
    let games;

    if (trimmedQuery) {
      console.log("searchQuery is not empty after trimming");
      // Query games with a title that contains the trimmed search query
      games = await prisma.games.findMany({
        where: {
          title: {
            contains: trimmedQuery,  // Partial match search
          },
        },
        take: 7,  // Limit the results to the top 7 games
        orderBy: {
          createdAt: 'desc',  // Order by creation date
        },
      });
    } else {
      console.log("searchQuery is empty or contains only spaces");
      // Fetch top 7 games without filtering
      games = await prisma.games.findMany({
        take: 7,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Serialize the createdAt field to an ISO string to make the data serializable
    const serializedGames = games.map(game => ({
      ...game,
      createdAt: game.createdAt ? game.createdAt.toISOString() : null, // Serialize Date to ISO string
    }));

    console.log(serializedGames);  // Log the serialized games
    await revalidatePath('/');
    return serializedGames;  // Return the serialized list of games

  } catch (error) {
    console.error('Error fetching games:', error);
    throw new Error('Error fetching games');
  }
};
