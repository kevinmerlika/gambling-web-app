import { FaHome, FaUser, FaCog, FaDatabase, FaSignOutAlt, FaMoneyCheck, FaGift, FaGamepad } from 'react-icons/fa'; // Importing icons
import SidebarItem from './SideBarItems';
import { signOut } from 'next-auth/react';
import SignOut from './buttons/logoutButton';
import SidebarItemExclusive from './SideBarItemExclusive';
import { usePathname } from 'next/navigation'; // Import useRouter from Next.js
import { FaMoneyBillTransfer } from "react-icons/fa6";


type SidebarNavProps = {
  isOpen: boolean;
  handleNavigation: (e: React.MouseEvent, path: string) => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen, handleNavigation }) => {
    const currentRoute = usePathname(); // Get the current route using usePathname hook

    // Function to check if the current route matches or starts with the item path
    const isActive = (path: string) => {
      if (!currentRoute) return false; // Return false if no route is found
  
      // Check if the current route matches the path or if the path is a prefix of the current route
      return currentRoute === path || currentRoute.startsWith(path + '/');
    };

    const handleSignOut = async () => {
      await signOut({ callbackUrl: 'http://192.168.100.40:3000' }); // Ensure no trailing slash if needed
    };

  return (
    <nav className="p-4 space-y-4">
      <ul>
        <SidebarItem
          icon={<FaHome className="mr-3 text-2xl" />}
          label="Home"
          path="/"
          isOpen={isOpen}
          isActive={isActive('/')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItem
          icon={<FaGamepad className="mr-3 text-2xl" />}
          label="Games"
          path="/games"
          isOpen={isOpen}
          isActive={isActive('/games')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItem
          icon={<FaUser className="mr-3 text-2xl" />}
          label="Profile"
          path="/profile"
          isOpen={isOpen}
          isActive={isActive('/profile')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItem
          icon={<FaCog className="mr-3 text-2xl" />}
          label="Settings"
          path="/settings"
          isOpen={isOpen}
          isActive={isActive('/settings')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItem
          icon={<FaDatabase className="mr-3 text-2xl" />}
          label="Dashboard"
          path="/dashboard"
          isOpen={isOpen}
          isActive={isActive('/dashboard')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItem
          icon={<FaMoneyBillTransfer
          className="mr-3 text-2xl" />}
          label="Deposit/Withdraw"
          path="/depositwithdraw"
          isOpen={isOpen}
          isActive={isActive('/depositwithdraw')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SidebarItemExclusive
          icon={<FaGift className="mr-3 text-2xl" />}
          label="Loyalty"
          path="/loyalty"
          isOpen={isOpen}
          isActive={isActive('/loyalty')} // Pass active state
          handleNavigation={handleNavigation}
        />
        <SignOut
          label="Logout"
          icon={<FaSignOutAlt />}
          isOpen={isOpen}
          handleSignOut={handleSignOut}
        />
      </ul>
    </nav>
  );
};

export default SidebarNav;
