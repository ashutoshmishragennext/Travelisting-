// types/vendor.ts

// Base interface with common fields
export interface VendorData {
  id: string;  // Changed to string to match usage
  companyName: string;
  legalEntityType: string | null;  // Changed to null instead of optional
  taxId: string | null;
  establishmentYear: number | null;
  socialLinks: Record<string, string> | null;
  logo: string;  // Required based on usage
  coverImage: string;  // Required based on usage
  pictures: string[] | null;
  primaryContactName: string;  // Required based on usage
  primaryContactEmail: string;  // Required based on usage
  primaryContactPhone: string;  // Required based on usage
  headquartersAddress: string;  // Required based on usage
  operatingCountries: string[];
  employeeCountRange: string;  // Required based on usage
  annualRevenueRange: string;  // Required based on usage
  regulatoryLicenses: string[];
  insuranceCoverage: Record<string, any> | null;
}

// Extended interface with additional fields
interface Vendor extends VendorData {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// In VendorProfile.tsx
interface VendorProfileProps {
  vendor: VendorData & {
      userId?: string;
      createdAt?: string;
      updatedAt?: string;
  };
}
  
  // components/VendorProfile.tsx
  import React from 'react';
  import Image from 'next/image';
  import { Card, CardContent, CardHeader } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Calendar, Mail, Phone, MapPin, Building2, Users, BadgeDollarSign, Shield } from 'lucide-react';
  
  // interface VendorProfileProps {
  //   vendor: any;
  // }
  
  export const VendorProfile: React.FC<VendorProfileProps> = ({ vendor }) => {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-1">
        {/* Cover Image and Logo Section */}
        <div className="relative h-36 sm:h-48 rounded-lg overflow-hidden">
          {vendor.coverImage ? (
            <Image
              src={vendor.coverImage}
              alt={`${vendor.companyName} cover`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
          {vendor.logo && (
            <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border-4 border-white bg-white">
                <Image
                  src={vendor.logo}
                  alt={`${vendor.companyName} logo`}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
  
        {/* Company Info */}
        <Card className="mt-16 sm:mt-20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{vendor.companyName}</h1>
                <p className="text-gray-600 text-sm">{vendor.legalEntityType}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Est. {vendor.establishmentYear}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Contact */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-semibold">Primary Contact</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.primaryContactName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.primaryContactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.primaryContactPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.headquartersAddress}</span>
                </div>
              </div>
            </div>
  
            {/* Business Details */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-semibold">Business Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.employeeCountRange} employees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeDollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{vendor.annualRevenueRange}</span>
                </div>
              </div>
            </div>
  
            {/* Operating Countries */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-semibold">Operating Countries</h2>
              <div className="flex flex-wrap gap-2">
                {vendor.operatingCountries && vendor.operatingCountries.map((country) => (
                  <Badge key={country} variant="secondary" className="text-xs sm:text-sm">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
  
            {/* Regulatory Licenses */}
            {/* <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-semibold">Regulatory Licenses</h2>
              <div className="flex flex-wrap gap-2">
                {vendor.regulatoryLicenses && vendor.regulatoryLicenses.map((license) => (
                  <Badge key={license} variant="outline" className="text-xs sm:text-sm">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {license}
                  </Badge>
                ))}
              </div>
            </div> */}
  
            {/* Insurance Coverage */}
            {/* {vendor.insuranceCoverage && (
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-semibold">Insurance Coverage</h2>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(vendor.insuranceCoverage).map(([type, details]) => (
                    <div key={type} className="p-3 sm:p-4 rounded-lg border">
                      <h3 className="font-medium text-sm sm:text-base">{type}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{JSON.stringify(details)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </CardContent>
        </Card>
      </div>
    );
  };