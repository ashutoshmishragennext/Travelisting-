import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define types
interface Advertisement {
  id: string;
  name: string;
  description: string;
  image: string;
  price : string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const AdvertisementSelector = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const router = useRouter();

  // Fetch advertisements data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/advertisementdefination');
        
        if (!response.ok) {
          throw new Error('Failed to fetch advertisement data');
        }
        
        const data = await response.json();
        setAdvertisements(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching advertisement data. Please try again later.');
        setLoading(false);
        console.error('Error fetching advertisement data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle advertisement type selection
  const toggleAdType = (type: string) => {
    let initialPrice = 0;

    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
      initialPrice -= Number(advertisements.find((item) => item.name.toLowerCase().includes(type.toLowerCase()))?.price)
    } else {
      setSelectedTypes([...selectedTypes, type]);
      initialPrice += Number(advertisements.find((item) => item.name.toLowerCase().includes(type.toLowerCase()))?.price)
    }


    selectedTypes.map(items => {
       const price =  advertisements.find((item) => item.name.toLowerCase().includes(items.toLowerCase()))?.price;
        if(price) {
          initialPrice = Number(initialPrice) + Number(price)
        }
    })

    setTotalPrice(initialPrice);
  };

  // Calculate total price
  const [totalPrice,setTotalPrice] = useState<string | number>(0);

  // Handle checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Advertisement type options
  const adTypes = ["BANNER", "POPUP", "SIDEBAR", "FEATURED", "NOTIFICATION"];

  // Get advertisement by type
  const getAdByType = (type: string) => {
    return advertisements.find((item) => item.name.toLowerCase().includes(type.toLowerCase()));
  };

  // For banner navigation
  const handleBannerPrev = () => {
    setActiveBannerIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleBannerNext = () => {
    setActiveBannerIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading advertisement options...</p>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        {error}
      </div>
    );
  }

  // Render different ad type previews
  const renderAdPreview = (type: string) => {
    const ad = getAdByType(type);
    if (!ad) return null;

    switch (type) {
      case "BANNER":
        return (
          <div className="w-full overflow-hidden">
            <div className="relative h-52 w-full bg-white shadow-md rounded overflow-hidden">
              {/* Banner with dots navigation instead of horizontal slider */}
              <div className="relative h-full w-full">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className={`absolute inset-0 transition-opacity duration-500 ${i === activeBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    <div className="h-full w-full object-cover relative">
                      <Image 
                        src={ad.image} 
                        alt={ad.name}
                        layout="fill"
                        objectFit="fit"
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-top space-y-8 items-center pt-4">
                      <p className="text-white font-bold text-lg">{ad.name}</p>
                      <p className="mt-2 text-sm text-white px-10 text-center">{ad.description}</p>
                    </div>


                  </div>
                ))}
                
                {/* Navigation dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {[0, 1, 2].map((i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveBannerIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all ${i === activeBannerIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                
                {/* Arrow navigation */}
                <button 
                  onClick={handleBannerPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleBannerNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1"
                  aria-label="Next banner"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        );

      case "POPUP":
        return (
          <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white shadow-lg rounded-lg w-4/5 max-w-md p-4 relative">
                {/* Enhanced cross/close button */}
                <button className="absolute top-2 right-2 text-gray-700 z-10 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                  <X size={16} />
                </button>
                <div className="flex flex-col items-center">
                <div className="h-32 w-full object-cover relative">
                      <Image 
                        src={ad.image} 
                        alt={ad.name}
                        layout="fill"
                        objectFit="fit"
                        priority
                      />
                    </div>
                  <h3 className="font-bold">{ad.name}</h3>
                  <p className="text-sm text-center mt-2">{ad.description}</p>
                  <Button size="sm" className="mt-3">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "SIDEBAR":
        return (
          <div className="flex">
            <div className="w-2/3 bg-gray-100 h-64 p-4">
              <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-300">
                <p className="text-gray-500">Main Website Content</p>
              </div>
            </div>
            <div className="w-1/3 bg-white h-64 p-2 border-l border-gray-200">
              <div className="h-full flex flex-col rounded overflow-hidden shadow">
                    <div className="h-1/2 w-full object-cover relative">
                      <Image 
                        src={ad.image} 
                        alt={ad.name}
                        layout="fill"
                        objectFit="fit"
                        priority
                      />
                    </div>
                <div className="p-2">
                  <h4 className="font-bold text-sm">{ad.name}</h4>
                  <p className="text-xs mt-1">{ad.description.substring(0, 60)}...</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full text-xs">View</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "FEATURED":
        return (
          <div className="w-full h-64 relative bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-full w-full object-cover relative">
              <Image 
                src={ad.image} 
                alt={ad.name}
                layout="fill"
                objectFit="fit"
                priority
              />
            </div>
            <div className="absolute inset-0 top-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
            <div className=' flex space-x-5 items-center'>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block w-fit mb-2">FEATURED</span>
              <h3 className="text-white font-bold text-xl text-center -translate-y-1">{ad.name}</h3>
            </div>
            <div className=' flex-1 flex flex-col justify-around '>
              <p className="text-white/90 text-sm mt-1 px-8 text-center">{ad.description}</p>
              <Button className="mt-3 w-fit">Learn More</Button>
              </div>
            </div>
          </div>
        );

      case "NOTIFICATION":
        return (
          <div className="w-full">
            <div className="bg-white shadow-lg rounded-lg p-3 max-w-sm mx-auto border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Bell size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{ad.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{ad.description.substring(0, 80)}...</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Button size="sm" variant="outline" className="text-xs mr-2">Dismiss</Button>
                <Button size="sm" className="text-xs">View</Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-center text-gray-500">Notification appears in corner of screen</p>
          </div>
        );

      default:
        return (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{ad.name}</CardTitle>
            </CardHeader>
            <div className="relative h-48 bg-gray-100">
              <div className="h-full w-full object-cover relative">
                <Image 
                  src={ad.image} 
                  alt={ad.name}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </div>
            <CardContent className="pt-4">
              <CardDescription>{ad.description}</CardDescription>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Select Advertisement Types</h1>
      
      {/* Advertisement type selector buttons */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose Advertisement Types</h2>
        <div className="flex flex-wrap gap-2">
          {adTypes.map(type => (
            <Button 
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              onClick={() => toggleAdType(type)}
              className="min-w-32"
            >
              {type.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview section */}
      {selectedTypes.length > 0 && advertisements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Advertisement Previews</h2>
          <div className="grid grid-cols-1 gap-8">
            {selectedTypes.map(type => (
              <div key={type} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{getAdByType(type)?.name}</h3>
                {renderAdPreview(type)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout section */}
      {selectedTypes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Selection</CardTitle>
            <CardDescription>
              You've selected {selectedTypes.length} advertisement type{selectedTypes.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {selectedTypes.map(type => (
                <li key={type}>{getAdByType(type)?.name}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-4">
            <div className="text-lg font-semibold">
              Total: ₹{totalPrice.toLocaleString()}
            </div>
            <Button onClick={handleCheckout} className="flex items-center gap-2">
              <ShoppingCart size={18} />
              Pay (₹{totalPrice.toLocaleString()})
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AdvertisementSelector;