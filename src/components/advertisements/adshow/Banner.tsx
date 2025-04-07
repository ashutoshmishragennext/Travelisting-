import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';

// Define the structure of a banner ad item
interface BannerAdItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  isLocked?: boolean;
  link?: string;
}

// Define the props for the BannerAd component
interface BannerAdProps {
  className?: string;
  autoRotateInterval?: number; // in milliseconds, default will be 3000 (3 seconds)
  manualNavigationPauseTime?: number; // in milliseconds, default will be 15000 (15 seconds)
  onAdClick?: (ad: BannerAdItem) => void;
  maxBannersToShow?: number; // Maximum number of banners to show in rotation
}

const ads = [
  {
    id: '1',
    imageUrl: 'https://images.jdmagicbox.com/noida/x7/011pxx11.xx11.210305123819.z9x7/cbnr/085e39fa7396c85970caba99af7a3178.jpg',
    title: 'Summer Collection',
    description: 'Explore our new summer fashion collection with exclusive discounts',
    isLocked: false,
    link: 'https://example.com/summer'
  },
  {
    id: '2',
    imageUrl: 'https://images.jdmagicbox.com/noida/p7/011pxx11.xx11.231016171234.x6p7/cbnr/9e63ea19422d20075325cb09643ea6e6.jpg',
    title: 'Premium Membership',
    description: 'Unlock premium features and get access to exclusive content',
    isLocked: true,
    link: 'https://example.com/premium'
  },
  {
    id: '3',
    imageUrl: 'https://images.jdmagicbox.com/ghaziabad/z2/011pxx11.xx11.230705040840.c1z2/cbnr/404d3750901f0ea7cefca4460ad5333f.jpg',
    title: 'Limited Time Offer',
    description: 'Buy one get one free on all electronics this week only',
    isLocked: false,
    link: 'https://example.com/electronics'
  }
];
  
const BannerAd: React.FC<BannerAdProps> = ({
  className = '',
  autoRotateInterval = 3000,
  manualNavigationPauseTime = 15000, // Default to 15 seconds pause after manual navigation
  onAdClick,
  maxBannersToShow = 4 // Default to showing 4 banners max
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);
  const [isManualNavigation, setIsManualNavigation] = useState<boolean>(false);
  
  // If there are more ads than maxBannersToShow, select only the first maxBannersToShow ads
  const displayAds = ads.slice(0, maxBannersToShow);
  
  // Function to move to the next banner
  const handleBannerNext = useCallback(() => {
    setActiveBannerIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
    setIsManualNavigation(true);
  }, [displayAds.length]);

  // Function to move to the previous banner
  const handleBannerPrev = useCallback(() => {
    setActiveBannerIndex((prevIndex) => 
      prevIndex === 0 ? displayAds.length - 1 : prevIndex - 1
    );
    setIsManualNavigation(true);
  }, [displayAds.length]);

  // Handle dot navigation
  const handleDotNavigation = (index: number) => {
    setActiveBannerIndex(index);
    setIsManualNavigation(true);
  };

  // Set up auto-rotation with manual navigation pause
  useEffect(() => {
    // If manual navigation was triggered, wait for manualNavigationPauseTime before resuming auto rotation
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isManualNavigation) {
      timeoutId = setTimeout(() => {
        setIsManualNavigation(false);
      }, manualNavigationPauseTime);
    }
    
    // Only set up auto-rotation if manual navigation is not active
    let intervalId: NodeJS.Timeout | null = null;
    
    if (!isManualNavigation) {
      intervalId = setInterval(() => {
        setActiveBannerIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
      }, autoRotateInterval);
    }
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isManualNavigation, autoRotateInterval, manualNavigationPauseTime, displayAds.length]);

  // Handle ad click
  const handleAdClick = (ad: BannerAdItem) => {
    if (onAdClick && !ad.isLocked) {
      onAdClick(ad);
    }
  };

  // If there are no ads, don't render anything
  if (!displayAds || displayAds.length === 0) {
    return null;
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="relative h-52 w-full bg-white shadow-md rounded overflow-hidden">
        {/* Banner with dots navigation */}
        <div className="relative h-full w-full">
          {displayAds.map((ad, i) => (
            <div 
              key={ad.id} 
              className={`absolute inset-0 transition-opacity duration-500 ${i === activeBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => handleAdClick(ad)}
            >
              <div className="h-full w-full object-cover relative">
                <Image 
                  src={ad.imageUrl} 
                  alt={ad.title}
                  layout="fill"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-top space-y-8 items-center pt-4">
                <p className="text-white font-bold text-lg">{ad.title}</p>
                <div className='relative top-14'>
                  <p className="mt-2 text-sm text-white px-10 text-center">{ad.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {displayAds.map((ad, i) => (
              <button 
                key={ad.id}
                onClick={() => handleDotNavigation(i)}
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
};

export default BannerAd;