"use client"

import React, { useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/pages/Navbar';
import Footer from '@/components/shared/Footer';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FoodHeaderBanner from '@/components/shared/Banner';
import Navbar from '@/components/shared/Gennextfooter';
import Loader from '@/components/shared/Loader';
import FoodCarousel from '@/components/shared/Banner';

interface VendorProductDetails {
  id: string;
  price: number;
  currency: string;
  description: string;
  specifications: string[];
  pricingModel: string;
  photo: string[];
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
}

interface VendorProduct {
  product: Product;
  vendorProductDetails: VendorProductDetails;
}

interface VendorDetails {
  id: string;
  companyName: string;
  logo?: string;
  headquartersAddress: string;
  city: string;
  state: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  pincode: string;
  whatsappnumber?: string;
  businessOpeningDays: string[];
}

interface Vendor {
  vendorDetails: VendorDetails;
  products: VendorProduct[];
}

interface VendorResponse {
  success: boolean;
  products: {
    product: Product;
    vendorProductDetails: VendorProductDetails;
    vendor: VendorDetails;
  }[];
}

interface VendorProductCardProps {
  vendor: Vendor;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onButtonClick: (e: MouseEvent<HTMLButtonElement>, type: 'phone' | 'whatsapp') => void;
}

const VendorProductCard: React.FC<VendorProductCardProps> = ({ vendor, onClick, onButtonClick }) => {
  const mainProduct = vendor.products[0];
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative w-full h-64">
        {mainProduct?.vendorProductDetails.photo[0] ? (
          <Image
            src={mainProduct.vendorProductDetails.photo[0]}
            alt={mainProduct.product.name}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img 
              src="/api/placeholder/400/320" 
              alt="placeholder" 
              className="w-24 h-24 opacity-50"
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {mainProduct?.product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          {vendor.vendorDetails.companyName}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          {vendor.vendorDetails.city}, {vendor.vendorDetails.state}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900">
            {mainProduct?.vendorProductDetails.currency} {mainProduct?.vendorProductDetails.price}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {mainProduct?.vendorProductDetails.description || mainProduct?.product.description}
        </p>

        <div className="flex flex-col gap-2">
          <button 
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
            onClick={(e) => onButtonClick(e, 'phone')}
          >
            Show Number
          </button>
          
          {vendor.vendorDetails.whatsappnumber && (
            <button 
              className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
              onClick={(e) => onButtonClick(e, 'whatsapp')}
            >
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface PageProps {
  params: {
    id: string;
  };
}

type SortOrderType = 'none' | 'asc' | 'desc';

export default function VendorProductList({ params }: PageProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<SortOrderType>('none');
  const router = useRouter();
  const carouselData = [
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8901"
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902"
    },
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8902"
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902"
    },
    // Add as many items as you need
  ];

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/vendorproduct?productId=${params.id}`);
        const data: VendorResponse = await response.json();
        if (data.success) {
          const transformedVendors = data.products.reduce<Vendor[]>((acc, item) => {
            const existingVendor = acc.find(v => v.vendorDetails.id === item.vendor.id);
            
            if (existingVendor) {
              existingVendor.products.push({
                product: item.product,
                vendorProductDetails: item.vendorProductDetails
              });
            } else {
              acc.push({
                vendorDetails: item.vendor,
                products: [{
                  product: item.product,
                  vendorProductDetails: item.vendorProductDetails
                }]
              });
            }
            return acc;
          }, []);
          
          setVendors(transformedVendors);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [params.id]);

  const handleSort = () => {
    const newSortOrder: SortOrderType = sortOrder === 'none' ? 'asc' : sortOrder === 'asc' ? 'desc' : 'none';
    setSortOrder(newSortOrder);

    if (newSortOrder === 'none') {
      setVendors([...vendors]);
      return;
    }

    const sortedVendors = [...vendors].sort((a, b) => {
      const priceA = a.products[0]?.vendorProductDetails.price || 0;
      const priceB = b.products[0]?.vendorProductDetails.price || 0;
      
      return newSortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    setVendors(sortedVendors);
  };

  const handleCardClick = (productId: string, event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return;
    }
    router.push(`/product1/${productId}`);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>, type: 'phone' | 'whatsapp') => {
    e.stopPropagation();
    // Handle button click based on type (phone or whatsapp)
  };

  if (loading) {
    return(
      <div><Navigation />
     <FoodCarousel items={carouselData} />
      <div className="flex justify-center items-center min-h-screen"><Loader/></div>
      </div>
    ) 
   
  }

  return (
    <div>
      <Navigation />
      <FoodCarousel items={carouselData} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button 
            className="whitespace-nowrap px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 flex items-center gap-2"
            onClick={handleSort}
          >
            Sort by Price
            {sortOrder === 'asc' && <ChevronUp className="w-4 h-4" />}
            {sortOrder === 'desc' && <ChevronDown className="w-4 h-4" />}
          </button>
          {/* <button 
            className="whitespace-nowrap px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50"
          >
            Ratings
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <VendorProductCard
              key={vendor.vendorDetails.id}
              vendor={vendor}
              onClick={(e) => handleCardClick(vendor.products[0]?.vendorProductDetails.id, e)}
              onButtonClick={handleButtonClick}
            />
          ))}
        </div>
      </div>
      <Navbar/>
    </div>
  );
}