'use client';

import Deals from "@/components/home/Deals";
import { useCurrentUser } from '@/hooks/auth';
import {
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Search,
  User
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import HotelChain from "@/components/home/HotelChain";
import Profile from "@/components/home/Profile";
import Advertisement from "@/components/home/Advertisement";
import AddAdvertisementForm from "@/components/home/Addetail";
import { FaAd, FaAdversal, FaIdeal, FaMoneyBill } from "react-icons/fa";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { RiAdvertisementLine } from "react-icons/ri";
import { LuPackageSearch } from "react-icons/lu";
import TravelDealSearch from "@/app/search/page";

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const user = useCurrentUser();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('search');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the 'sm' breakpoint in Tailwind
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}, [activeComponent]);

  if (status === 'unauthenticated') {
    router.push('/auth/login');
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items for sidebar and mobile navbar
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" /> },
    { id: 'deals', label: 'Deals', icon: <LuPackageSearch className="h-5 w-5" /> },
    { id: 'advertisement', label: 'Advertisement', icon: <RiAdvertisementLine className="h-5 w-5" /> },
  ];


  // Render the appropriate component based on selection
  const renderMainContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile/>;
      case 'search':
        return <TravelDealSearch/>;
      case 'deals':
        return <Deals/>;
      case 'advertisement':
        return <Advertisement/>;
      default:
        return (
          <div className="text-center p-8 text-gray-500">
            Select an option from the sidebar
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        {!isMobile && (
          <div 
            className={`${
              sidebarOpen ? 'w-64' : 'w-20'
            } bg-white border-r transition-all duration-300 ease-in-out h-screen hidden sm:flex flex-col justify-between`}
          >
            <div>
              <div className="flex justify-end p-2">
                <button 
                  onClick={toggleSidebar} 
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
              <ul className="space-y-2 px-3 py-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveComponent(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeComponent === item.id
                          ? 'bg-gray-100 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      {sidebarOpen && <span>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main content area - Take full width on mobile */}
        <div className="flex-1 p-2 lg:p-6 overflow-auto pb-20 sm:pb-0">
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar - Only visible on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${
                activeComponent === item.id
                  ? 'text-primary'
                  : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}