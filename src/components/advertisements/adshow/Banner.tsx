"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';

// Define the structure of a banner ad item from the API
interface BannerAdItem {
  id: string;
  title: string | null;
  type: string;
  content: string;
  imageUrl: string | null;
  redirectUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isLocked?: boolean; // Added for compatibility with existing code
}

// Define the API response structure
interface ApiResponse {
  success: boolean;
  data: BannerAdItem[];
}

// Define the props for the BannerAd component
interface BannerAdProps {
  className?: string;
  autoRotateInterval?: number; // in milliseconds, default will be 3000 (3 seconds)
  manualNavigationPauseTime?: number; // in milliseconds, default will be 15000 (15 seconds)
  onAdClick?: (ad: BannerAdItem) => void;
  maxBannersToShow?: number; // Maximum number of banners to show in rotation
}

const BannerAd: React.FC<BannerAdProps> = ({
  className = '',
  autoRotateInterval = 3000,
  manualNavigationPauseTime = 15000, // Default to 15 seconds pause after manual navigation
  onAdClick,
  maxBannersToShow = 4 // Default to showing 4 banners max
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);
  const [isManualNavigation, setIsManualNavigation] = useState<boolean>(false);
  const [ads, setAds] = useState<BannerAdItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch advertisements from the API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/advertisements');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch advertisements: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          // Filter to get only BANNER type ads and filter active ones
          const bannerAds = data.data
            .filter(ad => ad.type === "BANNER" && ad.isActive)
            .map(ad => ({
              ...ad,
              // Use placeholder image if imageUrl is null
              imageUrl: ad.imageUrl || '/api/placeholder/800/400',
              // Use title or generic title if null
              title: ad.title || 'Advertisement',
              // Use content or generic description if empty
              description: ad.content || 'Click to learn more',
              isLocked: false
            }));
          
          // Shuffle the array to randomize the displayed ads
          const shuffledAds = [...bannerAds].sort(() => Math.random() - 0.5);
          
          setAds(shuffledAds);
        } else {
          throw new Error('Failed to fetch advertisements');
        }
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching advertisements:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAds();
  }, []);
  
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
    // If there are no ads or only one ad, no need for rotation
    if (displayAds.length <= 1) return;
    
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
    } else if (ad.redirectUrl) {
      // If no onAdClick handler but we have a redirectUrl, navigate to it
      window.open(ad.redirectUrl, '_blank');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <div className="relative h-52 w-full bg-gray-200 shadow-md rounded overflow-hidden flex items-center justify-center">
          <p className="text-gray-500">Loading advertisements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <div className="relative h-52 w-full bg-gray-200 shadow-md rounded overflow-hidden flex items-center justify-center">
          <p className="text-red-500">Failed to load advertisements</p>
        </div>
      </div>
    );
  }

  // If there are no ads, don't render the component
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
              style={{ cursor: ad.redirectUrl || onAdClick ? 'pointer' : 'default' }}
            >
              <div className="h-full w-full object-cover relative">
                <Image 
                  src={ad.imageUrl || '/api/placeholder/800/400'} 
                  alt={ad.title || 'Advertisement'}
                  layout="fill"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-top space-y-8 items-center pt-4">
                <p className="text-white font-bold text-lg">{ad.title || 'Advertisement'}</p>
                <div className='relative top-14'>
                  <p className="mt-2 text-sm text-white px-10 text-center">{ad.content || 'Click to learn more'}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Only show navigation if there are multiple ads */}
          {displayAds.length > 1 && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerAd;