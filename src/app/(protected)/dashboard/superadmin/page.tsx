// "use client";

// import { useState, useEffect } from "react";
// import { Menu } from "lucide-react";
// import VendorProfileForm from "@/components/edit/Vendor";
// import VendorServiceForm from "@/components/edit/Vendorservice";
// import CustomerImagesPage from "@/components/edit/Ourclient";
// import Navigation from "@/components/pages/Navbar";
// import Link from "next/link";
// import SalesPersonTable from "@/components/Saleperson";
// import VendorDashboard from "@/components/Dashboard";
// import PlanManagement from "@/components/Plans";

// interface PaymentData {
//   id: string;
//   vendorId: string;
//   orderId: string;
//   paymentId: string | null;
//   amount: string;
//   currency: string;
//   status: string;
//   paymentMethod: string | null;
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface VendorData {
//   id: string;
//   userId: string;
//   companyName: string;
//   createdAt: string | null;
//   paymentStatus:string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: VendorData[];
// }

// interface PaymentApiResponse {
//   success: boolean;
//   data: PaymentData[];
// }

// const Sidebar = ({ onSelect, selected }: { onSelect: (component: string) => void; selected: string }) => {
//   const menuItems = ["Dashboard", "Sales Persons" ,"Plans"];
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-4 left-4 z-50 p-2 bg-indigo-500 text-white rounded-lg md:hidden hover:bg-indigo-600 transition-colors"
//       >
//         <Menu size={24} />
//       </button>

//       <div
//         className={`fixed top-0 left-0 z-40 w-64 h-screen bg-slate-800 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0`}
//       >
//         <div className="h-full flex flex-col">
//           <Link href="/">
//             <img src="/logo.png" className="h-14 mx-auto my-2" alt="Logo" />
//           </Link>
//           <ul className="p-4 space-y-2 flex-1">
//             {menuItems.map((item) => (
//               <li
//                 key={item}
//                 className={`p-3 cursor-pointer rounded-lg transition-all duration-200 ${
//                   selected === item ? "bg-indigo-500 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700 hover:text-white"
//                 }`}
//                 onClick={() => {
//                   onSelect(item);
//                   setIsOpen(false);
//                 }}
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// const Content = ({ selected, vendorId, vendorData, paymentData }: { 
//   selected: string; 
//   vendorId: string;
//   vendorData: VendorData[];
//   paymentData: PaymentData[];
// }) => {
//   const componentsMap: { [key: string]: JSX.Element } = {
//     "Dashboard": <VendorDashboard vendorData={vendorData} paymentData={paymentData} />,
//     "Sales Persons": <SalesPersonTable />,
//     "Plans": <PlanManagement/>,
//   };

//   return (
//     <div className="flex-1 md:ml-64 h-screen overflow-hidden bg-gray-50">
//       <div className="h-full overflow-y-auto p-6">
//         <div className="max-w-full mx-auto">{componentsMap[selected] || <p>Select a menu item</p>}</div>
//       </div>
//     </div>
//   );
// };

// export default function Dashboard({ params }: { params: { id: string } }) {
//   const [selectedComponent, setSelectedComponent] = useState("Dashboard");
//   const [vendorData, setVendorData] = useState<VendorData[]>([]);
//   const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const vendorResponse = await fetch("/api/vendor");
//         const vendorResult: ApiResponse = await vendorResponse.json();

//         const paymentResponse = await fetch("/api/vendor/create-payment");
//         const paymentResult: PaymentApiResponse = await paymentResponse.json();

//         if (vendorResult.success && paymentResult.success) {
//           setVendorData(vendorResult.data);
//           setPaymentData(paymentResult.data);
//         } else {
//           setError("Failed to fetch data");
//         }
//       } catch (err) {
//         setError("Error fetching data");
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full min-h-screen bg-gray-50">
//       <Sidebar onSelect={setSelectedComponent} selected={selectedComponent} />
//       <Content selected={selectedComponent} vendorId={params.id} vendorData={vendorData} paymentData={paymentData} />
//     </div>
//   );
// }




'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentUser } from '@/hooks/auth';
import {
  ChevronLeft,
  ChevronRight,
  File,
  LogOut,
  Menu,
  Settings,
  Users,
  FileText,
  // Templates
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminTemplateCreator from "@/components/admin/Template-creator";
import DealTemplates from "@/components/admin/DisplayTemplate";
import AdvertisementDefinitionPage from "@/components/admin/Adveristment";


export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const user = useCurrentUser();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('templates');

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Enhanced navigation items for sidebar
  const navItems = [
    { id: 'templates', label: 'Templates', icon: <FileText className="h-5 w-5" /> },
    { id: 'Deals', label: 'Deals', icon: <File className="h-5 w-5" /> },
    { id: 'Advertisment', label: 'Advertisment', icon: <Users className="h-5 w-5" /> },
    { id: 'third', label: 'Third', icon: <File className="h-5 w-5" /> },
  ];

  // Render the appropriate component based on sidebar selection
  const renderMainContent = () => {
    switch (activeComponent) {
      case 'templates':
        return <AdminTemplateCreator/>;
      case 'Deals':
        return <DealTemplates/>;
      case 'Advertisment':
        return <AdvertisementDefinitionPage/>;
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
        <div className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}