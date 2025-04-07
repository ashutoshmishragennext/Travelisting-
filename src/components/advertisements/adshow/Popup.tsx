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
  // Additional fields for UI
  imageAlt?: string;
  description?: string;
  link?: string;
}

// Define the API response structure
interface ApiResponse {
  success: boolean;
  data: AdItem[];
}

// Define the props for the PopupAd component
interface PopupAdProps {
  className?: string;
  intervalTime?: number; // in milliseconds, default will be 60000 (1 minute)
  onClose?: () => void;
  onAdClick?: (ad: AdItem) => void;
  initialDelay?: number; // time before showing the first popup, default 5000ms
}

const PopupAd: React.FC<PopupAdProps> = ({
  className = '',
  intervalTime = 60000,
  onClose,
  onAdClick,
  initialDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [ads, setAds] = useState<AdItem[]>([]);
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
          // Filter to get only POPUP type ads and that are active
          const popupAds : any = data.data
            .filter(ad => ad.type === "POPUP" && ad.isActive)
            .map(ad => ({
              ...ad,
              // Use placeholder image if imageUrl is null
              imageUrl: ad.imageUrl || '/api/placeholder/400/300',
              // Use title or null
              imageAlt: ad.title || 'Advertisement',
              // Use content as description
              description: ad.content || 'Special offer',
              // Use redirectUrl as link
              link: ad.redirectUrl
            }));
          
          // Shuffle the array to randomize the displayed ads
          const shuffledAds = [...popupAds].sort(() => Math.random() - 0.5);
          
          setAds(shuffledAds);
          
          // Show popup after initial delay only if there are ads to show
          if (shuffledAds.length > 0) {
            setTimeout(() => {
              setIsVisible(true);
            }, initialDelay);
          }
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
  }, [initialDelay]);

  // Function to show the next ad
  const showNextAd = () => {
    if (ads.length > 0) {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      setIsVisible(true);
    }
  };

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
    
    // Set timer to show next ad after interval if there are multiple ads
    if (ads.length > 1) {
      setTimeout(() => {
        showNextAd();
      }, intervalTime);
    }
  };

  // Handle ad click
  const handleAdClick = () => {
    const currentAd = ads[currentAdIndex];
    if (onAdClick && currentAd) {
      onAdClick(currentAd);
    } else if (currentAd?.redirectUrl) {
      // If no onAdClick handler but we have a redirectUrl, navigate to it
      window.open(currentAd.redirectUrl, '_blank');
    }
  };

  // If still loading, there are no ads, or there's an error, don't render anything
  if (isLoading || !ads || ads.length === 0 || error) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return isVisible ? (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm ${className}`}>
      <button 
        onClick={handleClose}
        className="absolute top-2 right-2 rounded-xl bg-white p-1 text-red-500 z-10 hover:text-red-700"
        aria-label="Close"
      >
        <X size={20} />
      </button>
      
      <div className="flex flex-col">
        {currentAd.imageUrl && (
          <div className="relative h-40 w-full mb-3">
            <Image 
              src={currentAd.imageUrl} 
              alt={currentAd.imageAlt || 'Advertisement'} 
              layout="fill"
              objectFit="contain"
              priority
              className="rounded-md"
            />
          </div>
        )}
        
        <div 
          className="cursor-pointer" 
          onClick={handleAdClick}
        >
          {currentAd.title && (
            <h3 className="font-medium text-gray-900 mb-1">{currentAd.title}</h3>
          )}
          
          <p className="text-sm text-gray-800">{currentAd.description}</p>
          
          {currentAd.link && (
            <a 
              href={currentAd.link}
              className="text-blue-500 text-sm mt-2 block hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default PopupAd;