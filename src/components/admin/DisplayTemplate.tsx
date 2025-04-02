'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { format } from 'date-fns';

// Type definitions
interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  sequence: number;
  options?: string[];
}

interface Schema {
  fields: Field[];
}

interface Metadata {
  id: string;
  dealTypeId: string;
  schema: Schema;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DealType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function DealForm() {
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [selectedDealType, setSelectedDealType] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Metadata | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deal types and metadata
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch deal types
        const dealTypesResponse = await fetch('/api/deal-types');
        if (!dealTypesResponse.ok) {
          throw new Error('Failed to fetch deal types');
        }
        const dealTypesData = await dealTypesResponse.json();
        
        // Fetch all metadata
        const metadataResponse = await fetch('/api/deal-type-metadata');
        if (!metadataResponse.ok) {
          throw new Error('Failed to fetch metadata');
        }
        const metadataData = await metadataResponse.json();
        
        setDealTypes(dealTypesData.dealTypes);
        setMetadata(metadataData.metadata);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get metadata for a specific deal type
  const getMetadataForDealType = (dealTypeId: string) => {
    return metadata.filter(item => item.dealTypeId === dealTypeId);
  };

  // Handle deal type selection
  const handleDealTypeChange = (value: string) => {
    setSelectedDealType(value);
    const templates = getMetadataForDealType(value);
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      templates[0].schema.fields.forEach(field => {
        if (field.type === 'array') {
          initialData[field.id] = [''];
        } else if (field.type === 'object') {
          initialData[field.id] = {};
        } else {
          initialData[field.id] = '';
        }
      });
      setFormData(initialData);
    } else {
      setSelectedTemplate(null);
      setFormData({});
    }
  };

  // Handle form input changes
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Handle array field changes
  const handleArrayItemChange = (fieldId: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[fieldId] || [])];
      newArray[index] = value;
      return {
        ...prev,
        [fieldId]: newArray
      };
    });
  };

  // Add item to array field
  const handleAddArrayItem = (fieldId: string) => {
    setFormData(prev => {
      const newArray = [...(prev[fieldId] || []), ''];
      return {
        ...prev,
        [fieldId]: newArray
      };
    });
  };

  // Remove item from array field
  const handleRemoveArrayItem = (fieldId: string, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[fieldId] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [fieldId]: newArray
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission:', formData);
    // Here you would typically send the data to your API
    alert('Form submitted! Check the console for details.');
  };

  // Render form field based on field type
  const renderFormField = (field: Field) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={field.id}
              type="number"
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || '')}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={field.id}
              type="date"
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => handleInputChange(field.id, value)}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'array':
        return (
          <div className="space-y-2" key={field.id}>
            <Label>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <div className="space-y-2">
              {(formData[field.id] || ['']).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayItemChange(field.id, index, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()} item`}
                    required={field.required}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleRemoveArrayItem(field.id, index)}
                    disabled={(formData[field.id] || []).length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddArrayItem(field.id)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {field.label} Item
              </Button>
            </div>
          </div>
        );
        
      case 'object':
        return (
          <div className="space-y-2" key={field.id}>
            <Label>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <div className="border p-4 rounded-md bg-gray-50">
              <textarea
                className="w-full min-h-32 p-2 rounded-md font-mono text-sm"
                value={JSON.stringify(formData[field.id] || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleInputChange(field.id, parsed);
                  } catch (err) {
                    // Allow invalid JSON while typing
                    handleInputChange(field.id, e.target.value);
                  }
                }}
                placeholder={`Enter ${field.label.toLowerCase()} as JSON`}
                required={field.required}
              />
              <p className="text-xs text-gray-500 mt-1">Enter valid JSON for this field</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div key={field.id} className="text-gray-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading form...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="mr-2" />
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Deal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Deal Type</CardTitle>
          <CardDescription>Choose a deal type to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDealType} onValueChange={handleDealTypeChange}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a deal type" />
            </SelectTrigger>
            <SelectContent>
              {dealTypes.map(dealType => (
                <SelectItem key={dealType.id} value={dealType.id}>
                  {dealType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedTemplate && (
        <form onSubmit={handleSubmit} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{dealTypes.find(d => d.id === selectedDealType)?.name} Deal Form</CardTitle>
              <CardDescription>Fill in the details for your new deal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTemplate.schema.fields
                .sort((a, b) => a.sequence - b.sequence)
                .map(field => renderFormField(field))}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setFormData({})}>
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}