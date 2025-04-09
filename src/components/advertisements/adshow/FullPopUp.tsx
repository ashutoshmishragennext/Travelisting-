import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

// Define the structure of an ad item from the API
interface AdItem {
  id: string;
  type: string;
  imageUrl: string | null;
  redirectUrl: string | null;
  isActive: boolean;
}

// Define the API response structure
interface ApiResponse {
  success: boolean;
  data: AdItem[];
}

// Define the props for the PopupAd component
interface PopupAdProps {
  onClose?: () => void;
  initialDelay?: number; // time before showing the popup, default 2000ms
}

const CardPopupAd: React.FC<PopupAdProps> = ({
  onClose,
  initialDelay = 2000
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [ad, setAd] = useState<AdItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageSize, setImageSize] = useState({ width: 400, height: 300 });

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
        console.log('API response:', data); // Debug log
        
        if (data.success) {
          // Filter to get only POPUP type ads and that are active
          const popupAds = data.data
            .filter(ad => ad.type === "POPUP" && ad.isActive && ad.imageUrl);
          
          console.log('Filtered popup ads:', popupAds); // Debug log
          
          // Get a random ad from the filtered list
          if (popupAds.length > 0) {
            const randomIndex = Math.floor(Math.random() * popupAds.length);
            setAd(popupAds[randomIndex]);
            
            // Show popup after initial delay
            setTimeout(() => {
              setIsVisible(true);
              console.log('Setting popup visible'); // Debug log
            }, initialDelay);
            
            // Preload the image to get dimensions
            if (popupAds[randomIndex].imageUrl) {
              // Create a proper HTML Image element with the required src
              const img = document.createElement('img');
              img.src = popupAds[randomIndex].imageUrl;
              img.onload = () => {
                setImageSize({
                  width: img.width,
                  height: img.height
                });
              };
            }
          }
        }
      } catch (err) {
        console.error('Error fetching advertisements:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAds();
  }, [initialDelay]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Handle ad click for redirection
  const handleAdClick = () => {
    if (ad?.redirectUrl) {
      let url = ad.redirectUrl;
      if (!/^https?:\/\//i.test(ad.redirectUrl)) {
        url = 'https://' + ad.redirectUrl;
      }
      window.open(url, '_blank');
      handleClose();
    }
  };

  // If loading, no ad found, or not visible, don't render anything
  if (isLoading || !ad || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Full screen overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Card container with white background, padding and horizontal margin */}
      <div className="relative bg-white p-2 mx-2 rounded-lg shadow-xl">
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-red-500 z-10 hover:text-red-700 shadow-md"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        {ad.imageUrl && (
          <div 
            className="cursor-pointer"
            onClick={handleAdClick}
          >
            <Image 
              src={ad.imageUrl}
              alt="Advertisement"
              width={imageSize.width}
              height={imageSize.height}
              priority
              style={{ display: 'block' }}
              className="rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPopupAd;