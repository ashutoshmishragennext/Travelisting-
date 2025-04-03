import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '../ui/input';
import { useCurrentUser } from '@/hooks/auth';

// Define the VendorData type based on the actual API response
interface VendorData {
  id: string;
  userId: string;
  companyName: string;
  legalEntityType: string | null;
  taxId: string | null;
  establishmentYear: string | null;
  socialLinks: string | null;
  logo: string;
  isDomestic: boolean;
  isInternational: boolean;
  coverImage: string;
  hotelChainIds: string | null;
  pictures: string | null;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  whatsappnumber: string | null;
  headquartersAddress: string;
  state: string;
  city: string;
  pincode: string;
  ourcustomers: string | null;
  operatingCountries: string | null;
  employeeCountRange: string | null;
  annualRevenueRange: string | null;
  regulatoryLicenses: string | null;
  insuranceCoverage: string | null;
  businessOpeningDays: string[];
  anotherMobileNumbers: string | null;
  bussinessType: string;
  advertisment: string | null;
  anotheremails: string | null;
  businessTiming: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<VendorData>>({});
  const router = useRouter();
  const user = useCurrentUser()

  // Fetch vendor data
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/vendor?userId=${user?.id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        
        const data = await response.json();
        // The API returns an array, so we take the first item
        setVendor(data[0]);
        setFormData(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle business days selection
  const handleDaySelection = (day: string) => {
    setFormData((prev) => {
      const currentBusinessDays = prev.businessOpeningDays || [];
      
      if (currentBusinessDays.includes(day)) {
        return {
          ...prev,
          businessOpeningDays: currentBusinessDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          businessOpeningDays: [...currentBusinessDays, day]
        };
      }
    });
  };

  const handlePincodeChange = async (pincode: string) => {
      const cleanedPincode = pincode.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({
        ...prev,
          pincode : cleanedPincode,
      }));
      if (cleanedPincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${cleanedPincode}`
          );
          const data = await response.json();
  
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
              const state= postOffice.State;
              const city= postOffice.District;
              if(city && state) {
                setFormData((prev) => ({
                  ...prev,
                    city : city,
                    state : state
                }));
              }
          } 
          // else {
          //   updateData({ state: "", city: "" });
          //   toast({
          //     title: "Invalid pincode",
          //     description: "Please enter a valid 6-digit pincode",
          //     variant: "destructive",
          //   });
          // }
        } catch (error) {
          console.log("Error" ,error);
          
        } finally {
        }
      }
    };

            

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send a PUT or PATCH request to update the vendor
      setVendor(formData as VendorData);
      setIsEditing(false);
      
      // Simulate API update
      const response = await fetch(`/api/vendor?id=${vendor?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vendor data');
      }
      
      const updatedVendor = await response.json();
      setVendor(updatedVendor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Cover Image */}
          {vendor?.coverImage && (
            <div className="relative h-48 w-full">
              <Image 
                src={vendor.coverImage}
                alt="Company Cover"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          )}

          {/* Header Section with Logo */}
          <div className="p-6 bg-white shadow-sm relative">
            <div className="flex flex-col md:flex-row md:items-center">
              {vendor?.logo && (
                <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 md:mb-0 md:mr-6">
                  <Image 
                    src={vendor.logo}
                    alt="Company Logo"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-primary">{vendor?.companyName}</h1>
                    <p className="text-gray-600">{vendor?.bussinessType} Business</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="bussinessType" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      id="bussinessType"
                      name="bussinessType"
                      value={formData.bussinessType || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="B2B" className='hover:bg-primary'>B2B</option>
                      <option value="B2C">B2C</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="primaryContactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Contact Name
                    </label>
                    <input
                      type="text"
                      id="primaryContactName"
                      name="primaryContactName"
                      value={formData.primaryContactName || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryContactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      id="primaryContactEmail"
                      name="primaryContactEmail"
                      value={formData.primaryContactEmail || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="primaryContactPhone"
                      name="primaryContactPhone"
                      value={formData.primaryContactPhone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsappnumber" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappnumber"
                      name="whatsappnumber"
                      value={formData.whatsappnumber || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="headquartersAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="headquartersAddress"
                      name="headquartersAddress"
                      value={formData.headquartersAddress || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
{/* 
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div> */}

                    <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                      <Input
                        type="text"
                        value={formData.pincode || ""}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
                        placeholder="Pincode"
                        maxLength={6}
                        disabled={loading}
                      />
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Business Coverage</p>
                  <div className="flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isDomestic"
                        checked={formData.isDomestic}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary focus:ring-primary bg-primary border-gray-300 rounded"
                      />
                      <span className="ml-2">Domestic</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isInternational"
                        checked={formData.isInternational}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary focus:ring-primary bg-primary border-gray-300 rounded"
                      />
                      <span className="ml-2">International</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Business Opening Days</p>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDaySelection(day)}
                        className={`px-3 py-1 rounded-md ${
                          formData.businessOpeningDays?.includes(day)
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 transition flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(vendor || {});
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {vendor ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Profile Details</h3>
                        <div className="space-y-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-500">Agency Name</p>
                            <p className="text-lg font-medium text-primary">{vendor.companyName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Business Type</p>
                            <p className="text-lg">{vendor.bussinessType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Business Coverage</p>
                            <div className="flex space-x-2">
                              {vendor.isDomestic && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">Domestic</span>
                              )}
                              {vendor.isInternational && (
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm">International</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Primary Contact</h3>
                        <div className="space-y-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-lg">{vendor.primaryContactName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg">{vendor.primaryContactEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-lg">{vendor.primaryContactPhone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <div className="space-y-4 mt-2">
                          <div>
                            {/* <p className="text-sm text-gray-500">Headquarters</p> */}
                            <p className="text-lg">{vendor.headquartersAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">City, State</p>
                            <p className="text-lg">{`${vendor.city}, ${vendor.state} - ${vendor.pincode}`}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Business Hours</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Operating Days</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {days.map((day) => (
                              <span
                                key={day}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  vendor.businessOpeningDays?.includes(day)
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                          <p className="mt-1">
                            {new Date(vendor.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">No vendor data available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
>>>>>>> origin/backend3.0
