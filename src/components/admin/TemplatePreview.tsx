import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Smartphone, Monitor, Calendar, Award, Tag } from 'lucide-react';

interface MetadataSchema {
  fields: {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
  }[];
}

interface DealType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface TemplatePreviewProps {
  schema: MetadataSchema;
  dealType: DealType;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ schema, dealType }) => {
  // Get the current date for form previews
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Function to render form fields based on their type
  const renderFormField = (field: MetadataSchema['fields'][number]) => {
    const required = field.required ? { required: true } : {};
    
    switch (field.type) {
      case 'text':
        return (
          <Input 
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
            className="bg-white/90"
            {...required}
          />
        );
        
      case 'number':
        return (
          <Input 
            type="number" 
            placeholder="0" 
            disabled
            className="bg-white/90"
            {...required}
          />
        );
        
      case 'textarea':
        return (
          <Textarea 
            placeholder={`Enter ${field.label.toLowerCase()}`} 
            disabled
            className="bg-white/90 min-h-[80px]"
            {...required}
          />
        );
        
      case 'date':
        return (
          <Input 
            type="date" 
            disabled 
            defaultValue={currentDate}
            className="bg-white/90"
            {...required}
          />
        );
        
      case 'array':
        return (
          <div className="flex gap-2">
            <Input 
              placeholder="Add item" 
              disabled 
              className="flex-1 bg-white/90"
              {...required}
            />
            <Button variant="outline" size="sm" disabled>
              +
            </Button>
          </div>
        );
        
      case 'select':
        return (
          <Select disabled {...required}>
            <SelectTrigger className="bg-white/90">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options && field.options.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'object':
        return (
          <Textarea 
            placeholder="{}" 
            disabled 
            className="bg-white/90 min-h-[100px] font-mono text-sm"
            {...required}
          />
        );
        
      default:
        return (
          <Input 
            placeholder={`Enter ${field.label.toLowerCase()}`} 
            disabled
            className="bg-white/90"
            {...required}
          />
        );
    }
  };

  // Logic to group fields for the form layout
  const groupedFields = {
    primary: schema.fields.slice(0, Math.min(3, schema.fields.length)),
    secondary: schema.fields.slice(Math.min(3, schema.fields.length))
  };

  // Get appropriate icon based on deal type
  const getDealTypeIcon = () => {
    switch (dealType.id) {
      case 'HOTEL':
        return <Award className="h-5 w-5 text-indigo-600" />;
      case 'FLIGHT':
        return <Calendar className="h-5 w-5 text-sky-600" />;
      case 'PACKAGE':
        return <Tag className="h-5 w-5 text-emerald-600" />;
      case 'CRUISE':
        return <Monitor className="h-5 w-5 text-violet-600" />;
      default:
        return <Tag className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Preview
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Full Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getDealTypeIcon()}
                {dealType.name || dealType.id.charAt(0) + dealType.id.slice(1).toLowerCase()} Deal Form
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
              {schema.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    {field.label} 
                    {field.required && <span className="text-red-500 text-xs">*</span>}
                  </label>
                  {renderFormField(field)}
                </div>
              ))}
              <div className="pt-4">
                <Button className="w-full" disabled>Submit Deal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="form">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Form Preview</TabsTrigger>
          <TabsTrigger value="structure">Field Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="mt-4">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getDealTypeIcon()}
                  {dealType.name || dealType.id.charAt(0) + dealType.id.slice(1).toLowerCase()} Deal Form
                </CardTitle>
                <Badge variant="outline" className="bg-blue-50">Preview</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedFields.primary.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        {field.label} 
                        {field.required && <span className="text-red-500 text-xs">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
                
                {groupedFields.secondary.length > 0 && (
                  <div className="space-y-4">
                    {groupedFields.secondary.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-500 text-xs">*</span>}
                        </label>
                        {renderFormField(field)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {schema.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 border">
                    <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{field.label}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="bg-gray-100">
                          ID: {field.id}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Type: {field.type}
                        </Badge>
                        <Badge variant={field.required ? "default" : "outline"} className={field.required ? "bg-red-100 text-red-800 hover:bg-red-100" : ""}>
                          {field.required ? "Required" : "Optional"}
                        </Badge>
                        {field.options && field.options.length > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {field.options.length} options
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatePreview;