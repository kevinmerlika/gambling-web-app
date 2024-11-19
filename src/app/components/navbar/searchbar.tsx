'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setGames, setSearchQuery } from '@/store/searchSlice'; // Adjust path as needed
import { useEffect } from 'react';
import { getGames } from '@/app/actions/getGames'; // Function to fetch games based on the query

const SearchBar = () => {
  const dispatch = useDispatch();
  const query = useSelector((state: any) => state.search.query); // Access search query from Redux

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    dispatch(setSearchQuery(newQuery)); // Update search query in Redux
    if (newQuery.trim() === '') {
      dispatch(setGames([])); // Clear search results if the query is empty
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      if (query.trim() !== '') {
        const fetchedGames = await getGames(query);

        // Sanitize the fetched games data
        const sanitizedGames = fetchedGames.map((game) => ({
          ...game,
          createdAt: game.createdAt ? game.createdAt : '', // Replace null or undefined with empty string
          image: game.image ?? '',  // Replace null with empty string or default image URL
          description: game.description ?? '',  // Replace null with empty string if needed
          url: game.url ?? '',  // Replace null with empty string if needed
        }));

        // Dispatch the sanitized games to Redux
        dispatch(setGames(sanitizedGames));
      }
    };

    fetchGames();
  }, [dispatch, query]); // Re-run effect when the search query changes

  return (
    <div className="relative w-1/4 sm:max-w-xs md:max-w-md lg:max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        className="w-full p-2 pl-10 pr-4 rounded-lg bg-white text-gray-800 
         sm:max-w-xs md:max-w-md lg:max-w-lg" // Adjust width for mobile and larger screens
      />
    </div>
  );
};

export default SearchBar;
