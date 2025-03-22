import React from 'react';
import { Shield, Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  categoryName: string;
  description?: string;
}

interface VendorServiceDetails {
  id: string;
  experienceYears: number;
  description:string;
  price:string;
  clientCount: number;
  pricingModel: string;
  rateRangeMin: number;
  rateRangeMax: number;
  currency: string;
}

interface ServiceCardProps {
  service: Service;
  vendorServiceDetails: VendorServiceDetails;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, vendorServiceDetails }) => {
  console.log("data........",vendorServiceDetails);
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="p-6 relative">
        {/* Category Badge */}
        <div className="absolute -right-12 top-4 rotate-45 bg-blue-500 text-white px-12 py-1 text-xs font-semibold">
          {service.categoryName}
        </div>

        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {service.name}
          </h3>
        </div>
        
        {/* Stats Grid with Gradient Backgrounds */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg">
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium">
                {vendorServiceDetails?.experienceYears} Years
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-lg">
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm font-medium">
                {vendorServiceDetails?.clientCount} Clients
              </span>
            </div>
          </div>
        </div>
        
        {/* Pricing Section with Enhanced Design */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg mb-6">
          <div className="flex items-center text-gray-700">
            <DollarSign className="h-6 w-6 mr-2 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {vendorServiceDetails?.pricingModel}
              </span>
              <span className="text-lg font-bold text-purple-600">
                ${vendorServiceDetails?.price} 
                <span className="text-sm ml-1">{vendorServiceDetails?.currency}</span>
              </span>
            </div>
          </div>
        </div>
        
        {vendorServiceDetails?.description && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              {vendorServiceDetails?.description}
            </p>
          </div>
        )}
        
        <Link 
          href={`/product/${vendorServiceDetails?.id}`} 
          className="group flex items-center justify-center w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="mr-2">View Details</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

interface ServicesDisplayProps {
  data: Array<{
    service: Service;
    vendorServiceDetails: VendorServiceDetails;
  }>;
}

const ServicesDisplay: React.FC<ServicesDisplayProps> = ({ data }) => {
  return (
    <div className="container   mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Shield className="h-8 w-8 mr-3 text-blue-500" />
          Our Services
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {data && data.map((item) => (
          <ServiceCard 
            key={item.service.id} 
            service={item.service}
            vendorServiceDetails={item.vendorServiceDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesDisplay;