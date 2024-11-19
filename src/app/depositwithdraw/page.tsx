// pages/depositwithdraw.tsx
import { auth } from "@/lib/auth";
import BalanceChipsSwitcher from "../components/componentsDepositWithdraw/balanceChipsSwitcher";
import CurrencyConverter from "../components/componentsDepositWithdraw/currencyConverter";
import DepositWithdraw from "../components/componentsDepositWithdraw/depositWithdraw";
import Hero from "../components/componentsDepositWithdraw/hero";
import { getBalance } from "../actions/getBalance";
import SliderComponent from "../components/componentsDepositWithdraw/sliderComponent";

// This function fetches the user's balance and chips data
export default async function DepositWithdrawPage() {
  // Get the session information (authentication)
  const session = await auth();

  // Ensure the username (email) is available from the session
  const id = session?.token.id || ''; // Fallback to an empty string if no user name

  // Fetch the user's balance based on the username (email)
  const balance = await getBalance({ id });

  // Return the page components with the fetched data passed as props
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <Hero />
      <SliderComponent balance={balance}/>
    </div>
  );
}
