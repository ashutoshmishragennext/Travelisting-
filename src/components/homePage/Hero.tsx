'use client';

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  logo: string;
}

export default function ClientHero() {
  const router = useRouter();
  return <HeroContent onNavigate={(type, id) => router.push(`/${type}Categories/${id}`)} />;
}

function HeroContent({ 
  onNavigate 
}: { 
  onNavigate: (type: string, id: string) => void 
}) {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [services, setServices] = useState<Category[]>([]);
  const [products, setProducts] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await fetch(`/api/serviceCategory`);
        const servicesResult = await servicesResponse.json();
        setServices(servicesResult);
        
        const productsResponse = await fetch(`/api/productCategory`);
        const productsResult = await productsResponse.json();
        setProducts(productsResult);
        
        setFilteredItems(activeTab === 'services' ? servicesResult : productsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentItems = activeTab === 'services' ? services : products;
    const filtered = currentItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, services, products, activeTab]);

  const handleTabChange = (tab: 'services' | 'products') => {
    setActiveTab(tab);
    setSearchTerm("");
    setFilteredItems(tab === 'services' ? services : products);
  };

  return (
    <div className="w-full px-4 py-6">
        
      <div className="flex sm:flex-row gap-2 sm:gap-4 mb-4">
        <div className="flex bg-gray-100 rounded-full justify-center shrink-0">
          <button
            onClick={() => handleTabChange('services')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleTabChange('products')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Products
          </button>
        </div>
        <div className=" relative w-[40%] ">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-1.5 sm:py-2 pl-10 pr-4 text-sm sm:text-base text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
  {filteredItems.map((item, index) => (
    <div
      key={index}
      className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onNavigate(activeTab, item.id)}
    >
      <div className="bg-white rounded-xl p-2 sm:p-1 md:p-1 shadow-sm mb-2 w-24 h-24 sm:w-24 sm:h-24 md:w-32 md:h-32 flex items-center justify-center hover:shadow-md transition-shadow">
        {item.logo && (
          <Image
            src={item.logo}
            alt={item.name}
            width={75}
            height={75}
            className="object-contain w-24 h-24 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-36 lg:h-36"
          />
        )}
      </div>
      <span className="text-xs sm:text-sm text-center font-medium">
        {item.name}
      </span>
    </div>
  ))}
</div>


      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No {activeTab} found matching your search.
        </div>
      )}
    </div>
  );
}