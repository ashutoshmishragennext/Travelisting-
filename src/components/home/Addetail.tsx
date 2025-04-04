"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImageCropper from "../shared/imagecrop/Imagecrop";

const advertisementTypes = [
  "BANNER",
  "POPUP",
  "SIDEBAR",
  "FEATURED_DEAL",
  "NOTIFICATION",
] as const;

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(advertisementTypes),
  content: z.record(z.string()),
  imageUrl: z.string().optional(),
  targetAudience: z.record(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddAdvertisementForm = () => {
  const [loading, setLoading] = useState(false);
  const [contentFields, setContentFields] = useState<{[key: string]: string}>({
    text: ""
  });

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      type: "BANNER",
      content: {}, 
      targetAudience: {},
    },
  });


  // Dynamically update content fields based on type
  const updateContentFields = (type: string) => {
    switch (type) {
      case "BANNER":
      case "SIDEBAR":
        setContentFields({
          text: "",
          buttonText: "",
        });
        break;
      case "POPUP":
        setContentFields({
          description: "",
          buttonText: "",
        });
        break;
      case "FEATURED_DEAL":
        setContentFields({
          description: "",
          price: "",
          discountPercentage: "",
        });
        break;
      case "NOTIFICATION":
        setContentFields({
          body: "",
        });
        break;
      default:
        setContentFields({
          text: "",
        });
    }
    
    // Update form content value
    form.setValue("content", {});
  };

  const handleContentChange = (key: string, value: string) => {
    const updatedContent = { ...form.getValues("content"), [key]: value };
    form.setValue("content", updatedContent);
  };

  const handleCroppedImage = async (croppedImage: string) => {
    setLoading(true);
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("image", blob, "advertisement-image.jpg");

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");

      const result = await response.json();
      form.setValue("imageUrl", result.url);
      toast({
        title: "Image uploaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/advertisement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create advertisement");
      }

      toast({
        title: "Advertisement created successfully",
        variant: "default",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast({
        title: "Error creating advertisement",
        description: "Failed to create advertisement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Advertisement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertisement Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter advertisement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advertisement Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertisement Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateContentFields(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select advertisement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {advertisementTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dynamic Content Fields based on type */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advertisement Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(contentFields).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium" htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    {key === "body" || key === "description" ? (
                      <Textarea
                        id={key}
                        placeholder={`Enter ${key}`}
                        value={form.getValues("content")[key] || ""}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        className="resize-none"
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={key}
                        placeholder={`Enter ${key}`}
                        value={form.getValues("content")[key] || ""}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advertisement Image</h3>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel>Upload Image</FormLabel>
                      <ImageCropper
                        onImageCropped={handleCroppedImage}
                        type="logo"
                      />
                      {field.value && (
                        <div className="mt-2">
                          <img
                            src={field.value}
                            alt="Advertisement preview"
                            className="max-h-40 rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Advertisement"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddAdvertisementForm;