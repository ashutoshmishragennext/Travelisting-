"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Navigation from '@/components/pages/Navbar';
import Link from 'next/link';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/shared/Footer';
import FoodHeaderBanner from '@/components/shared/Banner';
import Navbar from '@/components/shared/Gennextfooter';
import FoodCarousel from '@/components/shared/Banner';

interface Service {
  id: string;
  name: string;
  image: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
}

export default function AllServicesComponent({ params } : any) {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
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
    // Add as many items as you need
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/service?id=${params.id}`);
        const data = await response.json();
        
        // Filter only active services
        const activeServices = data.filter((service: Service) => service.isActive);
        
        setServices(activeServices);
        setFilteredServices(activeServices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again.');
        setLoading(false);
      }
    };

    fetchServices();
  }, [params.id]);

  // Search functionality
  useEffect(() => {
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleServiceClick = (serviceId: string) => {
    router.push(`/allService/${serviceId}`);
  };

  if (loading) {
    return (
      <div >
        <Navigation/>
        <FoodCarousel items={carouselData} />
        <div className="grid grid-cols-2 my-4 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(16)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div>  <Navigation/>
        <FoodCarousel items={carouselData} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
        <div className="w-48">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            type="text" 
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-gray-50 text-sm border-gray-200"
          />
        </div>
        </div>
        <div className="text-center text-gray-600">
          No services available or matching your search.
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation/>
      <FoodCarousel items={carouselData} />
    
      <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-medium">Furniture</h1>
          <span className="text-sm text-gray-500 hover:underline cursor-pointer">
            See all &gt;
          </span>
        </div>
        
        <div className="w-48">
          <Input 
            type="text" 
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-gray-50 text-sm border-gray-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {filteredServices.map((service) => (
          <Link
            href={`/allService/${service.id}`}
            key={service.id}
            className="block"
          >
            <Card className="overflow-hidden border border-gray-100 rounded-3xl shadow-lg hover:shadow-md transition-shadow p-4 bg-white">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-48 h-36 ">
                  <Image 
                    src={service.image} 
                    alt={service.name}
                    fill
                    className=" rounded-3xl"
                  />
                </div>
              </div>
              <CardContent className="p-0">
                <h3 className="text-sm font-medium text-center">
                  {service.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
    <Navbar/>
    </div>
  );
}