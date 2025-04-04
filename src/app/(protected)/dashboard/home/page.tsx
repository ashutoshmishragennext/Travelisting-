'use client';

import Deals from "@/components/home/Deals";
// import Profile from "@/components/home/Profile";
import { useCurrentUser } from '@/hooks/auth';
import {
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  User
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



import HotelChain from "@/components/home/HotelChain";
import Profile from "@/components/home/Profile";
import Advertisement from "@/components/home/Advertisement";
import AddAdvertisementForm from "@/components/home/Addetail";

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const user = useCurrentUser();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('profile');
  if (status === 'unauthenticated') {
    router.push('/auth/login');  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Enhanced navigation items for sidebar
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <FileText className="h-5 w-5" /> },
    { id: 'hotel', label: 'Bussiness', icon: <FileText className="h-5 w-5" /> },
    { id: 'deals', label: 'Deals', icon: <File className="h-5 w-5" /> },
    { id: 'advertisement', label: 'Advertisement', icon: <User className="h-5 w-5" /> },

    // { id: 'second', label: 'Second', icon: <Users className="h-5 w-5" /> },
    // { id: 'third', label: 'Third', icon: <File className="h-5 w-5" /> },
  ];

  // Render the appropriate component based on sidebar selection
  const renderMainContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile/>;
      case 'hotel':
        return <HotelChain/>;
      case 'deals':
          return <Deals/>;
      case 'advertisement':
        return <Advertisement/>;
      case 'third':
        return <p>Third</p>;
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
      {/* <nav className="bg-white shadow-sm border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Admin Template Creation Portal</h1>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
        </div>
      </nav> */}

      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r transition-all duration-300 ease-in-out h-[calc(100vh-64px)] flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-end p-2 ">
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
                        ? 'bg-gray-100 text-blue-600 font-medium'
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

        {/* Main content */}
        <div className="flex-1 lg:p-2 p-2 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}