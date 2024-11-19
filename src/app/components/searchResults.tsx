'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setGames, setSearchQuery } from '@/store/searchSlice';

const SearchResults = () => {
  const { games, query } = useSelector((state: any) => state.search); // Access both games and query from Redux
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGameClick = (id: number) => {
    dispatch(setGames([])); // Clear search results if the query is empty
    dispatch(setSearchQuery('')); // Update search query in Redux
    router.push(`/games/${id}`); // Navigate to game page based on game ID
    router.refresh();
  };

  if (!query) {
    return null; // If the search query is empty, don't display results
  }

  return (
    <div
      className={`fixed inset-x-0 top-16 mx-auto z-50 bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full transition-opacity duration-300 ${
        games.length > 0 ? 'opacity-100' : 'opacity-0 hidden'
      }`}
    >
      <h3 className="text-2xl font-semibold text-white mb-4 text-center md:text-3xl sm:text-xl">Search Results</h3>
      <ul className="space-y-4">
        {games.map((game: any, index: any) => (
          <li
            key={index}
            onClick={() => handleGameClick(game.id)}
            className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition duration-200"
          >
            {/* Display game image */}
            <img
              src={game.image}
              alt={game.title}
              className="w-16 h-16 object-cover rounded-md border border-gray-600"
            />
            {/* Display game title and other details */}
            <div>
              <h4 className="font-semibold text-lg text-white sm:text-base md:text-xl">{game.title}</h4>
              <p className="text-sm text-gray-400 sm:text-xs md:text-sm">Released on: {new Date(game.createdAt).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
