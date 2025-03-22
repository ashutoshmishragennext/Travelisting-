import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, MapPin, Clock, Loader2 } from 'lucide-react';
import VendorServiceForm from '../vendorpage/ServiceInfo';

interface Service {
  id: string;
  name: string;
  description: string;
  categoryName: string;
}

interface VendorServiceDetails {
  id: string;
  experienceYears: number;
  pricingModel: string;
  description: string;
  price: number;
  location: string;
  modeOfService: string;
  photo: string;
  currency: string;
  isActive: boolean;
}

interface VendorService {
  service: Service;
  vendorServiceDetails: VendorServiceDetails;
}

interface VendorServicesPageProps {
  vendorId: string;
}

const VendorServicesPage: React.FC<VendorServicesPageProps> = ({ vendorId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{services: any[]}>({ services: [] });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch vendor services and available services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorServicesResponse = await fetch(`/api/vendorservice?vendorId=${vendorId}`);
        const vendorServicesData = await vendorServicesResponse.json();
        if (vendorServicesData.success) {
          setVendorServices(vendorServicesData.services);
        }

        const servicesResponse = await fetch('/api/service');
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [vendorId]);

  const handleFormUpdate = (newData: Partial<{ services?: any[] }>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleCardClick = (vendorService: VendorService) => {
    // Transform the vendor service data to match the form data structure
    const formattedService = {
      serviceId: vendorService.service.id,
      experienceYears: vendorService.vendorServiceDetails.experienceYears,
      pricingModel: vendorService.vendorServiceDetails.pricingModel,
      description: vendorService.vendorServiceDetails.description,
      price: vendorService.vendorServiceDetails.price,
      location: vendorService.vendorServiceDetails.location,
      modeOfService: vendorService.vendorServiceDetails.modeOfService,
      photo: vendorService.vendorServiceDetails.photo,
      currency: vendorService.vendorServiceDetails.currency,
      isActive: vendorService.vendorServiceDetails.isActive,
      id: vendorService.vendorServiceDetails.id
    };

    setFormData({ services: [formattedService] });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmitServices = async () => {
    if (formData.services.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one service",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Submit each service
      const submitPromises = formData.services.map(service =>
        fetch('/api/vendorservice', {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vendorId,
            ...service,
          }),
        })
      );

      await Promise.all(submitPromises);

      // Refresh vendor services
      const updatedServices = await fetch(`/api/vendorservice?vendorId=${vendorId}`);
      const updatedData = await updatedServices.json();
      if (updatedData.success) {
        setVendorServices(updatedData.services);
      }

      setShowForm(false);
      setFormData({ services: [] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: `Services ${isEditing ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Services</h1>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setFormData({ services: [] });
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Services
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Service' : 'Add New Services'}</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorServiceForm
              vendorId={vendorId}
              data={formData}
              updateData={handleFormUpdate}
             
            />
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({ services: [] });
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitServices}
                disabled={isLoading || formData.services.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  isEditing ? 'Update Service' : 'Submit Services'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendorServices.map((vendorService) => (
          <Card 
            key={vendorService.vendorServiceDetails.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(vendorService)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {vendorService.service.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{vendorService.vendorServiceDetails.description}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{vendorService.vendorServiceDetails.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{vendorService.vendorServiceDetails.experienceYears} years experience</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {vendorService.vendorServiceDetails.price} {vendorService.vendorServiceDetails.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vendorService.vendorServiceDetails.pricingModel}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vendorService.vendorServiceDetails.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vendorService.vendorServiceDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {vendorService.vendorServiceDetails.modeOfService}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorServicesPage;