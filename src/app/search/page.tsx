// app/deals/search/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Types for the search form and results
interface DealSearchFormData {
  dealTypeId: string;
  title?: string;
  travelType?: string;
  country?: string;
  state?: string;
  city?: string;
  validFrom?: string;
  validTo?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

interface Deal {
  id: string;
  title: string;
  price: number;
  travelType: string;
  country: string;
  state: string;
  city: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  metadata: Record<string, any>;
  [key: string]: any;
}

export default function SearchDealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const dealTypeId = searchParams.get('dealTypeId') || '';
  const dealTypeId ="0f20cda9-784a-48e6-8bd1-c0311853f9df";
  
  const [formData, setFormData] = useState<DealSearchFormData>({
    dealTypeId: dealTypeId,
    isActive: true,
    metadata: {}
  });
  
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [metadataSchema, setMetadataSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch metadata schema when deal type changes
  const fetchMetadataSchema = async (dealTypeId: string) => {
    if (!dealTypeId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?dealTypeId=${dealTypeId}`);
      const data = await response.json();
      
      if (data.success) {
        setMetadataSchema(data.schema);
        // Initialize metadata object based on schema
        const initialMetadata: Record<string, any> = {};
        data.schema.schema.fields.forEach((field: any) => {
          initialMetadata[field.id] = '';
        });
        setFormData(prev => ({
          ...prev,
          metadata: initialMetadata
        }));
      } else {
        setError(data.error || 'Failed to fetch schema');
      }
    } catch (err) {
      setError('Error fetching metadata schema');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : type === 'number' 
            ? Number(value) 
            : value
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.deals);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Error performing search');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch schema when component mounts if dealTypeId is available
  useState(() => {
    if (dealTypeId) {
      fetchMetadataSchema(dealTypeId);
    }
  });
  
  // Render metadata fields based on schema
  const renderMetadataFields = () => {
    if (!metadataSchema?.schema?.fields) return null;
    
    return metadataSchema.schema.fields.map((field: any) => {
      const value = formData.metadata?.[field.id] || '';
      
      switch (field.type) {
        case 'text':
          return (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={`metadata.${field.id}`}
                value={value}
                onChange={handleInputChange}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          );
          
        case 'textarea':
          return (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={`metadata.${field.id}`}
                value={value}
                onChange={handleInputChange}
                required={field.required}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          );
          
        case 'number':
          return (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                name={`metadata.${field.id}`}
                value={value}
                onChange={handleInputChange}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          );
          
        default:
          return null;
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Travel Deals</h1>
      
      {/* Deal Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Deal Type
        </label>
        <select
          name="dealTypeId"
          value={formData.dealTypeId}
          onChange={(e) => {
            handleInputChange(e);
            fetchMetadataSchema(e.target.value);
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="">Select a deal type</option>
          <option value="d96637fe-884a-4952-a2f4-c04561e7b04b">Package</option>
          {/* Add other deal types as needed */}
        </select>
      </div>
      
      {metadataSchema && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">{metadataSchema.dealTypeName}</h2>
          <p className="text-gray-600 mb-4">{metadataSchema.dealTypeDescription}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Search Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Search by title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Travel Type</label>
            <input
              type="text"
              name="travelType"
              value={formData.travelType || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="e.g. vacation, business"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="e.g. India"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="e.g. Jammu and Kashmir"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="e.g. Srinagar"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={formData.minPrice || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Minimum price"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={formData.maxPrice || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Maximum price"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Valid From</label>
            <input
              type="date"
              name="validFrom"
              value={formData.validFrom || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Valid To</label>
            <input
              type="date"
              name="validTo"
              value={formData.validTo || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Deals Only
            </label>
          </div>
        </div>
        
        {/* Dynamic Metadata Fields Section */}
        {metadataSchema && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Custom Fields</h3>
            {renderMetadataFields()}
          </div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? 'Searching...' : 'Search Deals'}
          </button>
        </div>
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Section */}
      {searchResults.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((deal) => (
              <div key={deal.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{deal.title || 'Untitled Deal'}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {deal.city && `${deal.city}, `}{deal.state && `${deal.state}, `}{deal.country}
                  </p>
                  
                  {deal.price && (
                    <p className="text-lg font-bold text-blue-600 mb-3">
                      ${deal.price.toLocaleString()}
                    </p>
                  )}
                  
                  {deal.metadata && deal.metadata.Description && (
                    <p className="text-gray-700 mb-4 line-clamp-3">{deal.metadata.Description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {deal.travelType || 'Package'}
                    </span>
                    
                    <button 
                      onClick={() => router.push(`/deals/${deal.id}`)}
                      className="inline-flex items-center px-3 py-1 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : searchResults.length === 0 && !isLoading && !error ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg mt-8">
          <p className="text-gray-500">No deals found matching your search criteria.</p>
        </div>
      ) : null}
    </div>
  );
}