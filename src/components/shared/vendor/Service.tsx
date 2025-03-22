// components/VendorServices.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, DollarSign } from 'lucide-react';
// import type { VendorService } from '../types/vendor';

export interface Service {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
    requiredCertifications: string[];
    isActive: boolean;
  }

export interface VendorService {
    id: number;
    vendorId: number;
    serviceId: number;
    service: Service;
    experienceYears?: number;
    clientCount?: number;
    pricingModel?: string;
    rateRangeMin?: number;
    rateRangeMax?: number;
    currency?: string;
    isActive: boolean;
  }
interface VendorServicesProps {
  services: VendorService[];
}

export const VendorServices: React.FC<VendorServicesProps> = ({ services }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Services Offered</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.filter(s => s.isActive).map((service) => (
            <Card key={service.id} className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{service.service.name}</h3>
                  <p className="text-sm text-gray-600">{service.service.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{service.experienceYears} years exp.</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{service.clientCount} clients</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{service.pricingModel}</span>
                  </div>
                  {service.rateRangeMin && service.rateRangeMax && (
                    <div className="text-sm text-gray-600">
                      Range: {service.currency} {service.rateRangeMin.toFixed(2)} - {service.rateRangeMax.toFixed(2)}
                    </div>
                  )}
                </div>

                {service.service.requiredCertifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {service.service.requiredCertifications.map((cert) => (
                      <Badge key={cert} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};