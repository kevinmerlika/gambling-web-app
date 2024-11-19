import { error } from "console";
import GamesList from "../components/gamesList/gameList";

const fetchGames = async () => {
  const res = await fetch(`http://localhost:3000/api/games`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Optional: disable caching for fresh data
    credentials: "include"
  });

  if (!res.ok) {
    console.log(error);
    
    throw new Error('Failed to fetch games');
  }

  return res.json();
};

export default async function Games() {
    try {
      const games = await fetchGames();
      console.log(games);
  
      return (
        <div className="flex flex-col sm:flex-row mt-10"> {/* Stack vertically on small screens */}
          {/* Left margin for larger screens */}
          <div className="sm:w-1/8 sm:block lg:hidden md:hidden"></div> {/* Hidden on small screens */}
          
          {/* Content container */}
          <div className="w-full sm:w-4/5 md:w-4/5 lg:w-full container mx-auto px-4">
            <GamesList games={games} />
            <GamesList games={games} />

          </div>
          
          
        </div>
      );
    } catch (error) {
      return (
        <div className="container mx-auto px-4 text-center mt-8">
          <p className="text-red-500">Error loading games.</p>
        </div>
      );
    }
  }
  