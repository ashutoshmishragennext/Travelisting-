import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/auth';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AdTypeForm from './Advertismentcard';

type AdvertisementType = {
  id: string;
  name: string;
  description: string;
  price: string;
  timePeriod : string;
  image?: string;
  width: string;
  height: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

const AdvertisementDefinitionPage = () => {
  const [adTypes, setAdTypes] = useState<AdvertisementType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdvertisementType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = useCurrentUser();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timePeriod : '',
    price: '1000',
    image: '',
    width: '800',
    height: '600',
    createdBy: user?.id || '', 
  });

  // Fetch advertisement types from API
  const fetchAdTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/advertisementdefination');
      if (!response.ok) {
        throw new Error('Failed to fetch advertisement types');
      }
      const data = await response.json();

      console.log('Fetched advertisement types:', data);
      
      // Map API data to match component structure
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price || '1000',
        image: item.image || '',
        width: item.width || '800',
        height: item.height || '600',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdBy: item.createdBy
      }));
      
      setAdTypes(mappedData);
    } catch (error) {
      console.error('Error fetching advertisement types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advertisement types',
        variant: 'destructive',
      });
      // Set fallback data if API fails
      setAdTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdTypes();
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      price: '1000',
      timePeriod : '',
      image: '',
      width: '800',
      height: '600',
      createdBy: user?.id || '',
    });
    setShowForm(true);
  };

  const handleEdit = (ad: AdvertisementType) => {
    setIsEditing(true);
    setCurrentAd(ad);
    setFormData({
      name: ad.name,
      description: ad.description,
      price: ad.price,
      image: ad.image || '',
      timePeriod : ad.timePeriod,
      width: ad.width,
      height: ad.height,
      createdBy: ad.createdBy,
    });
    setShowForm(true);
  };

  const handleDelete = (ad: AdvertisementType) => {
    setCurrentAd(ad);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentAd) {
      try {
        const response = await fetch(`/api/advertisementdefination/${currentAd.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete advertisement type');
        }
        
        toast({
          title: 'Success',
          description: `"${currentAd.name}" has been deleted successfully`,
        });
        
        // Update local state
        setAdTypes(adTypes.filter(ad => ad.id !== currentAd.id));
      } catch (error) {
        console.error('Error deleting advertisement type:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete advertisement type',
          variant: 'destructive',
        });
      }
      
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Adapt formData to match API expectations
      const apiData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        width: formData.width,
        timePeriod : formData.timePeriod,
        height: formData.height,
        createdBy: user?.id, 
      };
      
      if (isEditing && currentAd) {
        // Update existing ad type
        const response = await fetch(`/api/advertisementdefination/${currentAd.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update advertisement type');
        }
        
        const updatedAd = await response.json();
        
        // Update local state
        setAdTypes(adTypes.map(ad => 
          ad.id === currentAd.id ? {
            ...ad,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            timePeriod : formData.timePeriod,
            image: formData.image,
            width: formData.width,
            height: formData.height,
            updatedAt: new Date().toISOString()
          } : ad
        ));
        
        toast({
          title: 'Success',
          description: `"${formData.name}" has been updated successfully`,
        });
      } else {
        // Add new ad type
        const response = await fetch('/api/advertisementdefination', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create advertisement type');
        }
        
        const newAd = await response.json();
        
        // Add to local state
        const formattedNewAd: AdvertisementType = {
          id: newAd.id,
          name: newAd.name,
          description: newAd.description || '',
          price: newAd.price || '1000',
          image: newAd.image || '',
          timePeriod : newAd.timePeriod,
          width: newAd.width || '800',
          height: newAd.height || '600',
          createdAt: newAd.createdAt,
          updatedAt: newAd.updatedAt,
          createdBy: newAd.createdBy
        };
        
        setAdTypes([...adTypes, formattedNewAd]);
        
        toast({
          title: 'Success',
          description: `"${formData.name}" has been created successfully`,
        });
      }
    } catch (error) {
      console.error('Error saving advertisement type:', error);
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update advertisement type' 
          : 'Failed to create advertisement type',
        variant: 'destructive',
      });
    }
    
    setShowForm(false);
  };

  return (
    <div className="p-6 h-screen flex">
      {/* Left side - Table (70%) */}
      <div className={`${showForm ? 'w-8/12' : 'w-full'} transition-all duration-300 pr-3`}>
        <Card className="w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Advertisement Type Definitions</CardTitle>
              <CardDescription>
                Define different advertisement types with their respective image dimensions
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Type
            </Button>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price(Rs)</TableHead>
                  <TableHead>Image Dimensions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Loading advertisement types...
                    </TableCell>
                  </TableRow>
                ) : adTypes.length > 0 ? (
                  adTypes.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.name}</TableCell>
                      <TableCell className="max-w-md truncate">{ad.description}</TableCell>
                      <TableCell>{ad.price}</TableCell>
                      <TableCell>{ad.width} x {ad.height}px</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(ad)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No advertisement types defined yet. Click "Add New Type" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Form (30%) */}
      {showForm && (
        <div className="w-4/12 pl-3">
          <AdTypeForm 
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{currentAd?.name}" advertisement type. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvertisementDefinitionPage;