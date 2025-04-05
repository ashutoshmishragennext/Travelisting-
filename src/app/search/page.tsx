'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, MapPin } from 'lucide-react';

const TravelDealSearch = () => {
  const [dealTypes, setDealTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedDealType, setSelectedDealType] = useState('');
  const [metadataSchema, setMetadataSchema] = useState<{ schema: { fields: { id: string; type: string; label: string; options : string[]; required?: boolean; placeholder?: string }[] }; dealTypeName?: string; dealTypeDescription?: string } | null>(null);
  const [formData, setFormData] = useState<{
    dealTypeId: string;
    isActive: boolean;
    metadata: Record<string, any>;
  }>({
    dealTypeId: '',
    isActive: true,
    metadata: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDealTypes, setIsLoadingDealTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface Deal {
    id: string;
    title?: string;
    images?: string;
    city?: string;
    state?: string;
    country?: string;
    price?: number;
    travelType?: string;
    validFrom?: string;
    validTo?: string;
    metadata?: Record<string, any>;
  }

  const [searchResults, setSearchResults] = useState<Deal[]>([]);

  // Fetch all available deal types
  const fetchDealTypes = async () => {
    try {
      setIsLoadingDealTypes(true);
      const response = await fetch("/api/deal-types");
      const data = await response.json();

      if (data.dealTypes && Array.isArray(data.dealTypes)) {
        setDealTypes(data.dealTypes);
        // Initialize with the first deal type if available
        if (data.dealTypes.length > 0) {
          handleDealTypeSelect(data.dealTypes[0].id);
        }
      } else {
        setError("Invalid deal types response format");
      }
    } catch (err) {
      setError("Error fetching deal types");
      console.error(err);
    } finally {
      setIsLoadingDealTypes(false);
    }
  };

  // Fetch metadata schema when deal type changes
  const fetchMetadataSchema = async (dealTypeId: any) => {
    if (!dealTypeId) {
      setMetadataSchema(null);
      setFormData(prev => ({ ...prev, metadata: {} }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?dealTypeId=${dealTypeId}`);
      const data = await response.json();

      if (data.success) {
        setMetadataSchema(data.schema);
        // Initialize metadata object based on schema
        const initialMetadata: Record<string, string> = {};
        data.schema.schema.fields.forEach((field: { id: string }) => {
          initialMetadata[field.id] = "";
        });
        setFormData(prev => ({
          ...prev,
          metadata: initialMetadata,
        }));
      } else {
        setError(data.error || "Failed to fetch schema");
      }
    } catch (err) {
      setError("Error fetching metadata schema");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("metadata.")) {
      const metadataField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
      }));
    }
  };

  // Handle select change for shadcn/ui Select component
  const handleSelectChange = (value: string, fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [fieldId]: value,
      },
    }));
  };

  // Handle deal type selection
  const handleDealTypeSelect = (dealTypeId: string) => {
    setSelectedDealType(dealTypeId);
    setFormData(prev => ({ ...prev, dealTypeId }));
    fetchMetadataSchema(dealTypeId);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.deals);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError("Error performing search");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch deal types when component mounts
  useEffect(() => {
    fetchDealTypes();
  }, []);

  const renderMetadataFields = () => {
    if (!metadataSchema || !metadataSchema.schema?.fields) return null;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metadataSchema.schema.fields.map(field => {
          const value = formData.metadata?.[field.id] || "";
  
          // Skip rendering Description here
          if (field.id === "Description") return null;
  
          switch (field.type) {
            case "text":
            case "textarea":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type="text"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full"
                    placeholder={field.placeholder || ''}
                  />
                </div>
              );
  
            case "number":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type="number"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full"
                    placeholder={field.placeholder || ''}
                  />
                </div>
              );
  
            case "date":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type="date"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full"
                  />
                </div>
              );
  
            case "select":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Select 
                    value={value} 
                    onValueChange={(newValue) => handleSelectChange(newValue, field.id)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
  
            default:
              return null;
          }
        })}
      </div>
    );
  };
  
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen">
      {/* Navigation tabs for deal types */}
      <div className="w-full bg-white py-4 sticky top-0 shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center overflow-x-auto py-2 gap-2">
            {isLoadingDealTypes ? (
              <div className="p-4 text-gray-600 flex items-center">
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Loading deal types...
              </div>
            ) : (
              dealTypes.map(dealType => (
                <Button
                  key={dealType.id}
                  onClick={() => handleDealTypeSelect(dealType.id)}
                  variant={selectedDealType === dealType.id ? "default" : "outline"}
                  className={`px-6 py-2 rounded-full transition-all`}
                >
                  {dealType.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Search form container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {metadataSchema && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-800">Find Your Perfect Travel Deal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderMetadataFields()}
                
                <div className="mt-8 flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.dealTypeId}
                    className="px-8 py-6 rounded-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Search className="mr-2 h-5 w-5" />
                        Find Amazing Deals
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {searchResults.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {searchResults.length} Amazing Deals Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map(deal => (
                <Card key={deal.id} className="overflow-hidden transition-all hover:shadow-lg">
                  {/* Image Section */}
                  {deal.images && (
                    <div className="h-52 overflow-hidden">
                      <img
                        src={deal.images}
                        alt={deal.title || "Travel Deal"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/400/300"; // Fallback image
                        }}
                      />
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{deal.title}</h3>
                    
                    {/* Location Info */}
                    {(deal.city || deal.state || deal.country || (deal.metadata && deal.metadata.Location)) && (
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                        {[
                          deal.city || (deal.metadata && deal.metadata.City),
                          deal.state || (deal.metadata && deal.metadata.State),
                          deal.country
                        ].filter(Boolean).join(", ") || deal.metadata?.Location || ""}
                      </p>
                    )}

                    {/* Price */}
                    {deal.price && (
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        ₹{deal.price.toLocaleString()}
                      </p>
                    )}

                    {/* Travel Type */}
                    {(deal.travelType || (deal.metadata && deal.metadata.Type)) && (
                      <div className="mb-3">
                        <Badge variant="secondary">
                          {deal.travelType || deal.metadata?.Type || "Package"}
                        </Badge>
                      </div>
                    )}

                    {/* Valid Dates */}
                    {deal.validFrom && deal.validTo && (
                      <div className="text-xs text-gray-500 mt-3">
                        Valid: {new Date(deal.validFrom).toLocaleDateString()} - {new Date(deal.validTo).toLocaleDateString()}
                      </div>
                    )}

                    <Button className="mt-4 w-full">
                      View Deal Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : searchResults.length === 0 && !isLoading && !error && selectedDealType ? (
          <Card className="p-8 text-center mt-8 bg-gray-50">
            <CardContent className="pt-6 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 text-lg">
                No deals found matching your search criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search parameters or check back later.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TravelDealSearch;