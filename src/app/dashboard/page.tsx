import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import TransactionContainer from "../components/dashboardComponents/transactionContainer";
import { Session } from "next-auth"; // Import next-auth types
import { headers } from "next/headers";

// Define the type for the transaction object based on your Prisma model
interface Transaction {
  id: number;
  userId: number;
  transactionId: string;
  total: number;
  currency: string;
  status: string;
  date: Date; // Changed from string to Date
  createdAt: Date; // Changed from string to Date
  updatedAt: Date; // Changed from string to Date
  referenceLink: string;
}

// // Server Action to fetch transactions using Prisma
// async function getTransactions(userId: string): Promise<Transaction[]> {
//   const numericUserId = Number(userId); // Cast userId to a number

//   if (isNaN(numericUserId)) {
//     throw new Error("Invalid user ID.");
//   }

//   return await prisma.transaction.findMany({
//     where: {
//       userId: numericUserId, // Use the casted userId (number)
//     },
//     orderBy: {
//       createdAt: 'desc', // Order transactions by creation date (descending)
//     },
//   });
// }

// Server-side function to fetch transactions from the API using fetch
async function fetchTransactions(userId: string, headers: any): Promise<Transaction[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/transactions?userId=${userId}`, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
}

export default async function Dashboard() {
  // Get the current session, typed as Session from next-auth
  const session: Session | null = await getServerSession(authOptions);

  const headersList = await headers()

  console.log(headersList);
  

  // Log session to check its structure
  console.log("session: ", session);

  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated.");
  }

  const userId = session.user.id; // Get the user ID from session

  // Fetch transactions from Prisma
  const transactions = await fetchTransactions(userId, headersList);

  console.log("Fetched Transactions:", transactions);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 mt-14">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Transactions Dashboard
          </h1>
        </div>

        {/* Subheading */}
        <div className="mb-10">
          <p className="text-lg text-gray-300">
            Manage, track, and review all your transactions in one secure and organized place.
            Stay on top of your finances with our easy-to-use interface.
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="flex space-x-6 mb-12">
          <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-400 transition duration-200">
            Add New Transaction
          </button>
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-200">
            Generate Report
          </button>
        </div>

        {/* Overview Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">Transaction Overview</h2>
          <p className="text-gray-300 text-lg">
            Get a quick snapshot of your recent transactions and spending patterns. View your transaction history and make informed decisions.
          </p>
        </div>

        {/* Transaction Container (Server Component) */}
        <div className="bg-gray-800 p-6 rounded-lg">
          {/* Pass the fetched transactions to the TransactionContainer component */}
          <TransactionContainer transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
