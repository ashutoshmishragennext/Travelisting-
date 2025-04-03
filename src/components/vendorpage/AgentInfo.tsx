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
  type: boolean;
  type2: boolean;
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

const AgentInfo: React.FC<ContactInfoProps> = ({ data, updateData, handleNextStep }) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<string[]>(["Flight"]);

  const unUsedVars = () => {
  }

  const [flightData, setFlightData] = useState<FlightData>({
    type: true,
    type2: false,
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
  const user = useCurrentUser();

  useEffect( () => {
      setError2(null)
  },[flightData.type , flightData.type2])

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
  
 
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader/></div>;
  }
  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }
  const handleSubmit = () => {
    let data : any = [];
    
    if(flightData.type && flightData.type2) {
        data.push("B2B B2C");
    } else if(flightData.type) {
      data.push("B2B");
    } else if(flightData.type2) {
      data.push("B2C");
    } else {
      setError2("Please select at least one value");
      return;
    }

    updateData({ bussinessType : data });

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
          <div>
            {selectedServices.includes('Flight') && (
            <div className="mb-6 space-y-4">
              
            <div className=' space-y-4'>
              <label htmlFor="bussiness" className=''>Bussiness Type</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flight-domestic"
                    checked={flightData.type}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type: !flightData.type}))}
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
                    checked={flightData.type2}
                    onCheckedChange={() => setFlightData(prev => ({...prev, type2: !flightData.type2 }))}
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
              {error2 && (
              <p className=" text-xs text-red-500"> {error2}</p>
            )}
            </div>

            
          )}

          {(flightData.type || flightData.type2) && (
              <div className="mt-2 p-3 bg-amber-50 rounded-md text-sm text-gray-700">
                {flightData.type && !flightData.type2 && (
                  <p>B2B: Business to Business - You provide services to other businesses.</p>
                )}
                {!flightData.type && flightData.type2 && (
                  <p>B2C: Business to Customer - You provide services directly to individual customers.</p>
                )}
                {flightData.type && flightData.type2 && (
                  <p>You've selected both B2B (Business to Business) and B2C (Business to Customer), indicating that you serve both other businesses and individual customers.</p>
                )}
              </div>
            )}
          
          
          </div>
          <button
            className="w-full bg-amber-500 text-white relative bottom-0  py-3 px-6 rounded-lg mt-4 hover:bg-amber-600 transition duration-300"
            onClick={handleSubmit}
          >
            Save and Continue
          </button>
        </div>
      </div>
      {/* right side mobile preview */}
      <div className="w-full md:w-1/2 flex justify-center space-x-4 items-start">
        <div className="relative bg-gray-900 rounded-3xl p-3 shadow-xl max-w-xs">
          <div className="relative bg-white rounded-2xl overflow-hidden h-[500px] w-64">
            {}
            <div>
              {}
              <img 
                src="/pic1.png"
                alt="Business Cover"
                className="w-full h-24 object-cover"
              />
              <div className="p-4 relative">
                {}
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
                {}
                                {}
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
                {}
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
                {}
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