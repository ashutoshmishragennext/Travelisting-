"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/pages/Navbar';

import { ChevronUp, ChevronDown, Mail, Search, Info } from 'lucide-react';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import FoodHeaderBanner from '@/components/shared/Banner';
import Loader from '@/components/shared/Loader';
import Navbar from '@/components/shared/Gennextfooter';
import FoodCarousel from '@/components/shared/Banner';

interface VendorServiceDetails {
  id: string;
  price: number;
  currency: string;
  description: string;
  experienceYears: number | null;
  pricingModel: string;
  photo: string[];
  location: string;
  modeOfService: string | null;
  rating?: number; // Added rating field
}

interface Service {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
  subcategory?: string; // Added subcategory field
}

interface VendorService {
  service: Service;
  vendorServiceDetails: VendorServiceDetails;
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
  isVerified?: boolean; // Added verification status
}

interface Vendor {
  vendorDetails: VendorDetails;
  services: VendorService[];
}

interface VendorResponse {
  success: boolean;
  vendors: Vendor[];
}

export default function VendorList({ params }: { params: { id: string } }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const router = useRouter();
  
  // Filter states
  const [ratingFilter, setRatingFilter] = useState<string>('Any');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [cityOrZipFilter, setCityOrZipFilter] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean>(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  
  // Predefined subcategories
  const subcategories = [
    "Internet & Software", 
    "Audio & Visual"
  ];

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
  ];
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/vendorservice?serviceId=${params.id}`);
        const data: VendorResponse = await response.json();
        if (data.success) {
          // Assuming vendors might have rating and verified status when API is updated
          // For now, we'll add mock data for demonstration
          const vendorsWithMockData = data.vendors.map(vendor => ({
            ...vendor,
            vendorDetails: {
              ...vendor.vendorDetails,
              isVerified: Math.random() > 0.5, // Random verified status
            },
            services: vendor.services.map(service => ({
              ...service,
              vendorServiceDetails: {
                ...service.vendorServiceDetails,
                rating: Math.floor(Math.random() * 2) + 3, // Random rating between 3-5
              },
              service: {
                ...service.service,
                subcategory: subcategories[Math.floor(Math.random() * subcategories.length)], // Random subcategory
              }
            }))
          }));
          
          setVendors(vendorsWithMockData);
          setFilteredVendors(vendorsWithMockData);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [params.id]);

  // Apply filters whenever filter states change
  useEffect(() => {
    let results = [...vendors];
    
    // Apply rating filter
    if (ratingFilter !== 'Any') {
      const minRating = parseFloat(ratingFilter.replace('+', ''));
      results = results.filter(vendor => 
        vendor.services.some(service => 
          (service.vendorServiceDetails.rating || 0) >= minRating
        )
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      results = results.filter(vendor => 
        vendor.vendorDetails.headquartersAddress.toLowerCase().includes(locationFilter.toLowerCase()) ||
        vendor.vendorDetails.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        vendor.vendorDetails.state.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Apply city or ZIP filter
    if (cityOrZipFilter) {
      results = results.filter(vendor => 
        vendor.vendorDetails.city.toLowerCase().includes(cityOrZipFilter.toLowerCase()) ||
        vendor.vendorDetails.pincode.includes(cityOrZipFilter)
      );
    }
    
    // Apply verified filter
    if (verifiedFilter) {
      results = results.filter(vendor => 
        vendor.vendorDetails.isVerified
      );
    }
    
    // Apply subcategory filter
    if (selectedSubcategories.length > 0) {
      results = results.filter(vendor => 
        vendor.services.some(service => 
          service.service.subcategory && 
          selectedSubcategories.includes(service.service.subcategory)
        )
      );
    }
    
    // Apply sorting
    if (sortOrder !== 'none') {
      results.sort((a, b) => {
        const priceA = a.services[0]?.vendorServiceDetails.price || 0;
        const priceB = b.services[0]?.vendorServiceDetails.price || 0;
        
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
    
    setFilteredVendors(results);
  }, [vendors, ratingFilter, locationFilter, cityOrZipFilter, verifiedFilter, selectedSubcategories, sortOrder]);

  const handleSort = () => {
    const newSortOrder = sortOrder === 'none' ? 'asc' : sortOrder === 'asc' ? 'desc' : 'none';
    setSortOrder(newSortOrder);
  };

  const handleCardClick = (serviceId: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return;
    }
    router.push(`/product/${serviceId}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleRatingSelect = (rating: string) => {
    setRatingFilter(rating);
  };
  
  const handleSubcategoryToggle = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(item => item !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };
  
  const toggleVerifiedFilter = () => {
    setVerifiedFilter(!verifiedFilter);
  };

  if (loading) {
    return (
      <div>  
        <Navigation />
        <FoodCarousel items={carouselData} />
        <div className="flex my-4 justify-center items-center min-h-screen"><Loader/></div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <FoodCarousel items={carouselData} />
      <div className="max-w-7xl sticky top-0 mb-8  mx-[5%] p-2 md:p-4">
        <div className="flex flex-col  md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4  bg-white rounded-3xl shadow-md p-4">
            <div className="space-y-6">
              {/* Rating Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Filter by rating</h3>
                <div className="flex flex-wrap gap-2">
                  {['Any', '3+', '4+', '4.5+'].map((rating) => (
                    <button
                      key={rating}
                      className={`px-4 py-2 rounded-full shadow-lg border ${
                        ratingFilter === rating 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}
                      onClick={() => handleRatingSelect(rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Location Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Location"
                      className="w-full px-4 py-2 border shadow-md border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by City or ZIP Code"
                      className="w-full px-4 py-2 border border-gray-300 shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={cityOrZipFilter}
                      onChange={(e) => setCityOrZipFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Company Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Company Status</h3>
                <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
                  <div className="flex items-center gap-2">
                    <span>Verified</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    className={`w-6 h-6 rounded shadow-sm ${verifiedFilter ? 'bg-green-500' : 'border border-gray-300'} flex items-center justify-center`}
                    onClick={toggleVerifiedFilter}
                  >
                    {verifiedFilter && <span className="text-white text-xs">✓</span>}
                  </button>
                </div>
              </div>
              
              {/* Subcategories */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Browse Subcategories</h3>
                <div className="space-y-2">
                  {subcategories.map(category => (
                    <button
                      key={category}
                      className={`px-4 py-2 shadow-md rounded-full border w-full text-left ${
                        selectedSubcategories.includes(category)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}
                      onClick={() => handleSubcategoryToggle(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Button */}
            <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2">
              <button 
                className="whitespace-nowrap px-3 md:px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 flex items-center gap-2 text-sm md:text-base"
                onClick={() => handleSort()}
              >
                Sort by Price
                {sortOrder === 'asc' && <ChevronUp className="w-4 h-4" />}
                {sortOrder === 'desc' && <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Vendor Listings */}
            <div className="space-y-4 md:space-y-6">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <div 
                    key={vendor.vendorDetails.id} 
                    className="bg-white rounded-lg shadow-md p-3 md:p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={(e) => handleCardClick(vendor.services[0]?.vendorServiceDetails.id, e)}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Vendor Logo/Image */}
                      <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-gray-100">
                        {vendor.vendorDetails.logo ? (
                          <Image
                            src={vendor.vendorDetails.logo}
                            alt={vendor.vendorDetails.companyName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Vendor Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg md:text-xl font-semibold">{vendor.vendorDetails.companyName}</h2>
                            {vendor.vendorDetails.isVerified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                              ★ {vendor.services[0]?.vendorServiceDetails.rating?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mt-2 text-sm md:text-base">{vendor.vendorDetails.headquartersAddress}</p>
                        <p className="text-gray-600 text-sm md:text-base">{vendor.vendorDetails.city}, {vendor.vendorDetails.state}</p>

                        <div className="mt-3 md:mt-4 justify-between flex space-y-2">
                          {vendor.services.map((service) => (
                            <div key={service.vendorServiceDetails.id} className="text-sm text-gray-700">
                              <span className="font-medium">{service.service.name}</span>
                              {service.service.subcategory && (
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                  {service.service.subcategory}
                                </span>
                              )}
                              <p className="text-gray-600 text-sm">{service.vendorServiceDetails.description}</p>
                            </div>
                          ))}
                          
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                            {vendor.services[0]?.vendorServiceDetails.price} {vendor.services[0]?.vendorServiceDetails.currency}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col md:flex-row gap-2 md:gap-4">
                          <a 
                            href={`tel:${vendor.vendorDetails.primaryContactPhone}`} 
                            className=" text-blue-600 flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
                          >
                            <FaPhoneAlt />
                            <span className="whitespace-nowrap">{vendor.vendorDetails.primaryContactPhone}</span>
                          </a>
                          <a 
                            href={`https://wa.me/${vendor.vendorDetails.whatsappnumber}`} 
                            className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
                          >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                          </a>
                          <a 
                            href={`mailto:${vendor.vendorDetails.primaryContactEmail}`} 
                            className=" text-black flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
                          >
                            <Mail/>
                            <span>{vendor.vendorDetails.primaryContactEmail}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">No vendors match your filter criteria. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Navbar/>
    </div>
  );
}