"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

// Zod schema for validation
const phaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phaseType: z.enum([
    "Phase I", 
    "Phase II", 
    "Phase III Part 1", 
    "Phase III Part 2"
  ]),
  academicYear: z.string().regex(/^\d{4}$/, "Academic year must be a 4-digit year"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().optional()
});

type PhaseFormData = z.infer<typeof phaseSchema>;

interface CSVPhaseData {
  [key: string]: string;
}

const AddPhase = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phases, setPhases] = useState<PhaseFormData[]>([]);

  const form = useForm<PhaseFormData>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
      name: "",
      phaseType: "Phase I",
      academicYear: new Date().getFullYear().toString(),
      startDate: "",
      endDate: "",
      isActive: true
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFile = files[0];
      if (selectedFile.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const parseCSV = async (file: File): Promise<CSVPhaseData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          
          if (lines.length < 2) {
            throw new Error('CSV file is empty or missing data');
          }
          
          const headers = lines[0].split(',').map(header => header.trim());
          const requiredHeaders = [
            'name', 
            'phaseType', 
            'academicYear', 
            'startDate', 
            'endDate', 
            'isActive'
          ];
          
          const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
          }
          
          const jsonData: CSVPhaseData[] = [];
  
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(value => value.trim());
            
            if (values.length !== headers.length) {
              throw new Error(`Invalid data in row ${i + 1}`);
            }
            
            const row: CSVPhaseData = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] ? values[index].toString() : "";
            });
            
            // Validate phase type
            const validPhaseTypes = [
              "Phase I", 
              "Phase II", 
              "Phase III Part 1", 
              "Phase III Part 2"
            ];
            if (!validPhaseTypes.includes(row.phaseType)) {
              throw new Error(`Invalid phase type in row ${i + 1}`);
            }
            
            // Validate academic year
            if (!/^\d{4}$/.test(row.academicYear)) {
              throw new Error(`Invalid academic year in row ${i + 1}`);
            }
            
            // Validate dates
            if (
              !/^\d{4}-\d{2}-\d{2}$/.test(row.startDate) || 
              !/^\d{4}-\d{2}-\d{2}$/.test(row.endDate)
            ) {
              throw new Error(`Invalid date format in row ${i + 1}`);
            }
            
            jsonData.push(row);
          }
  
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
  
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
  
      reader.readAsText(file);
    });
  };

  const onSubmit = async (formData: PhaseFormData) => {
    try {
      setIsSubmitting(true);
      let data;
      
      if (activeTab === "csv") {
        if (!file) {
          toast.error("Please select a CSV file");
          return;
        }
        data = await parseCSV(file);
      } else {
        data = [formData];
      }

      const response = await fetch(`/api/phase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Fetch updated phases
      const phasesResponse = await fetch(`/api/phase?academicYear=${formData.academicYear}`);
      if (phasesResponse.ok) {
        const fetchedPhases = await phasesResponse.json();
        setPhases(fetchedPhases);
      }

      toast.success("Phase(s) registered successfully!");

      // Reset form
      if (activeTab === "csv") {
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        form.reset();
      }

    } catch (error) {
      console.error('Error registering phase(s):', error);
      toast.error(error instanceof Error ? error.message : "Failed to register phase(s)!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset form when switching tabs
    if (value === "csv") {
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } else {
      form.reset();
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="manual" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="csv">
                CSV Upload
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <TabsContent value="csv" className="grid w-full">
                  <FormField
                    name="csvFile"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload CSV File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="manual" className="grid grid-cols-1 lg:grid-cols-2 gap-3 gap-x-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter phase name" 
                            {...field} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select phase type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Phase I">Phase I</SelectItem>
                            <SelectItem value="Phase II">Phase II</SelectItem>
                            <SelectItem value="Phase III Part 1">Phase III Part 1</SelectItem>
                            <SelectItem value="Phase III Part 2">Phase III Part 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter academic year" 
                            {...field} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Is Active</FormLabel>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? "Processing..." 
                    : activeTab === "csv"
                      ? "Upload CSV" 
                      : "Register Phase"
                  }
                </Button>
              </form>
            </Form>
          </Tabs>

          {/* Phases Table */}
          {phases.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Registered Phases</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Phase Type</th>
                      <th className="border p-2">Academic Year</th>
                      <th className="border p-2">Start Date</th>
                      <th className="border p-2">End Date</th>
                      <th className="border p-2">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases.map((phase, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{phase.name}</td>
                        <td className="border p-2">{phase.phaseType}</td>
                        <td className="border p-2">{phase.academicYear}</td>
                        <td className="border p-2">{phase.startDate}</td>
                        <td className="border p-2">{phase.endDate}</td>
                        <td className="border p-2">
                          {phase.isActive ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPhase;