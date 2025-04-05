'use client';
import React, { useEffect, useState } from 'react';

const TravelDealSearch = () => {
  const [dealTypes, setDealTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedDealType, setSelectedDealType] = useState('');
  const [metadataSchema, setMetadataSchema] = useState<{ schema: { fields: { id: string; type: string; label: string; required?: boolean; placeholder?: string }[] }; dealTypeName?: string; dealTypeDescription?: string } | null>(null);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Render metadata fields based on schema
  const renderMetadataFields = () => {
    if (!metadataSchema || !metadataSchema.schema?.fields) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metadataSchema.schema.fields.map(field => {
          const value = formData.metadata?.[field.id] || "";

          switch (field.type) {
            case "text":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder || ''}
                  />
                </div>
              );

            case "textarea":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder || ''}
                  />
                </div>
              );

            case "number":
              return (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder || ''}
                  />
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
    <div className="w-full bg-gradient-to-b from-blue-100 to-indigo-200 min-h-screen mt-5">
      {/* Header with background image */}
      {/* <div 
        className="w-full bg-cover bg-center h-80 flex items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/api/placeholder/1600/600')" }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-2xl max-w-2xl mx-4">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Getaway</h1>
          <p className="text-xl">Exclusive travel deals curated just for you</p>
        </div>
      </div> */}

      {/* Navigation tabs for deal types - Now more attractive with pill design */}
      <div className="w-full bg-gradient-to-r from-blue-100 to-indigo-700 py-3 sticky top-0 z-10 shadow-xl">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center overflow-x-auto py-2 scrollbar-hide">
            {isLoadingDealTypes ? (
              <div className="p-4 text-white flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading deal types...
              </div>
            ) : (
              dealTypes.map(dealType => (
                <button
                  key={dealType.id}
                  onClick={() => handleDealTypeSelect(dealType.id)}
                  className={`px-8 py-3 font-medium rounded-full mx-2 transition-all transform hover:scale-105 ${
                    selectedDealType === dealType.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                      : 'bg-gray-800 bg-opacity-50 text-white hover:bg-gray-700'
                  }`}
                >
                  {dealType.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Search form container - Now with a more attractive design */}
      <div className="max-w-5xl mx-auto px-4 ">
        {metadataSchema && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900  shadow-2xl p-8 mb-8 transform hover:shadow-blue-500/20 transition-all duration-300">
            {/* <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
              <div className="p-2 rounded-full bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {metadataSchema.dealTypeName} Search
              </h2>
            </div> */}
            
            {/* {metadataSchema.dealTypeDescription && (
              <p className="text-gray-300 mb-8 text-center italic">
                {metadataSchema.dealTypeDescription}
              </p>
            )} */}
            
            <form onSubmit={handleSubmit}>
              {renderMetadataFields()}
              
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !formData.dealTypeId}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find Amazing Deals
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6 text-white rounded-r-lg">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searchResults.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                {searchResults.length} Amazing Deals Found
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map(deal => (
                <div
                  key={deal.id}
                  className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-2"
                >
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

                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{deal.title}</h3>
                    
                    {/* Location Info */}
                    {(deal.city || deal.state || deal.country || (deal.metadata && deal.metadata.Location)) && (
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {deal.travelType || deal.metadata?.Type || "Package"}
                        </span>
                      </div>
                    )}

                    {/* Valid Dates */}
                    {deal.validFrom && deal.validTo && (
                      <div className="text-xs text-gray-500 mt-3">
                        Valid: {new Date(deal.validFrom).toLocaleDateString()} - {new Date(deal.validTo).toLocaleDateString()}
                      </div>
                    )}

                    <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md">
                      View Deal Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchResults.length === 0 && !isLoading && !error && selectedDealType ? (
          <div className="bg-gray-800 p-8 text-center rounded-xl mt-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-300 text-lg">
              No deals found matching your search criteria.
            </p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search parameters or check back later.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TravelDealSearch;