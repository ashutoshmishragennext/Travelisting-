import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import React from 'react';

type AdTypeFormProps = {
  formData: {
    name: string;
    description: string;
    price: string;
    image: string;
    timePeriod : string;
    width: string;
    height: string;
    createdBy: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    price: string;
    timePeriod : string;
    image: string;
    width: string;
    height: string;
    createdBy: string;
  }>>;
  isEditing: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
};

const AdTypeForm = ({ formData, setFormData, isEditing, handleSubmit, handleCancel }: AdTypeFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit' : 'Add'} Advertisement Type</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Popup, Sidebar, Banner"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description of the advertisement type"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Valid Duration</Label>
            <Input
              id="timePeriod"
              name="timePeriod"
              type="text"
              value={formData.timePeriod}
              onChange={handleChange}
              placeholder="duration in 1D1M1Y"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (Rs)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price in Rupees"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                value={formData.width}
                onChange={handleChange}
                placeholder="Width in pixels"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in pixels"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdTypeForm;