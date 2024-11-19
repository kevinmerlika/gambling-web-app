import Lobbies from '@/app/components/lobbies/lobbies';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface GameProps {
  params: {
    slug: string; // ID from dynamic route
  };
  searchParams: { [key: string]: string | undefined };
}

// Fetch game data from the database based on the game ID (slug)
const fetchGameData = async (slug: string) => {
  const gameId = parseInt(slug);

  if (isNaN(gameId)) {
    throw new Error('Invalid game ID');
  }

  // Query the game data from the database
  return await prisma.games.findUnique({
    where: { id: gameId },
  });
};

const Game = async ({ params, searchParams }: GameProps) => {
  const { slug } = params;

  console.log('Game ID:', slug); // Debugging to check if the ID is passed correctly

  // Fetch the session data
  const session = await getServerSession(authOptions);

  console.log('User ID:', session?.user.id);

  try {
    // Fetch game data from the database
    const gameData = await fetchGameData(slug);

    // If game data is not found, return a 404
    if (!gameData) {
      notFound();
    }

    // Check if the "play" query parameter is present
    const shouldShowLobbies = searchParams?.play === 'true';

    if (shouldShowLobbies) {
      // Render the Lobbies component when play=true is in the URL
      return (
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">{gameData.title}</h1>
          <Lobbies gameId={parseInt(slug)} session={session || null} />
        </div>
      );
    }

    // Render the initial game information with a "Play Now" button if play=true is not set
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{gameData.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{gameData.content}</p>
        <p className="text-gray-500 mb-4">{gameData.description}</p>
        {gameData.image && (
          <div className="flex justify-center mb-4">
            <img
              src={gameData.image}
              alt={gameData.title}
              className="w-full max-w-lg h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        <a
          href={`?play=true`}
          className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play Now
        </a>
      </div>
    );
  } catch (error) {
    // Handle any errors gracefully, such as invalid game ID or database issues
    console.error(error);
    notFound();
  }
};

export default Game;
