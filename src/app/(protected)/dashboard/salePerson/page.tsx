"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import VendorProfileForm from "@/components/edit/Vendor";
import VendorServiceForm from "@/components/edit/Vendorservice";
import CustomerImagesPage from "@/components/edit/Ourclient";
import Navigation from "@/components/pages/Navbar";
import Link from "next/link";
import SalesPersonTable from "@/components/Saleperson";
import VendorDashboard from "@/components/Dashboard1";
import VendorList from "@/components/Saleperson1";

interface PaymentData {
  id: string;
  vendorId: string;
  orderId: string;
  paymentId: string | null;
  amount: string;
  currency: string;
  status: string;
  paymentMethod: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VendorData {
  id: string;
  userId: string;
  companyName: string;
  createdAt: string | null;
  paymentStatus:string;
}

interface ApiResponse {
  success: boolean;
  data: VendorData[];
}

interface PaymentApiResponse {
  success: boolean;
  data: PaymentData[];
}

const Sidebar = ({ onSelect, selected }: { onSelect: (component: string) => void; selected: string }) => {
  const menuItems = ["Dashboard", "Add Vendor"];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg md:hidden hover:bg-primary transition-colors"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-[#161C28] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <Link href="/">
            <img src="/logo.png" className="h-14 mx-auto my-2" alt="Logo" />
          </Link>
          <ul className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => (
              <li
                key={item}
                className={`p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  selected === item ? "bg-primary text-white shadow-lg" : "text-gray-300 hover:bg-primary hover:text-white"
                }`}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const Content = ({ selected, vendorId, vendorData, paymentData }: { 
  selected: string; 
  vendorId: string;
  vendorData: VendorData[];
  paymentData: PaymentData[];
}) => {
  const componentsMap: { [key: string]: JSX.Element } = {
    "Dashboard": <VendorDashboard vendorData={vendorData} paymentData={paymentData} />,
    "Add Vendor": <VendorList/>,
    // "Our Customers": <CustomerImagesPage vendorId={vendorId} />,
  };

  return (
    <div className="flex-1 md:ml-64 h-screen overflow-hidden bg-gray-50">
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-full mx-auto">{componentsMap[selected] || <p>Select a menu item</p>}</div>
      </div>
    </div>
  );
};

export default function Dashboard({ params }: { params: { id: string } }) {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [vendorData, setVendorData] = useState<VendorData[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorResponse = await fetch("/api/vendor");
        const vendorResult: ApiResponse = await vendorResponse.json();

        const paymentResponse = await fetch("/api/vendor/create-payment");
        const paymentResult: PaymentApiResponse = await paymentResponse.json();

        if (vendorResult.success && paymentResult.success) {
          setVendorData(vendorResult.data);
          setPaymentData(paymentResult.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar onSelect={setSelectedComponent} selected={selectedComponent} />
      <Content selected={selectedComponent} vendorId={params.id} vendorData={vendorData} paymentData={paymentData} />
    </div>
  );
}