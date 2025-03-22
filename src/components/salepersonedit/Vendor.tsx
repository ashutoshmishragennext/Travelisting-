import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Loader from '../shared/Loader';
import ContactInfo from '../vendorpage/ContectInfo';

interface VendorFormData {
  companyName: string;
  legalEntityType: string;
  taxId: string;
  establishmentYear: string;
  socialLinks: Record<string, string>;
  logo: string;
  coverImage: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  whatsappnumber: string;
  businessOpeningDays: string[];
  anotherMobileNumbers: string[];
  businessTiming: {
    start: string;
    end: string;
  };
  anotheremails: string[];
  headquartersAddress: string;
  state: string;
  city: string;
  pincode: string;
  operatingCountries: string[];
  employeeCountRange: string;
  annualRevenueRange: string;
  insuranceCoverage: Record<string, any>;
}

interface FormErrors {
  [key: string]: string;
}

interface PincodeData {
  State: string;
  City: string;
  Status: string;
}

interface VendorProfileFormProps {
  vendorId: string;
}

const VendorProfileForm = ({ vendorId }: VendorProfileFormProps) => {
  const [formData, setFormData] = useState<VendorFormData>({
    companyName: '',
    legalEntityType: '',
    taxId: '',
    establishmentYear: '',
    socialLinks: {},
    logo: '',
    coverImage: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    whatsappnumber: '',
    businessOpeningDays: [],
    anotherMobileNumbers: [],
    businessTiming: {
      start: '09:00',
      end: '17:00'
    },
    anotheremails: [],
    headquartersAddress: '',
    state: '',
    city: '',
    pincode: '',
    operatingCountries: [],
    employeeCountRange: '',
    annualRevenueRange: '',
    insuranceCoverage: {}
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vendor?id=${vendorId}`);
      const { success, data, error } = await response.json();
      
      if (success && data) {
        setFormData(data);
      } else {
        setError(error || 'Failed to fetch vendor data');
      }
    } catch (err) {
      setError('Error loading vendor data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPincodeData = async (pincode: string) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    setPincodeError(null);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const pincodeData = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          state: pincodeData.State,
          city: pincodeData.District
        }));
      } else {
        setPincodeError("Invalid pincode or no data found");
      }
    } catch (err) {
      setPincodeError("Failed to fetch pincode data");
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = 'Invalid email address';
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.primaryContactPhone && !phoneRegex.test(formData.primaryContactPhone)) {
      newErrors.primaryContactPhone = 'Invalid phone number (10 digits required)';
    }

    if (formData.whatsappnumber && !phoneRegex.test(formData.whatsappnumber)) {
      newErrors.whatsappnumber = 'Invalid WhatsApp number (10 digits required)';
    }

    const pincodeRegex = /^\d{6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode (6 digits required)';
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (formData.taxId && !gstRegex.test(formData.taxId)) {
      newErrors.taxId = 'Invalid GST number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePincodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pincode: value }));
    
    if (value.length === 6) {
      await fetchPincodeData(value);
    }
  };

  const handleContactInfoUpdate = (contactData: Partial<VendorFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...contactData
    }));
  };

  const handleArrayAdd = (field: keyof VendorFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const handleArrayRemove = (field: keyof VendorFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/vendor?id=${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to save vendor data');
      }
    } catch (err) {
      setError('Error saving vendor data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 bg-white rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-gray-900">Vendor Profile</CardTitle>
            <p className="text-sm text-gray-500">Manage your company information and business details</p>
          </CardHeader>
          
          {error && (
            <Alert variant="destructive" className="mx-6 mt-4">
              <AlertDescription className="flex items-center justify-between">
                {error}
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mx-6 mt-4 bg-green-50 border-green-200">
              <AlertDescription className="flex items-center text-green-800">
                <Check className="mr-2" size={16} />
                Vendor profile saved successfully
              </AlertDescription>
            </Alert>
          )}

          <CardContent className="space-y-8 p-6">
            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name*</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border ${
                      errors.companyName ? 'border-red-500 ring-red-200' : 'border-gray-200'
                    } px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                    required
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST No.</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border ${
                      errors.taxId ? 'border-red-500 ring-red-200' : 'border-gray-200'
                    } px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                  />
                  {errors.taxId && (
                    <p className="text-sm text-red-500">{errors.taxId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Establishment Year</label>
                  <input
                    type="number"
                    name="establishmentYear"
                    value={formData.establishmentYear}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            {/* <ContactInfo
              data={{
                primaryContactName: formData.primaryContactName,
                primaryContactPhone: formData.primaryContactPhone,
                whatsappNumber: formData.whatsappnumber,
                primaryContactEmail: formData.primaryContactEmail,
                anotherMobileNumbers: formData.anotherMobileNumbers,
                anotheremails: formData.anotheremails,
                businessOpeningDays: formData.businessOpeningDays,
                businessTiming: formData.businessTiming
              }}
              updateData={handleContactInfoUpdate}
            /> */}

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className={`w-full rounded-md border ${
                      errors.pincode ? 'border-red-500 ring-red-200' : 'border-gray-200'
                    } px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500">{errors.pincode}</p>
                  )}
                  {pincodeLoading && (
                    <div className="mt-2">
                      <Loader />
                    </div>
                  )}
                  {pincodeError && (
                    <p className="text-sm text-red-500 mt-2">{pincodeError}</p>
                  )}
                </div>

                {formData.state && formData.city && (
                  <div className="md:col-span-2 ">
                    <h1 className="text-sm font-bold text-gray-900">State: {formData.state}</h1>
                    <h1 className="text-sm font-bold text-gray-900 mt-2">City: {formData.city}</h1>
                  </div>
                )}

                <div className="md:col-span-2 space-y-2">
                 
                  <label className="text-sm font-medium text-gray-700">Headquarters Address</label>
                  <textarea
                    name="headquartersAddress"
                    value={formData.headquartersAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Operating Countries Section */}
            {/* <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Operating Countries</h2>
              </div>
              
              <div className="space-y-4">
                {formData.operatingCountries.map((country, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        const newCountries = [...formData.operatingCountries];
                        newCountries[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          operatingCountries: newCountries
                        }));
                      }}
                      className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter country name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleArrayRemove('operatingCountries', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleArrayAdd('operatingCountries')}
                  className="flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Country</span>
                </Button>
              </div>
            </div> */}

            {/* Business Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Employee Count Range</label>
                  <select
                    name="employeeCountRange"
                    value={formData.employeeCountRange}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Select Range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Annual Revenue Range</label>
                  <select
                    name="annualRevenueRange"
                    value={formData.annualRevenueRange}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Select Range</option>
                    <option value="0-100K">0-100K</option>
                    <option value="100K-500K">100K-500K</option>
                    <option value="500K-1M">500K-1M</option>
                    <option value="1M-5M">1M-5M</option>
                    <option value="5M+">5M+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Insurance Coverage Section */}
            {/* <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Insurance Coverage</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Insurance Type</label>
                  <select
                    name="insuranceType"
                    value={formData.insuranceCoverage.type || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        insuranceCoverage: {
                          ...prev.insuranceCoverage,
                          type: e.target.value
                        }
                      }));
                    }}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Select Insurance Type</option>
                    <option value="general">General Liability</option>
                    <option value="professional">Professional Liability</option>
                    <option value="cyber">Cyber Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Coverage Amount</label>
                  <input
                    type="text"
                    name="coverageAmount"
                    value={formData.insuranceCoverage.amount || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        insuranceCoverage: {
                          ...prev.insuranceCoverage,
                          amount: e.target.value
                        }
                      }));
                    }}
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Enter coverage amount"
                  />
                </div>
              </div>
            </div> */}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default VendorProfileForm;