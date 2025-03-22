"use client"
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import VendorProfileForm from "@/components/edit/Vendor";
import VendorServiceForm from "@/components/edit/Vendorservice";
import CustomerImagesPage from "@/components/edit/Ourclient";
import Navigation from "@/components/pages/Navbar";
import Link from "next/link";
import VendorProductsPage from "@/components/edit/Vendorproduct";
import ContactForm from "@/components/edit/Contact";
import ContactInfoPage from "@/components/edit/Contact";

const VendorInfo = ({ vendorId }: { vendorId: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-800">Vendor Information</h1>
    <VendorProfileForm vendorId={vendorId} />
  </div>
);

const ContactInfo = ({ vendorId }: { vendorId: string }) => {
  const [formData, setFormData] = useState({
    primaryContactName: '',
    primaryContactPhone: '',
    whatsappnumber: '',
    primaryContactEmail: '',
    anotherMobileNumbers: [] as string[],
    anotheremails: [] as string[],
    businessOpeningDays: [] as string[],
    businessTiming: {
      start: '09:00',
      end: '17:00'
    }
  });

  const handleContactInfoUpdate = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800">Contact Information</h1>
       <ContactInfoPage vendorId={vendorId} /> 
      
    </div>
  );
};

const Services = ({ vendorId }: { vendorId: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-800">Services</h1>
    <VendorServiceForm vendorId={vendorId}/>
  </div>
);

const Product = ({ vendorId }: { vendorId: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-800">Product</h1>
    <VendorProductsPage vendorId={vendorId}/>
  </div>
);

const OurCustomers = ({ vendorId }: { vendorId: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-800">Our Customers</h1>
    <CustomerImagesPage vendorId={vendorId} />
  </div>
);

const Sidebar = ({ onSelect, selected }: { onSelect: (component: string) => void, selected: string }) => {
  const menuItems = ["Vendor Information", "Contact Information", "Services", "Product", "Our Customers"];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-indigo-500 text-white rounded-lg md:hidden hover:bg-indigo-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 z-40 w-64 h-screen
        bg-gradient-to-br from-slate-800 via-slate-800 to-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <Link href="/">
            <div>
              <img src="/logo.png" className="h-14 mx-auto my-2" alt="Logo" />
            </div>
          </Link>
          <ul className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => (
              <li 
                key={item} 
                className={`
                  p-3 cursor-pointer rounded-lg transition-all duration-200
                  ${selected === item 
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'}
                `}
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

const Content = ({ selected, vendorId }: { selected: string; vendorId: string }) => {
  const componentsMap: { [key: string]: JSX.Element } = {
    "Vendor Information": <VendorInfo vendorId={vendorId} />,
    "Contact Information": <ContactInfo vendorId={vendorId} />,
    "Services": <Services vendorId={vendorId} />,
    "Product": <Product vendorId={vendorId} />,
    "Our Customers": <OurCustomers vendorId={vendorId} />,
    
  };

  return (
    <div className="flex-1 md:ml-64 h-screen overflow-hidden bg-gray-50">
      <div className="h-full overflow-y-auto p-2">
        <div className="mx-auto">
          {componentsMap[selected] || <p>Select a menu item</p>}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ params }: { params: { id: string } }) {
  const [selectedComponent, setSelectedComponent] = useState("Vendor Information");
  const router = useRouter();
  
  useEffect(() => {
    // Fetch vendor data and check payment status
    const checkVendorPayment = async () => {
      try {
        const response = await fetch(`/api/vendor?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        
        const vendorData = await response.json();
        
        
        // Check if payment status is draft and redirect if it is
        if (vendorData.data.paymentStatus === 'draft') {
          router.push(`/vendor/payment/${params.id}`);
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };
    
    checkVendorPayment();
  }, [params.id, router]);

  return (
    <div>
      <Navigation/>
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar onSelect={setSelectedComponent} selected={selectedComponent} />
        <Content selected={selectedComponent} vendorId={params.id} />
      </div>
    </div>
  );
}