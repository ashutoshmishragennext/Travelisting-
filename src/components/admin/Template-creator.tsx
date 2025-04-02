'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Trash2, FileText, ArrowRight, Bookmark, AlertCircle, Save, Loader2, Copy, Link } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import TemplatePreview from './TemplatePreview';
import { useCurrentUser } from '@/hooks/auth';

interface MetadataField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  sequence: number;
}

interface DealType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  icon?: string;
}

export default function EnhancedTemplateCreator() {
  // State variables
  const [selectedDealType, setSelectedDealType] = useState('');
  const [metadataSchema, setMetadataSchema] = useState<{ fields: MetadataField[] }>({ fields: [] });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const user = useCurrentUser();

  // Form for the deal type definition
  const dealTypeForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      isActive: true
    }
  });

  // Initial schema structures for different deal types with sequence numbers
  const initialSchemas = {
    HOTEL: {
      fields: [
        { id: 'propertyName', label: 'Property Name', type: 'text', required: true, sequence: 1 },
        { id: 'starRating', label: 'Star Rating', type: 'number', required: true, sequence: 2 },
        { id: 'roomTypes', label: 'Room Types', type: 'array', required: true, sequence: 3 },
        { id: 'amenities', label: 'Amenities', type: 'array', required: true, sequence: 4 },
        { id: 'checkInTime', label: 'Check-in Time', type: 'text', required: true, sequence: 5 },
        { id: 'checkOutTime', label: 'Check-out Time', type: 'text', required: true, sequence: 6 },
        { id: 'pricePerNight', label: 'Price Per Night', type: 'number', required: true, sequence: 7 },
      ]
    },
    FLIGHT: {
      fields: [
        { id: 'airline', label: 'Airline', type: 'text', required: true, sequence: 1 },
        { id: 'departureLocation', label: 'Departure Location', type: 'text', required: true, sequence: 2 },
        { id: 'arrivalLocation', label: 'Arrival Location', type: 'text', required: true, sequence: 3 },
        { id: 'departureDate', label: 'Departure Date', type: 'date', required: true, sequence: 4 },
        { id: 'returnDate', label: 'Return Date', type: 'date', required: false, sequence: 5 },
        { id: 'flightClass', label: 'Flight Class', type: 'select', options: ['Economy', 'Business', 'First'], required: true, sequence: 6 },
        { id: 'price', label: 'Price', type: 'number', required: true, sequence: 7 }
      ]
    },
    PACKAGE: {
      fields: [
        { id: 'packageName', label: 'Package Name', type: 'text', required: true, sequence: 1 },
        { id: 'destinations', label: 'Destinations', type: 'array', required: true, sequence: 2 },
        { id: 'duration', label: 'Duration (Days)', type: 'number', required: true, sequence: 3 },
        { id: 'inclusions', label: 'Inclusions', type: 'array', required: true, sequence: 4 },
        { id: 'exclusions', label: 'Exclusions', type: 'array', required: true, sequence: 5 },
        { id: 'itinerary', label: 'Itinerary', type: 'object', required: true, sequence: 6 },
        { id: 'price', label: 'Price', type: 'number', required: true, sequence: 7 }
      ]
    },
    CRUISE: {
      fields: [
        { id: 'cruiseLine', label: 'Cruise Line', type: 'text', required: true, sequence: 1 },
        { id: 'shipName', label: 'Ship Name', type: 'text', required: true, sequence: 2 },
        { id: 'departurePort', label: 'Departure Port', type: 'text', required: true, sequence: 3 },
        { id: 'destinations', label: 'Destinations', type: 'array', required: true, sequence: 4 },
        { id: 'duration', label: 'Duration (Days)', type: 'number', required: true, sequence: 5 },
        { id: 'cabinTypes', label: 'Cabin Types', type: 'array', required: true, sequence: 6 },
        { id: 'price', label: 'Price', type: 'number', required: true, sequence: 7 }
      ]
    },
    OTHER: {
      fields: [
        { id: 'title', label: 'Title', type: 'text', required: true, sequence: 1 },
        { id: 'description', label: 'Description', type: 'textarea', required: true, sequence: 2 },
        { id: 'price', label: 'Price', type: 'number', required: true, sequence: 3 }
      ]
    }
  };

  // Fetch deal types from API
  useEffect(() => {
    const fetchDealTypes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/deal-types');
        if (!response.ok) {
          throw new Error('Failed to fetch deal types');
        }
        const data = await response.json();
        
        // Add icons to deal types based on name
        const enhancedDealTypes = data.dealTypes.map((type: DealType) => {
          let icon = '🔖'; // Default icon
          
          if (type.name.toLowerCase().includes('hotel')) icon = '🏨';
          else if (type.name.toLowerCase().includes('flight')) icon = '✈️';
          else if (type.name.toLowerCase().includes('package')) icon = '📦';
          else if (type.name.toLowerCase().includes('cruise')) icon = '🚢';
          
          return {
            ...type,
            icon
          };
        });
        
        setDealTypes(enhancedDealTypes);
        
        // Set default selected deal type if available
        if (enhancedDealTypes.length > 0) {
          setSelectedDealType(enhancedDealTypes[0].id);
        }
      } catch (err) {
        console.error('Error fetching deal types:', err);
        setError('Failed to load deal types. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealTypes();
  }, []);

  // Map API deal type to schema type
  const mapDealTypeToSchemaType = (dealTypeName: string) => {
    const name = dealTypeName.toUpperCase();
    if (name.includes('HOTEL')) return 'HOTEL';
    if (name.includes('FLIGHT')) return 'FLIGHT';
    if (name.includes('PACKAGE')) return 'PACKAGE';
    if (name.includes('CRUISE')) return 'CRUISE';
    return 'OTHER';
  };

  // Load initial schema when deal type changes
  useEffect(() => {
    if (selectedDealType && dealTypes.length > 0) {
      const selectedType = dealTypes.find(type => type.id === selectedDealType);
      if (selectedType) {
        const schemaType = mapDealTypeToSchemaType(selectedType.name);
        setMetadataSchema(initialSchemas[schemaType] ?? { fields: [] });
        
        // Update form values based on selected deal type
        dealTypeForm.setValue('name', selectedType.name);
        dealTypeForm.setValue('description', selectedType.description);
        dealTypeForm.setValue('isActive', selectedType.isActive);
      }
    }
  }, [selectedDealType, dealTypes]);

  // Function to add a new field to the schema with sequence number
  const addField = () => {
    const newField: MetadataField = { 
      id: `field_${Date.now()}`,
      label: '', 
      type: 'text', 
      required: false,
      sequence: metadataSchema.fields.length + 1
    };
    
    setMetadataSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  // Function to remove a field from the schema and re-sequence
  const removeField = (index: number) => {
    setMetadataSchema(prev => {
      const updatedFields = [...prev.fields];
      updatedFields.splice(index, 1);
      
      // Re-sequence all remaining fields
      const resequencedFields = updatedFields.map((field, i) => ({
        ...field,
        sequence: i + 1
      }));
      
      return {
        ...prev,
        fields: resequencedFields
      };
    });
  };

  // Function to update a field in the schema (preserves sequence)
  const updateField = (index: number, field: Omit<MetadataField, 'sequence'>) => {
    setMetadataSchema(prev => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = { 
        ...field, 
        sequence: updatedFields[index].sequence 
      };
      return { ...prev, fields: updatedFields };
    });
  };

  // Handle duplicating a field with proper sequence handling
  const duplicateField = (index: number) => {
    setMetadataSchema(prev => {
      const fieldToDuplicate = { ...prev.fields[index] };
      fieldToDuplicate.id = `${fieldToDuplicate.id}_copy_${Date.now()}`;
      
      const updatedFields = [...prev.fields];
      updatedFields.splice(index + 1, 0, fieldToDuplicate);
      
      // Re-sequence all fields
      return {
        ...prev,
        fields: updatedFields.map((field, i) => ({
          ...field,
          sequence: i + 1
        }))
      };
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Get the form values
      const dealTypeFormValues = dealTypeForm.getValues();
      
      // Validate required fields
      if (!selectedDealType) {
        throw new Error('Please select a deal type');
      }
      
      if (metadataSchema.fields.length === 0) {
        throw new Error('Please add at least one field to the schema');
      }

      // Prepare payload according to API requirements
      const payload = {
        dealTypeId: selectedDealType,
        schema: metadataSchema,
        isActive: dealTypeFormValues.isActive !== false,
        createdBy: user?.id,
      };
      
      console.log('Payload to submit:', payload);
      
      // Make the actual API call
      const response = await fetch('/api/deal-type-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save deal type metadata');
      }
      
      const result = await response.json();
      console.log('Metadata created successfully:', result);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error saving deal type metadata:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to save deal type metadata');
      } else {
        setErrorMessage('Failed to save deal type metadata');
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const hasName = !!dealTypeForm.getValues('name');
    const hasDescription = !!dealTypeForm.getValues('description');
    const hasFields = metadataSchema.fields.length > 0;
    const fieldsValid = metadataSchema.fields.every(field => field.id && field.label);
    
    return hasName && hasDescription && hasFields && fieldsValid;
  };

  // Get the selected deal type object
  const getSelectedDealTypeObject = (): DealType | undefined => {
    return dealTypes.find(type => type.id === selectedDealType);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">Create Deal Template</CardTitle>
              <CardDescription className="text-blue-700 mt-1">
                Design professional templates for different types of travel deals
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {dealTypeForm.getValues('name') && (
                <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 border-blue-200">
                  {(getSelectedDealTypeObject()?.icon ?? '🔖')} {dealTypeForm.getValues('name')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {showSuccessMessage && (
            <Alert className="m-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Template created successfully!
              </AlertDescription>
            </Alert>
          )}
          
          {(error || errorMessage) && (
            <Alert className="m-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                {error || errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-blue-500">Loading deal types...</span>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-4 border-b">
                <TabsList className="grid grid-cols-3 mb-0">
                  <TabsTrigger value="details" className="text-sm flex gap-2 items-center">
                    <FileText className="h-4 w-4" />
                    Basic Details
                  </TabsTrigger>
                  <TabsTrigger value="fields" className="text-sm flex gap-2 items-center">
                    <Bookmark className="h-4 w-4" />
                    Template Fields
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-sm flex gap-2 items-center">
                    <ArrowRight className="h-4 w-4" />
                    Final Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="details" className="p-6 pt-8">
                <Form {...dealTypeForm}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FormField
                        control={dealTypeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Luxury Hotel Deal" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  dealTypeForm.setValue('name', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for this template
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dealTypeForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe what this template will be used for"
                                className="min-h-[120px]"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  dealTypeForm.setValue('description', e.target.value);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dealTypeForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Active Template
                              </FormLabel>
                              <FormDescription>
                                Make this template available for creating deals
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  dealTypeForm.setValue('isActive', checked);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <FormLabel>Deal Type</FormLabel>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {dealTypes.map(type => (
                            <div 
                              key={type.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-blue-50 ${
                                selectedDealType === type.id ? 'bg-blue-50 border-blue-300 shadow-sm' : ''
                              }`}
                              onClick={() => setSelectedDealType(type.id)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{type.icon}</span>
                                <span className="font-medium">{type.name}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                            </div>
                          ))}
                        </div>
                        <FormDescription className="mt-2">
                          This will determine the initial fields for your template
                        </FormDescription>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium text-sm mb-2">Template Summary</h4>
                        <div className="rounded-lg border p-4 bg-gray-50">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="text-gray-500">Template Type:</div>
                            <div className="font-medium">
                              {getSelectedDealTypeObject()?.name ?? '-'}
                            </div>
                            <div className="text-gray-500">Fields Count:</div>
                            <div className="font-medium">{metadataSchema.fields.length}</div>
                            <div className="text-gray-500">Required Fields:</div>
                            <div className="font-medium">
                              {metadataSchema.fields.filter(f => f.required).length}
                            </div>
                            <div className="text-gray-500">Created By:</div>
                            <div className="font-medium">Current User</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('fields')}
                      className="gap-2"
                    >
                      Continue to Fields <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Form>
              </TabsContent>
              
              <TabsContent value="fields" className="px-6 pt-6 pb-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Template Fields</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Define the fields that will be used in this template
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={addField} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Field
                    </Button>
                  </div>
                </div>
                
                {metadataSchema.fields.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500">No Fields Added</h4>
                    <p className="text-sm text-gray-400 mt-1 mb-4">
                      Start by adding fields to your template
                    </p>
                    <Button onClick={addField} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" /> Add Your First Field
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {metadataSchema.fields.map((field, index) => (
                      <Card key={field.id || index} className="overflow-hidden border-l-4 border-l-blue-400">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                                {field.sequence}
                              </span>
                              <h4 className="font-medium">{field.label || 'Unnamed Field'}</h4>
                              {field.required && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Required
                                </Badge>
                              )}
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {field.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => duplicateField(index)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeField(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Field ID</label>
                              <Input 
                                value={field.id}
                                onChange={(e) => {
                                  const newField = { ...field, id: e.target.value };
                                  updateField(index, newField);
                                }}
                                placeholder="unique_id"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Label</label>
                              <Input 
                                value={field.label}
                                onChange={(e) => {
                                  const newField = { ...field, label: e.target.value };
                                  updateField(index, newField);
                                }}
                                placeholder="Display Label"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Field Type</label>
                              <Select 
                                value={field.type}
                                onValueChange={(value) => updateField(index, { ...field, type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="textarea">Text Area</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="select">Dropdown</SelectItem>
                                  <SelectItem value="array">List/Array</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch 
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => 
                                  updateField(index, { ...field, required: checked })
                                }
                              />
                              <label 
                                htmlFor={`required-${field.id}`}
                                className="text-sm font-medium"
                              >
                                Required Field
                              </label>
                            </div>
                            
                            {field.type === 'select' && (
                              <div className="col-span-4 mt-4">
                                <label className="text-sm font-medium">Options</label>
                                <div className="flex gap-2 mt-2">
                                  <Input 
                                    placeholder="Option 1, Option 2, Option 3"
                                    value={field.options ? field.options.join(', ') : ''}
                                    onChange={(e) => {
                                      const options = e.target.value.split(',').map(opt => opt.trim());
                                      updateField(index, { ...field, options });
                                    }}
                                    className="flex-1"
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Enter comma-separated values
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('details')}
                  >
                    Back to Details
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setActiveTab('preview')}
                      className="gap-2"
                    >
                      Continue to Preview <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Template Preview</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Review your template before saving
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 bg-gray-50">
                  <TemplatePreview
                    dealType={{
                      id: selectedDealType,
                      name: dealTypeForm.getValues('name'),
                      description: dealTypeForm.getValues('description'),
                      icon: getSelectedDealTypeObject()?.icon ?? '🔖'
                    }}
                    schema={metadataSchema}
                  />
                </div>
                
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('fields')}
                  >
                    Back to Fields
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" /> Save Template
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        
        {/* <CardFooter className="py-4 px-6 bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Template ID: {selectedDealType ? `${selectedDealType.substring(0, 8)}...` : 'Not selected'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Link className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" /> Duplicate
            </Button>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}