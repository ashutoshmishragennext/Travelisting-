import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import ImageCropper from '../shared/imagecrop/Imagecrop';


interface CustomerImagesPageProps {
  vendorId: string;
}

interface VendorData {
  ourcustomers: string[];
}

const CustomerImagesPage: React.FC<CustomerImagesPageProps> = ({ vendorId }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerImages, setCustomerImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);

  // Fetch existing customer images
  useEffect(() => {
    const fetchCustomerImages = async () => {
      try {
        const response = await fetch(`/api/vendor?id=${vendorId}`);
        const data = await response.json();
        
        if (data.success && data.data.ourcustomers) {
          setCustomerImages(data.data.ourcustomers);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch customer images",
          variant: "destructive",
        });
      }
    };

    fetchCustomerImages();
  }, [vendorId]);

  const handleCroppedImage = (croppedImage: string) => {
    setNewImage(croppedImage);
  };

  const handleSubmitImage = async () => {
    if (!newImage) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/vendor?id=${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ourcustomers: [...customerImages, newImage]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCustomerImages(prev => [...prev, newImage]);
        setShowForm(false);
        setNewImage(null);
        toast({
          title: "Success",
          description: "Customer image added successfully",
        });
      }
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

  const handleDeleteImage = async (indexToRemove: number) => {
    setIsLoading(true);
    try {
      const newImages = customerImages.filter((_, index) => index !== indexToRemove);
      
      const response = await fetch(`/api/vendor?id=${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ourcustomers: newImages
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCustomerImages(newImages);
        toast({
          title: "Success",
          description: "Customer image deleted successfully",
        });
      }
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
        <h1 className="text-2xl font-bold">Customer Images</h1>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setNewImage(null);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Image
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Customer Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <ImageCropper
                  onImageCropped={handleCroppedImage}
                  
                  type="logo"
                />
              </div>
              
              {newImage && (
                <div className="mt-4">
                  <img
                    src={newImage}
                    alt="Preview"
                    className="w-full max-w-md h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setNewImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitImage}
                  disabled={isLoading || !newImage}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Image'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customerImages.map((image, index) => (
          <Card key={index} className="group relative">
            <CardContent className="p-3">
              <img
                src={image}
                alt={`Customer ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteImage(index);
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerImagesPage;