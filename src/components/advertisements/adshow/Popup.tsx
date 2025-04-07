import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

// Define the structure of an ad item
interface AdItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  link?: string;
}

// Define the props for the PopupAd component
interface PopupAdProps {
  className?: string;
  intervalTime?: number; // in milliseconds, default will be 60000 (1 minute)
  onClose?: () => void;
  onAdClick?: (ad: AdItem) => void;
}

const ads = [
    {
      id: '1',
      imageUrl: 'https://utfs.io/f/oomabsAtVpEIn2y5jK9VzCELQ1YpDB5HJj8PfMtySh3vAkbg', // Path to your image in the public folder
      imageAlt: 'Special Promotion',
      description: 'Get 20% off on all products this week!',
      link: 'https://example.com/promo'
    },
    {
      id: '2',
      imageUrl: 'https://utfs.io/f/oomabsAtVpEIS9tu1ckU7GWIraY14ZmxeAb2X6dgytVwKRkD',
      imageAlt: 'New Collection',
      description: 'Check out our latest collection for the season.',
      link: 'https://example.com/collection'
    },
    {
      id: '3',
      imageUrl: 'https://utfs.io/f/oomabsAtVpEILh0hpXjNh1RkQcJoCYPZx2637u0O9NEdWvUy',
      imageAlt: 'Limited Offer',
      description: 'Limited time offer: Free shipping on orders over $50!',
      link: 'https://example.com/shipping'
    }
  ];

const PopupAd: React.FC<PopupAdProps> = ({
  className = '',
  intervalTime = 60000,
  onClose,
  onAdClick
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);

  // Function to show the next ad
  const showNextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    setIsVisible(true);
  };

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
    
    // Set timer to show next ad after interval
    setTimeout(() => {
      showNextAd();
    }, intervalTime);
  };

  // Handle ad click
  const handleAdClick = () => {
    if (onAdClick && ads[currentAdIndex]) {
      onAdClick(ads[currentAdIndex]);
    }
  };

  // If there are no ads, don't render anything
  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return isVisible ? (
    <div className={`fixed bottom-4 right-4  bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm ${className}`}>
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
              objectFit="fit"
              priority
              className="rounded-md"
            />
          </div>
        )}
        
        <div 
          className="cursor-pointer" 
          onClick={handleAdClick}
        >
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