"use client"
import React, { useEffect, useState } from 'react';
import { FaStar, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { MdVerified, MdLocationOn, MdShare } from 'react-icons/md';
import ReviewsAndRatings from '@/components/Rating';
import Navigation from '@/components/pages/Navbar';
import VendorImageGallery from '@/components/vendorpage/ImageGallery';
import Footer from '@/components/shared/Footer';
import Loader from '@/components/shared/Loader';
import BrandGrid from '@/components/product/Logo';
import ContactCard from '@/components/product/User';
import Navbar from '@/components/shared/Gennextfooter';

// Parameter interface for the component
interface Params {
  id: string;
}

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
}

// Vendor Product Details interface
interface VendorProductDetails {
  id: string;
  experienceYears: number;
  pricingModel: string;
  photo: string[];
  description: string;
  specifications: string;
  stock: number | null;
  price: number;
  currency: string;
  isActive: boolean;
}

// Vendor interface
interface Vendor {
  id: string;
  companyName: string;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
  headquartersAddress: string | null;
  pincode: string | null;
  whatsappnumber: string | null;
  businessOpeningDays: string[] | null;
  state: string | null;
  city: string | null;
  logo: string | null;
}

// Main API Response interface
interface VendorProductResponse {
  success: boolean;
  vendorProduct: {
    product: Product;
    vendorProductDetails: VendorProductDetails;
    vendor: Vendor;
  };
}

// Other Products Response interface
interface VendorProductsResponse {
  success: boolean;
  vendorProducts: Array<{
    product: Product;
    vendorProductDetails: VendorProductDetails;
  }>;
}

// Component Props interface
interface ProductDetailsProps {
  params: Params;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ params }) => {
  // State management
  const [productData, setProductData] = useState<VendorProductResponse | null>(null);
  const [otherProducts, setOtherProducts] = useState<Array<{
    product: Product;
    vendorProductDetails: VendorProductDetails;
  }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to format business days
  const formatOpeningDays = (days: string[] | null): string => {
    return days ? days.join(', ') : 'Not specified';
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current product details
        const response = await fetch(`/api/vendorproduct?vendorProductId=${params.id}`);
        const data: VendorProductResponse = await response.json();
        
        if (data.success) {
          setProductData(data);
          
          try {
            // Fetch other products by the same vendor
            const vendorId = data.vendorProduct.vendor.id;
            const otherProductsResponse = await fetch(`/api/vendor?id=${vendorId}`);
            const otherProductsData: VendorProductsResponse = await otherProductsResponse.json();
            
            if (otherProductsData.success && Array.isArray(otherProductsData.vendorProducts)) {
              setOtherProducts(
                otherProductsData.vendorProducts
                  .filter(item => item.vendorProductDetails.id !== params.id)
                  .slice(0, 4)
              );
            }
          } catch (otherProductsError) {
            console.error('Error fetching other products:', otherProductsError);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Loading state
  if (loading) return (
    <div>
      <Navigation/>
      <Loader />
    </div>
  );

  // Error state
  if (error) return (
    <div>
      <Navigation/>
      <div className="p-4 text-red-600">Error: {error.message}</div>
    </div>
  );

  // No data state
  if (!productData) return null;

  const { product, vendorProductDetails, vendor } = productData.vendorProduct;
  const brands: any[] = [];

  return (
    <div>
      <Navigation />
      <div className="mx-auto px-4 py-6 bg-gray-50 rounded-lg">
        {/* Company Information Card */}
        <div className="bg-white border rounded-lg mb-6 shadow-sm p-4 mx-auto transition-transform transform hover:scale-100 duration-300 ease-in-out">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold">{vendor.companyName || 'Company Name Not Specified'}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span className="flex items-center bg-green-500 text-white px-2 py-1 rounded-md font-semibold">
                  4.2 ★
                </span>
                <span>813 Ratings</span>
              </div>
            </div>
          </div>

          {/* Company Location and Experience */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <div className="flex items-center space-x-2 text-gray-500">
              <MdLocationOn />
              <span>
                {`${vendor.headquartersAddress || 'Address not specified'}, 
                ${vendor.city || ''} 
                ${vendor.pincode ? `(${vendor.pincode})` : ''}`}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              <span className="font-medium text-green-600">
                {vendorProductDetails.experienceYears} Years in Business
              </span>
            </div>
          </div>

          {/* Contact Buttons and Business Hours */}
          <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
            <div className='flex flex-wrap space-x-2'>
              {vendor.primaryContactPhone && (
                <a 
                  href={`tel:${vendor.primaryContactPhone}`} 
                  className="bg-green-500 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
                >
                  <FaPhoneAlt />
                  <span className="whitespace-nowrap">{vendor.primaryContactPhone}</span>
                </a>
              )}
              {vendor.whatsappnumber && (
                <a 
                  href={`https://wa.me/${vendor.whatsappnumber}`} 
                  className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
                >
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
            {vendor.businessOpeningDays && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
                <span className="font-medium">Open:</span>
                <span>{formatOpeningDays(vendor.businessOpeningDays)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Content */}
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full pt-8 md:w-2/3">
            {/* Product Images */}
            <div>
              <div className="flex space-x-4 pt-4">
                <VendorImageGallery
                  images={vendorProductDetails.photo || []} 
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-6 mr-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {`${vendorProductDetails.currency} ${vendorProductDetails.price}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.categoryName}</span>
                </div>
                {vendorProductDetails.description && (
                  <div className="pt-2">
                    <span className="text-gray-600">Description:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">
                      {vendorProductDetails.description}
                    </p>
                  </div>
                )}
                {vendorProductDetails.specifications && (
                  <div className="pt-2">
                    <span className="text-gray-600">Specifications:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">
                      {vendorProductDetails.specifications}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Other Products Section */}
            {otherProducts.length > 0 && (
              <div className="mt-6 mr-4 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Other Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherProducts.map((item) => (
                    <div 
                      key={item.vendorProductDetails.id} 
                      className="border p-4 rounded-md hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.vendorProductDetails.description}
                      </p>
                      <p className="text-green-600 font-medium mt-2">
                        {`${item.vendorProductDetails.currency} ${item.vendorProductDetails.price}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brands Grid */}
        <div className="p-4 bg-gray-50">
          <BrandGrid brands={brands} />
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <ReviewsAndRatings />
        </div>
      </div>

      {/* Footer */}
      <div className='mt-10'>
        <Navbar/>
      </div>
    </div>
  );
};

export default ProductDetails;