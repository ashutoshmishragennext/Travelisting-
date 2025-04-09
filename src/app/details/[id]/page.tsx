"use client"
import { useEffect, useState } from 'react';
import Navigation from '@/components/pages/Navbar';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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



interface ImageCarouselProps {
  images: string[] | null;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // For demo purposes, using the same image multiple times
  const imageArray:any = [];

  if(images && images.length >0){
    images.map((item)=>{
      imageArray.push(item);
    })
  }

  
  if (!imageArray.length) return null;
  
  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 mb-8">
      <h3 className="text-xl font-bold mb-4">More Destinations</h3>
      <div className="relative h-64 overflow-hidden rounded-lg">
        {imageArray.map((img : any, index : any) => (
          <div 
            key={index} 
            className={`absolute w-96 h-full m-auto transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image 
              src={img} 
              alt={`Featured destination ${index + 1}`} 
              fill
              className="object-fit"
            />
            {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h4 className="font-bold">Featured Destination {index + 1}</h4>
              <p>Exclusive deals available now!</p>
            </div> */}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {imageArray.map((_:any, index:any) => (
          <button 
            key={index} 
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

interface PopupAdProps {
  isOpen: boolean;
  onClose: () => void;
}

// const PopupAd: React.FC<PopupAdProps> = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;
  
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Limited Time Offer!</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <p className="mb-4">Subscribe to our newsletter and get exclusive deals on your next trip!</p>
//         <div className="mb-4">
//           <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
//         </div>
//         <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           Subscribe Now
//         </button>
//       </div>
//     </div>
//   );
// };

const DealDetails: React.FC = () => {
  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const params = useParams();
  const id = params.id as string;
  const [imagePush , setImagePush] = useState<string[]>([]);
  const imageArray2:any = [];


  useEffect(()=> {
    const fetchDeals = async () => {
      const response = await fetch("/api/deals");
      const data = await response.json();
      data.map((item : any) => {
          imageArray2.push(item.images);
      })
      setImagePush(imageArray2);
    }
    fetchDeals();
}, [])

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
    
    // Show popup after 5 seconds
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    
    return () => clearTimeout(popupTimer);
  }, [id]);

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

      <BannerAd 
      className=' h-52'
      />

      <StickyFeaturedDeal />

      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Deal Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className=' flex pl-4'>
            <div className="flex items-center text-gray-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{displayLocation()}</span>
            </div>
          </div>
          
          <div className="relative h-64 md:h-80 ">
            {images ? (
              <Image 
                src={images} 
                alt={title || metadata?.propertyName || 'Travel deal'} 
                layout="fill"
                objectFit="contain"
                priority
                fill
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            <div className="absolute top-4 right-4 space-y-4 ">
              <div className='bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold'>
                {travelType}
              </div>
            
            <div className=' hidden lg:block space-y-2'>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VALID FROM</h3>
                  <p className="text-base font-medium text-gray-900">{formatDate(validFrom)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VALID UNTIL</h3>
                  <p className="text-base font-medium text-gray-900">{formatDate(validTo)}</p>
                </div>
            </div>
            </div>
          </div>
          
          <div className="p-6">
            
            
            {/* {(price || discount) && (
              <div className="flex items-center mb-4">
                {price && (
                  <span className={`text-2xl font-bold ${discount ? 'text-gray-400 line-through mr-2' : 'text-green-600'}`}>
                    ₹{price}
                  </span>
                )}
                {discount && price && (
                  <span className="text-2xl font-bold text-green-600">
                    ₹{price * (1 - discount/100)}
                  </span>
                )}
                {discount && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
            )} */}

            <div className=" lg:hidden block border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VALID FROM</h3>
                  <p className="text-base font-medium text-gray-900">{formatDate(validFrom)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VALID UNTIL</h3>
                  <p className="text-base font-medium text-gray-900">{formatDate(validTo)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deal Content with Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{description || 'No description available.'}</p>
            </div>

            {/* Amenities Section (if available) */}
            {/* {metadata?.amenities && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <p className="text-gray-700">{metadata.amenities}</p>
              </div>
            )} */}

            {/* Room Types Section (if available) */}
            {/* {metadata?.roomTypes && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Room Types</h2>
                <p className="text-gray-700">{metadata.roomTypes}</p>
              </div>
            )} */}
            
            {/* Carousel Advertisement */}
            <ImageCarousel images={imagePush} />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              
              {contactPhones && contactPhones.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">PHONE</h3>
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2">EMAIL</h3>
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
            </div>

            {/* Property Details */}
            {metadata?.starRating && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Property Details</h2>
                {metadata.starRating && (
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">LOCATION</h3>
                    <p className="text-gray-700">{metadata.starRating}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Popup Advertisement */}
      {/* <PopupAd isOpen={showPopup} onClose={() => setShowPopup(false)} /> */}
      <PopupAd
        className=' w-52 sm:w-64 md:w-80'
        intervalTime={30000} 
        onAdClick={()=> {}}
      />

      <Navbar/>
    </div>
  );
};

export default DealDetails;