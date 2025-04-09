"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

// Define the structure of an ad item from the API
interface AdItem {
  id: string;
  title: string | null;
  type: string;
  content: string;
  imageUrl: string | null;
  redirectUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Define the API response structure
interface ApiResponse {
  success: boolean;
  data: AdItem[];
}

// Define the props for the StickyFeaturedDeal component
interface StickyFeaturedDealProps {
  className?: string;
  reappearDelay?: number; // Time before showing the ad again after closing, default 30000ms (30 seconds)
  onClose?: () => void;
  onAdClick?: (ad: AdItem) => void;
  isShowAbove ?: boolean;
}

const StickyFeaturedDeal: React.FC<StickyFeaturedDealProps> = ({
  className = '',
  reappearDelay = 45000,
  onClose,
  onAdClick,
  isShowAbove = false
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentAd, setCurrentAd] = useState<AdItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured deal advertisements from the API
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
          // Filter to get only FEATURED_DEAL type ads that are active
          const featuredDeals = data.data.filter(ad => 
            ad.type === "FEATURED_DEAL" && ad.isActive
          );
          
          if (featuredDeals.length > 0) {
            // Select a random featured deal
            const randomIndex = Math.floor(Math.random() * featuredDeals.length);
            setCurrentAd(featuredDeals[randomIndex]);
            setIsVisible(true);
          }
        } else {
          throw new Error('Failed to fetch advertisements');
        }
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching featured deal advertisements:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAds();
  }, []);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
    
    // Set timer to show ad again after specified delay
    setTimeout(() => {
      setIsVisible(true);
    }, reappearDelay);
  };

  // Handle ad click
  const handleAdClick = () => {
    if (currentAd && currentAd.redirectUrl) {
      let url = currentAd.redirectUrl;
      if (!/^https?:\/\//i.test(currentAd.redirectUrl)) {
        url = 'https://' + currentAd.redirectUrl;
      }
      window.open(url, '_blank');
    }
  };

  // If still loading, there's no ad, or there's an error, don't render anything
  if (isLoading || !currentAd || error || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed ${isShowAbove ? "bottom-16" : "bottom-2"}  bg-transparent left-0 right-0 flex justify-center z-50 ${className}`}>
      <div className="max-w-[700px] w-full h-30 bg-white shadow-lg rounded-t-lg overflow-hidden relative">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 rounded-xl bg-white p-1 text-red-500 z-10 hover:text-red-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div 
          className="flex items-center h-full cursor-pointer " 
          onClick={handleAdClick}
        >
          {currentAd.imageUrl && (
            <div className="relative h-[120px] w-full flex-shrink-0">
              <Image 
                src={currentAd.imageUrl} 
                alt={currentAd.title || 'Featured Deal'} 
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          )}
          
          <div className="flex-1 p-4">
            {currentAd.title && (
              <h3 className="font-bold text-gray-900 text-lg mb-1">{currentAd.title}</h3>
            )}
            
            <p className="text-gray-800">{currentAd.content}</p>
            
            {currentAd.redirectUrl && (
              <p className="text-blue-500 font-medium mt-2 block hover:underline">
                View Deal
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyFeaturedDeal;