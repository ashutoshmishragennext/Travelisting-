
import { X } from "lucide-react";
import React, { useEffect, useState } from 'react';
import Loader from '../shared/Loader';
import { Checkbox } from "../ui/checkbox";

import { useCurrentUser } from '@/hooks/auth';


interface UserData {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  emailVerifToken: null;
  mobile: string;
  role: string;
  vendorProfileId: null;
  profilePic: null;
  coverPic: null;
  secureProfilePic: null;
  createdBy: null;
  createdAt: string;
  updatedAt: string;
  vendorProfile: null;
}

interface ContactInfoData {
  primaryContactName?: string;
  primaryContactPhone?: string;
  whatsappNumber?: string;
  primaryContactEmail?: string;
  anotherMobileNumbers: string[];
  anotheremails: string[];
  businessOpeningDays?: string[];
  businessTiming?: { 
    start: string; 
    end: string;
  };
  hotelIds ?: string[];
  isDomestic ?: boolean;
  isInternational ?: boolean;
  bussinessType ?: string;
  hotels ?: string[];

}

interface HotelChain {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  headquarters: string;
  properties: number;
  createdAt: string;
}

interface ContactInfoProps {
  data: ContactInfoData;
  updateData: (data: Partial<ContactInfoData>) => void;
  handleNextStep: () => void;
}

interface FlightData {
  type: 'International' | 'Domestic';
  type2: 'International' | 'Domestic';
  type3 : "B2B" | "B2C";
  source: string;
  destination: string;
  image: string | null;
  expiryDate: string;
  contacts: {
    phones: string[];
    emails: string[];
  };
}

const serviceTypes = ["Flight", "Hotel"];

interface HotelChain2 {
    id : string;
    name : string;
}

const AgentInfo: React.FC<ContactInfoProps> = ({ data, updateData, handleNextStep }) => {
  // Base contact info states
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [sameAsPhone, setSameAsPhone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fromInput , setFromInput] = useState<string>("");
  const [showFromDropdown , setShowFromDropdown] = useState<boolean>(false);

  // New states for service selection
  const [selectedServices, setSelectedServices] = useState<string[]>(["Flight"]);
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([]);
  const [selectedHotelChains, setSelectedHotelChains] = useState<HotelChain2[]>([]); // Changed to array for multiple selection
  const [isHotelLoading, setIsHotelLoading] = useState<boolean>(false);
  
  const unUsedVars = () => {
    
  }
  // Flight specific states
  const [flightData, setFlightData] = useState<FlightData>({
    type: 'Domestic',
    type2: 'Domestic',
    type3 : "B2B",
    source: '',
    destination: '',
    image: null,
    expiryDate: '',
    contacts: {
      phones: [],
      emails: []
    }
  });
  const [newFlightPhone, setNewFlightPhone] = useState<string>('');
  const [newFlightEmail, setNewFlightEmail] = useState<string>('');
  
  const user = useCurrentUser();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users?id=${user?.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData: UserData[] = await response.json();
        
        if (userData && userData.length > 0) {
          const user = userData[0];
          updateData({
            primaryContactName: user.name,
            primaryContactPhone: user.mobile,
            primaryContactEmail: user.email,
          });
          
          // Initialize flight contacts with the user's default contact info
          setFlightData(prev => ({
            ...prev,
            contacts: {
              phones: [user.mobile],
              emails: [user.email]
            }
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Fetch hotel chains when Hotel is selected
  useEffect(() => {
      fetchHotelChains();
  }, []);

  
  const fetchHotelChains = async () => {
    try {
      setIsHotelLoading(true);
      const response = await fetch('http://localhost:3000/api/hotelChain');
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

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleAddPhone = () => {
    if (newPhone) {
      if (!data.primaryContactPhone) {
        updateData({ 
          primaryContactPhone: newPhone,
          whatsappNumber: sameAsPhone ? newPhone : data.whatsappNumber 
        });
      } else {
        const updatedNumbers = [...(data.anotherMobileNumbers || []), newPhone];
        updateData({ anotherMobileNumbers: updatedNumbers });
      }
      setNewPhone('');
    }
  };

  const handleAddEmail = () => {
    if (newEmail) {
      if (!data.primaryContactEmail) {
        updateData({ primaryContactEmail: newEmail });
      } else {
        const updatedEmails = [...(data.anotheremails || []), newEmail];
        updateData({ anotheremails: updatedEmails });
      }
      setNewEmail('');
    }
  };
  
  const handleAddFlightPhone = () => {
    if (newFlightPhone) {
      setFlightData(prev => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          phones: [...prev.contacts.phones, newFlightPhone]
        }
      }));
      setNewFlightPhone('');
    }
  };
  
  const handleAddFlightEmail = () => {
    if (newFlightEmail) {
      setFlightData(prev => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          emails: [...prev.contacts.emails, newFlightEmail]
        }
      }));
      setNewFlightEmail('');
    }
  };
  
  const handleRemoveFlightPhone = (index: number) => {
    setFlightData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        phones: prev.contacts.phones.filter((_, i) => i !== index)
      }
    }));
  };
  
  const handleRemoveFlightEmail = (index: number) => {
    setFlightData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        emails: prev.contacts.emails.filter((_, i) => i !== index)
      }
    }));
  };

  // New function to handle hotel chain toggling
  const handleHotelChainToggle = (hotelId: string, hotelName: string) => {
    setSelectedHotelChains(prev => {
        const isAlreadySelected = prev.some(hotel => hotel.id === hotelId);
        
        if (isAlreadySelected) {
            // Remove the hotel if it's already selected (toggle off)
            return prev.filter(hotel => hotel.id !== hotelId);
        } else {
            // Add the hotel if it's not selected
            return [...prev, { id: hotelId, name: hotelName }];
        }
    });

    setShowFromDropdown(false);
    setFromInput("");
};

  
  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: 'phone' | 'email' | 'flightPhone' | 'flightEmail'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (type) {
        case 'phone':
          handleAddPhone();
          break;
        case 'email':
          handleAddEmail();
          break;
        case 'flightPhone':
          handleAddFlightPhone();
          break;
        case 'flightEmail':
          handleAddFlightEmail();
          break;
      }
    }
  };
  

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader/></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const handleSubmit = () => {

    updateData({ bussinessType : flightData.type3 });
    updateData({ isDomestic : flightData.type === "Domestic" });
    updateData({ isInternational : flightData.type2 === "International" });
    updateData({ bussinessType : flightData.type3 });
    let data : any = [];
    selectedHotelChains.map((item) => {
        data.push(item.id);
    })    
    updateData({ hotelIds : data });


    handleNextStep()
  }


  return (
    <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 p-6">
      <div className="w-full md:w-1/2">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Add Listing Details
          </h2>
          <div className="flex gap-2 mb-6">
            <div className="border-b-4 border-amber-500 w-14"></div>
            <div className="border-b-4 border-amber-500 w-14"></div>
            <div className="border-b-4 border-amber-500 w-14"></div>
            <div className="border-b-4 border-gray-200 w-14"></div>
          </div>
        </div>
        
        <div onClick={unUsedVars} className=" hidden">

        </div>
        <div className="space-y-4 mb-0 min-h-[60vh] relative flex flex-col justify-between ">
          {/* Service Type Selection */}

          <div>
            <div className="mb-6">
                <h3 className="text-md font-semibold mb-3 text-gray-700">Select Service Types</h3>
                <div className="flex flex-wrap gap-3">
                {serviceTypes.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`service-${service}`}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                        className="h-4 w-4 border-amber-500 text-amber-500 rounded"
                    />
                    <label 
                        htmlFor={`service-${service}`} 
                        className="text-sm text-gray-600 cursor-pointer"
                    >
                        {service}
                    </label>
                    </div>
                ))}
                </div>
            </div>

                    {/* Flight Details */}
            
            {selectedServices.includes('Flight') && (
            <div className="mb-6 space-y-4">
              <h3 className="text-md font-semibold mb-3 text-gray-700">Flight List Type</h3>
              
              {/* Flight Type */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flight-domestic"
                    checked={flightData.type === 'Domestic'}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type: flightData.type === 'Domestic' ? 'International' : 'Domestic'}))}
                    className="h-4 w-4 border-amber-500 text-amber-500 rounded"
                  />
                  <label 
                    htmlFor="flight-domestic" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Domestic
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flight-international"
                    checked={flightData.type2 === 'International'}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type2: flightData.type2 === 'International' ? 'Domestic' : 'International'}))}
                    className="h-4 w-4 border-amber-500 text-amber-500 rounded"
                  />
                  <label 
                    htmlFor="flight-international" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    International
                  </label>
                </div>
              </div>

            <div className=' space-y-4'>
              <label htmlFor="bussiness" className=''>Lister type</label>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flight-domestic"
                    checked={flightData.type3 === 'B2B'}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type3: 'B2B'}))}
                    className="h-4 w-4 border-amber-500 text-amber-500 rounded"
                  />
                  <label 
                    htmlFor="flight-domestic" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    B2B
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flight-international"
                    checked={flightData.type3 === 'B2C'}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type3: "B2C" }))}
                    className="h-4 w-4 border-amber-500 text-amber-500 rounded"
                  />
                  <label 
                    htmlFor="flight-international" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    B2C
                  </label>
                </div>
              </div>
              </div>
              
              {/* Flight Contact Details */}
              {/* <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">Flight Contact Details</h4>
                 */}
                {/* Phone Numbers */}
                {/* <div className="mb-3">
                  <div className="flex gap-2">
                    <div className="w-1/4 relative">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-gray-700 border border-gray-200">
                        <span>+91</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="w-3/4">
                      <Input
                        type="text"
                        value={newFlightPhone}
                        onChange={(e) => setNewFlightPhone(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'flightPhone')}
                        className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
                        placeholder="Add Phone Number"
                      />
                    </div>
                  </div>
                  <button 
                    className="text-amber-500 text-sm hover:underline flex items-center mt-1"
                    onClick={handleAddFlightPhone}
                  >
                    + Add Phone Number
                  </button>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {flightData.contacts.phones.map((phone, index) => (
                      <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
                        <span>{phone}</span>
                        <button 
                          onClick={() => handleRemoveFlightPhone(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <Input
                    type="email"
                    value={newFlightEmail}
                    onChange={(e) => setNewFlightEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'flightEmail')}
                    className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
                    placeholder="Add Email Address"
                  />
                  <button 
                    className="text-amber-500 text-sm hover:underline flex items-center mt-1"
                    onClick={handleAddFlightEmail}
                  >
                    + Add Email Address
                  </button>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {flightData.contacts.emails.map((email, index) => (
                      <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
                        <span>{email}</span>
                        <button 
                          onClick={() => handleRemoveFlightEmail(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
               */}

            </div>
          )}

          
          {/* Hotel Chain Selection - Modified for multiple selection */}
          {selectedServices.includes('Hotel') && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-3 text-gray-700">Select Hotel Chains</h3>
              {isHotelLoading ? (
                <div className="flex items-center justify-center p-4"><Loader /></div>
              ) : (
                <div className="space-y-3">
                  
                    <div className="relative w-full">
                    <label className="block text-sm font-medium text-gray-700">
                        Hotel Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* <Plane className="h-5 w-5 text-gray-400" /> */}
                        </div>
                        <input
                        type="text"
                        value={fromInput}
                        onChange={(e) => setFromInput(e.target.value)}
                        onFocus={() => setShowFromDropdown(true)}
                        className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Hotel Name"
                        />
                    </div>
                    {showFromDropdown && hotelChains.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                        {isLoading ? (
                            <div className="p-2 text-center text-gray-500">
                            Loading...
                            </div>
                        ) : (
                            hotelChains.filter((item) => item.name.toLowerCase().includes(fromInput.toLowerCase())).map((hotel) => (
                                <div 
                                key={`hotel-${hotel.id}`} 
                                className="text-sm text-gray-600 cursor-pointer pb-2"
                                onClick={() => handleHotelChainToggle(hotel.id , hotel.name)}
                            >
                                <div className="font-medium">{hotel.name}</div>
                                <div className="text-xs text-gray-400">{hotel.properties} properties • {hotel.headquarters}</div>
                            </div>
                            ))
                        )}
                        </div>
                    )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                    {selectedHotelChains.map((hotel, index) => (
                      <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
                        <span>{hotel.name}</span>
                        <button 
                          onClick={() => handleRemoveFlightPhone(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X onClick={() => handleHotelChainToggle(hotel.id , hotel.name)} className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
          

          {/* Save and Continue Button */}
          <button
            className="w-full bg-amber-500 text-white relative bottom-0  py-3 px-6 rounded-lg mt-4 hover:bg-amber-600 transition duration-300"
            onClick={handleSubmit}
          >
            Save and Continue
          </button>
        </div>
      </div>

      {/* Right Side - Mobile Preview */}
      <div className="w-full md:w-1/2 flex justify-center space-x-4 items-start">
        <div className="relative bg-gray-900 rounded-3xl p-3 shadow-xl max-w-xs">
          <div className="relative bg-white rounded-2xl overflow-hidden h-[500px] w-64">
            {/* Preview Content */}
            <div>
              {/* Cover Image */}
              <img 
                src="/pic1.png"
                alt="Business Cover"
                className="w-full h-24 object-cover"
              />
              
              <div className="p-4 relative">
                {/* Business Card */}
                <div className="bg-white rounded-lg shadow-md p-3 mb-4 -mt-6 relative z-10">
                  <div className="flex items-center">
                    <div className="w-14 h-14 mr-3 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-400">CW</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Cafe Wink</h3>
                      <p className="text-xs text-gray-500">Restaurant and Coffee</p>
                      <p className="text-xs text-gray-500">
                        {data.primaryContactName ? `Contact: ${data.primaryContactName}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Selected Services */}
                {selectedServices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.map(service => (
                        <span key={service} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                                {/* Flight Info (if selected) */}
                {selectedServices.includes('Flight') && (flightData.source || flightData.destination) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Flight Details</h4>
                    <div className="bg-gray-50 rounded-md p-2">
                      <p className="text-xs mb-1">
                        <span className="font-medium">{flightData.type}</span> Flight
                      </p>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{flightData.source || "From"}</p>
                        <span className="text-xs">→</span>
                        <p className="text-sm font-medium">{flightData.destination || "To"}</p>
                      </div>
                      {flightData.expiryDate && (
                        <p className="text-xs text-amber-600">
                          Deal expires on {new Date(flightData.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Reviews Section */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Reviews</h4>
                  <div className="flex items-center">
                    <div className="flex text-amber-500">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">(101 Reviews)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Open until 9:00 PM today - 9:30 AM to 9:00 PM</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">Message</button>
                  <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">Call</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;