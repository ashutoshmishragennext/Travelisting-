import React, { useState, useEffect } from 'react';
import { Loader, Plus, X, Edit, Save, Trash2 } from 'lucide-react';

// TypeScript interfaces
interface HotelChain {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  headquarters: string;
  properties: number;
  createdAt: string;
}

interface HotelProperty {
  id: string;
  name: string;
  location: string;
  rooms: number;
  amenities: string[];
  hotelChainId: string;
  propertyType: string,
    category: string, // Luxury, Budget, etc.
    subcategory: string, // Resort, City Hotel, etc.
    starRating: string,
    chainId: string,
    address: string,
    state: string,
    city: string,
    pincode: string,
    contactName: string,
    contactEmail: string,
    contactPhone: string,
    photos: string[],
}

const HotelChainManagement: React.FC = () => {
  // States for hotel chains
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([]);
  const [selectedHotelChain, setSelectedHotelChain] = useState<HotelChain | null>(null);
  const [isHotelLoading, setIsHotelLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // States for hotel chain form
  const [isAddingChain, setIsAddingChain] = useState<boolean>(false);
  const [isEditingChain, setIsEditingChain] = useState<boolean>(false);
  const [newChain, setNewChain] = useState<Partial<HotelChain>>({
    name: '',
    description: '',
    websiteUrl: '',
    headquarters: '',
    properties: 0
  });

  // States for properties
  const [hotelProperties, setHotelProperties] = useState<HotelProperty[]>([]);
  const [isPropertyLoading, setIsPropertyLoading] = useState<boolean>(false);
  const [isAddingProperty, setIsAddingProperty] = useState<boolean>(false);
  const [newProperty, setNewProperty] = useState<Partial<HotelProperty>>({
    name: '',
    location: '',
    rooms: 0,
    amenities: [],
    hotelChainId: ''
  });
  const [amenityInput, setAmenityInput] = useState<string>('');

  // Fetch hotel chains
  const fetchHotelChains = async () => {
    try {
      setIsHotelLoading(true);
      const response = await fetch('/api/hotelChain');
      if (!response.ok) {
        throw new Error('Failed to fetch hotel chains');
      }
      const hotelData: HotelChain[] = await response.json();
      setHotelChains(hotelData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred loading hotel chains');
    } finally {
      setIsHotelLoading(false);
    }
  };

  // Fetch properties for a selected hotel chain
  const fetchHotelProperties = async (chainId: string) => {
    try {
      setIsPropertyLoading(true);
      const response = await fetch(`/api/properties?chainId=${chainId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hotel properties');
      }
      const propertyData: HotelProperty[] = await response.json();
      setHotelProperties(propertyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred loading hotel properties');
    } finally {
      setIsPropertyLoading(false);
    }
  };

  // Handle hotel chain selection
  const handleSelectHotelChain = (chain: HotelChain) => {
    setSelectedHotelChain(chain);
    setShowDropdown(false);
    setSearchInput(chain.name);
    fetchHotelProperties(chain.id);
  };

  // Add a new hotel chain
//   const handleAddChain = async () => {
//     try {
//       const response = await fetch('/api/hotelChain', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newChain),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add hotel chain');
//       }

//       fetchHotelChains();
//       setIsAddingChain(false);
//       setNewChain({
//         name: '',
//         description: '',
//         websiteUrl: '',
//         headquarters: '',
//         properties: 0
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred adding hotel chain');
//     }
//   };

  // Update a hotel chain
  const handleUpdateChain = async () => {
    if (!selectedHotelChain) return;
    
    try {
      const response = await fetch(`/api/hotelChain/${selectedHotelChain.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChain),
      });

      if (!response.ok) {
        throw new Error('Failed to update hotel chain');
      }

      fetchHotelChains();
      setIsEditingChain(false);
      setSelectedHotelChain({...selectedHotelChain, ...newChain});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred updating hotel chain');
    }
  };

  // Delete a hotel chain
  const handleDeleteChain = async () => {
    if (!selectedHotelChain) return;
    
    try {
      const response = await fetch(`/api/hotelChain/${selectedHotelChain.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete hotel chain');
      }

      fetchHotelChains();
      setSelectedHotelChain(null);
      setSearchInput('');
      setHotelProperties([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred deleting hotel chain');
    }
  };

  // Add amenity to new property
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !newProperty.amenities?.includes(amenityInput)) {
      setNewProperty({
        ...newProperty,
        amenities: [...(newProperty.amenities || []), amenityInput]
      });
      setAmenityInput('');
    }
  };

  // Remove amenity from new property
  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities = [...(newProperty.amenities || [])];
    updatedAmenities.splice(index, 1);
    setNewProperty({
      ...newProperty,
      amenities: updatedAmenities
    });
  };

  // Add a new property
  const handleAddProperty = async () => {
    if (!selectedHotelChain) return;
    
    try {
      const propertyData = {
        ...newProperty,
        hotelChainId: selectedHotelChain.id
      };
      
      const response = await fetch('/api/hotelProperty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to add hotel property');
      }

      fetchHotelProperties(selectedHotelChain.id);
      setIsAddingProperty(false);
      setNewProperty({
        name: '',
        location: '',
        rooms: 0,
        amenities: [],
        hotelChainId: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred adding hotel property');
    }
  };

  // Load hotel chains on initial render
  useEffect(() => {
    fetchHotelChains();
  }, []);

  // Start editing a chain
  const startEditChain = () => {
    if (selectedHotelChain) {
      setNewChain({
        name: selectedHotelChain.name,
        description: selectedHotelChain.description,
        websiteUrl: selectedHotelChain.websiteUrl,
        headquarters: selectedHotelChain.headquarters,
        properties: selectedHotelChain.properties
      });
      setIsEditingChain(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hotel Chain Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Hotel Chain Selection */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Hotel Chain</h2>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsAddingChain(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Chain
          </button>
        </div>
        
        <div className="relative w-full">
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search hotel chains..."
            />
          </div>
          
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
              {isHotelLoading ? (
                <div className="p-4 text-center">
                  <Loader className="h-6 w-6 text-primary mx-auto animate-spin" />
                </div>
              ) : hotelChains.length > 0 ? (
                hotelChains
                  .filter(chain => chain.name.toLowerCase().includes(searchInput.toLowerCase()))
                  .map(chain => (
                    <div 
                      key={chain.id} 
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => handleSelectHotelChain(chain)}
                    >
                      <div className="font-medium">{chain.name}</div>
                      <div className="text-xs text-gray-500">{chain.properties} properties • {chain.headquarters}</div>
                    </div>
                  ))
              ) : (
                <div className="p-3 text-center text-gray-500">No hotel chains found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Selected Hotel Chain Details */}
      {selectedHotelChain && !isEditingChain && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hotel Chain Details</h2>
            <div className="flex space-x-2">
              <button 
                className="bg-primary text-white px-3 py-1 rounded-md flex items-center"
                onClick={startEditChain}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center"
                onClick={handleDeleteChain}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Name</h3>
              <p>{selectedHotelChain.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Headquarters</h3>
              <p>{selectedHotelChain.headquarters}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Website</h3>
              <p>{selectedHotelChain.websiteUrl}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Properties</h3>
              <p>{selectedHotelChain.properties}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-700">Description</h3>
              <p>{selectedHotelChain.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Hotel Chain Form */}
      {isEditingChain && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Hotel Chain</h2>
            <button 
              className="text-gray-500"
              onClick={() => setIsEditingChain(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newChain.name}
                onChange={(e) => setNewChain({...newChain, name: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={newChain.headquarters}
                onChange={(e) => setNewChain({...newChain, headquarters: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={newChain.websiteUrl}
                onChange={(e) => setNewChain({...newChain, websiteUrl: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Properties
              </label>
              <input
                type="number"
                value={newChain.properties}
                onChange={(e) => setNewChain({...newChain, properties: parseInt(e.target.value) || 0})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newChain.description}
                onChange={(e) => setNewChain({...newChain, description: e.target.value})}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={() => setIsEditingChain(false)}
            >
              Cancel
            </button>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleUpdateChain}
            >
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </button>
          </div>
        </div>
      )}
      
      {/* Add New Hotel Chain Form */}
      {/* {isAddingChain && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Hotel Chain</h2>
            <button 
              className="text-gray-500"
              onClick={() => setIsAddingChain(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newChain.name}
                onChange={(e) => setNewChain({...newChain, name: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={newChain.headquarters}
                onChange={(e) => setNewChain({...newChain, headquarters: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={newChain.websiteUrl}
                onChange={(e) => setNewChain({...newChain, websiteUrl: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Properties
              </label>
              <input
                type="number"
                value={newChain.properties}
                onChange={(e) => setNewChain({...newChain, properties: parseInt(e.target.value) || 0})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newChain.description}
                onChange={(e) => setNewChain({...newChain, description: e.target.value})}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={() => setIsAddingChain(false)}
            >
              Cancel
            </button>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleAddChain}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Chain
            </button>
          </div>
        </div>
      )} */}
      
      {/* Hotel Properties Section */}
      {selectedHotelChain && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hotel Properties</h2>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setIsAddingProperty(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Property
            </button>
          </div>
          
          {isPropertyLoading ? (
            <div className="flex justify-center p-8">
              <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {/* Add New Property Form */}
              {isAddingProperty && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Add New Property</h3>
                    <button 
                      className="text-gray-500"
                      onClick={() => setIsAddingProperty(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Name
                      </label>
                      <input
                        type="text"
                        value={newProperty.name}
                        onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newProperty.location}
                        onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Rooms
                      </label>
                      <input
                        type="number"
                        value={newProperty.rooms}
                        onChange={(e) => setNewProperty({...newProperty, rooms: parseInt(e.target.value) || 0})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amenities
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={amenityInput}
                          onChange={(e) => setAmenityInput(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="Add amenity"
                        />
                        <button
                          onClick={handleAddAmenity}
                          className="bg-primary text-white px-3 py-2 rounded-r-md"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProperty.amenities?.map((amenity, index) => (
                          <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
                            <span>{amenity}</span>
                            <button 
                              onClick={() => handleRemoveAmenity(index)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
                      onClick={() => setIsAddingProperty(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
                      onClick={handleAddProperty}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Property
                    </button>
                  </div>
                </div>
              )}
              
              {/* Properties List */}
              {hotelProperties.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {hotelProperties.map(property => (
                    <div key={property.id} className="py-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{property.name}</h3>
                        <div className="text-sm text-gray-500">{property.rooms} rooms</div>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">{property.location}</div>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-xs rounded-full px-2 py-1">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No properties found for this hotel chain.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelChainManagement;