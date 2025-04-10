"use client"
import { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import PopupAd from '@/components/advertisements/adshow/Popup';
import BannerAd from '@/components/advertisements/adshow/Banner';
import Navbar from '@/components/shared/Gennextfooter';
import StickyFeaturedDeal from '@/components/advertisements/adshow/FeaturedDeal';

// TypeScript interfaces
interface DealMetadata {
  amenities?: string;
  roomTypes?: string;
  starRating?: string;
  propertyName?: string;
}

interface DealData {
  id: string;
  title: string;
  travelType: string;
  travelAgentId: string;
  propertyId: string | null;
  description: string;
  price: number | null;
  discount: number | null;
  images: string;
  contactPhones: string[];
  contactEmails: string[];
  dealTypeDefinitionId: string;
  metadata: DealMetadata;
  flightDetails: any | null;
  hotelDetails: any | null;
  formattedContent: any | null;
  country: string;
  state: string;
  city: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  isPromoted: boolean;
  advertisements: any | null;
  createdAt: string;
  updatedAt: string;
}




const DealDetails: React.FC = () => {
  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchDealDetails = async (): Promise<void> => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/deals?DealId=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch deal data');
        }
        const data: any = await response.json();
        setDeal(data[0]);
      } catch (error) {
        console.error('Error fetching deal details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealDetails();
    
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    
    return () => clearTimeout(popupTimer);
  }, [id]);

  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-medium text-gray-700">Loading deal details...</div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-medium text-red-600">Deal not found</div>
        </div>
      </div>
    );
  }

  const {
    title,
    travelType,
    description,
    price,
    discount,
    images,
    contactPhones,
    contactEmails,
    metadata,
    country,
    state,
    city,
    validFrom,
    validTo
  } = deal;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const displayLocation = (): string => {
    const locations = [city, state, country].filter(Boolean);
    return locations.length ? locations.join(', ') : metadata?.amenities || 'Location not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <BannerAd />

      <StickyFeaturedDeal />

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Deal Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-3/5 relative">
              <div className="relative h-64 md:h-80 my-4 cursor-pointer" onClick={toggleImageModal}>
                {images ? (
                  <Image 
                    src={images} 
                    alt={title || metadata?.propertyName || 'Travel deal'} 
                    layout="fill"
                    objectFit="fit"
                    className=' w-[80%]'                    
                    priority
                    fill
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                {/* Add a subtle visual indicator for clickability */}
                <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                    <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Contact & Details Section - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block md:w-2/5 p-6">
              <div className="space-y-6">
                {/* Date information */}
                <div className="space-y-2">
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">VALID UNTIL</h3>
                    <p className="text-base font-medium text-gray-900">{formatDate(validTo)}</p>
                  </div>
                  <div className="mt-4">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                      {travelType}
                    </div>
                  </div>
                </div>
                
                {/* Contact information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                  
                  {contactPhones && contactPhones.length > 0 && (
                    <div className="mb-4">
                      {/* <h4 className="text-sm font-medium text-gray-500 mb-2">PHONE</h4> */}
                      {contactPhones.map((phone, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {contactEmails && contactEmails.length > 0 && (
                    <div>
                      {/* <h4 className="text-sm font-medium text-gray-500 mb-2">EMAIL</h4> */}
                      {contactEmails.map((email, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                        </div>
                      ))}
                    </div>
                  )}

                  {[city, state, country].filter(Boolean).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">LOCATION</h4>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{displayLocation()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile-only contact section */}
          <div className=" px-6 pb-6 md:hidden">
          {contactPhones && contactPhones.length > 0 && (
                    <div className=" fixed right-0  ">
                      {contactPhones.map((phone, index) => (
                        <div key={index} className="flex bg-gray-200 items-center mb-2 rotate-90 p-2 rounded-l-lg">
                          <a href={`tel:${phone}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {contactEmails && contactEmails.length > 0 && (
                    <div className=' fixed right-0 mt-12 '>
                      {contactEmails.map((email, index) => (
                        <div key={index} className=" bg-gray-200  flex items-center mb-2 rotate-90  p-2 rounded-r-lg">
                          <a href={`mailto:${email}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          </a>
                          {/* <a href={`mailto:${email}`} className="text-blue-600 hover:underline">Email</a> */}
                        </div>
                      ))}
                    </div>
                  )}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between">
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VALID UNTIL</h3>
                  <p className="text-base font-medium text-gray-900">{formatDate(validTo)}</p>
                  
                </div>
                <div>

                <div className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-full text-xs font-bold">
                    {travelType}
                  </div>
                  
                  {[city, state, country].filter(Boolean).length > 0 && (
                    <div className="flex">
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{displayLocation()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description Section - Full width on all screens */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>

      </div>
      
      {/* Full-screen image modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={toggleImageModal}>
          <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 z-10"
              onClick={toggleImageModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {images && (
              <div className="relative w-full h-[90%]">
                <Image 
                  src={images} 
                  alt={title || metadata?.propertyName || 'Travel deal'} 
                  layout="fill"
                  objectFit="contain"
                  className="object-contain"
                  fill
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Navbar/>
    </div>
  );
};

export default DealDetails;