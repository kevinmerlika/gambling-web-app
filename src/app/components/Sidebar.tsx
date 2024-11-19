'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store'; // Import RootState and AppDispatch from the store
import { closeDrawer, openDrawer } from '@/store/drawerSlice'; // Import your actions
import { useRouter } from 'next/navigation'; // Import Next.js router
import SidebarHeader from './SidebarHeader'; // Import the SidebarHeader component
import SidebarNav from './SideBarNav';

const Sidebar = () => {
  const isOpen = useSelector((state: RootState) => state.drawer.isOpen); // Access drawer state
  const dispatch = useDispatch<AppDispatch>(); // Get dispatch function typed with AppDispatch
  const router = useRouter(); // Next.js router

  // Handle toggle for mobile and desktop
  const handleToggle = () => {
    dispatch(isOpen ? closeDrawer() : openDrawer()); // Toggle open/close
  };

  // Close sidebar on route change, but only for mobile views (optional)
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault(); // Prevent default behavior of anchor tags
    router.push(path); // Navigate to the target path
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all ease-in-out duration-300 z-50 
        ${isOpen ? 'w-64' : 'w-24'} // For mobile and smaller devices
        md:${isOpen ? 'w-48' : 'w-24'} // Always fully expanded on desktop
        sm:hidden md:block`} // Hide sidebar on small screens (sm) and show on medium screens (md)
    >
      <SidebarHeader isOpen={isOpen} handleToggle={handleToggle} />
      <SidebarNav isOpen={isOpen} handleNavigation={handleNavigation} />
    </div>
  );
};

export default Sidebar;
