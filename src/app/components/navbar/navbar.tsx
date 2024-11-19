import { Suspense } from 'react';
import Balance from './balance';
import SearchBar from './searchbar';
import { getBalance } from '@/app/actions/getBalance';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { convertUserIdToNumber } from '@/lib/utils';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const Navbar = async ({ ids }: { ids: any }) => {

  console.log(ids);
  
  // Convert the user ID safely to a number
  const convertUserIdToNumber = (id: string | undefined): number => {
    if (!ids) return 0; // Fallback to 0 if ID is undefined
    const parsedId = parseInt(ids, 10);
    return isNaN(parsedId) ? 0 : parsedId; // Fallback to 0 if parsing fails
  };

  // Extract the ID from session and convert it
  const id = convertUserIdToNumber(ids);

  // Handle cases where the user ID is invalid
  if (!id) {
    console.warn("User ID is not valid, defaulting to 0");
    return <nav>User not authenticated</nav>; // Fallback UI
  }

  // Fetch the user's balance
  const balance = await getBalance({ id });

  return (
    <nav className="fixed w-full bg-gray-800 p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Website Name */}
        <div className="text-white text-xs font-semibold sm:text-xl">
          Casino Int.
        </div>

        {/* Search Bar (Client Component) */}
        <Suspense fallback={<div>Loading...</div>}>
          <SearchBar />
        </Suspense>

        {/* Balance (Client Component) */}
        
          <Balance id={id.toString()} balance={balance.balance} chips={balance.chips} />
        
      </div>
    </nav>
  );
};

export default Navbar;
