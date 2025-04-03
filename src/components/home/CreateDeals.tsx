"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Plus,
  ArrowLeft,
  Trash,
  Upload,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import ImageCropper from "../shared/imagecrop/Imagecrop";
import { useCurrentUser } from "@/hooks/auth";

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

// Base deal information
interface DealFormData {
  title: string;
  travelType: string;
  travelAgentId: string;
  description: string;
  price: string;
  discount: string;
  country: string;
  state: string;
  city: string;
  validFrom: string;
  validTo: string;
  contactPhones: string[];
  contactEmails: string[];
  dealTypeDefinitionId: string;
  metadata: Record<string, any>;
  images: string[];
  isActive: boolean;
  isPromoted: boolean;
}
interface CreateDealPageProps {
  onBack: () => void;
}

const TRAVEL_TYPES = ["DOMESTIC", "INTERNATIONAL", "BOTH"];

export default function CreateDealPage({ onBack }: CreateDealPageProps) {
  const router = useRouter();
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [selectedDealType, setSelectedDealType] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Metadata | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const user = useCurrentUser();

  // Initialize form data with default values
  const [dealFormData, setDealFormData] = useState<DealFormData>({
    title: "",
    travelType: "DOMESTIC",
    travelAgentId: user?.id || "",
    description: "",
    price: "",
    discount: "",
    country: "",
    state: "",
    city: "",
    validFrom: format(new Date(), "yyyy-MM-dd"),
    validTo: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    contactPhones: [""],
    contactEmails: [""],
    dealTypeDefinitionId: "",
    metadata: {},
    images: [],
    isActive: true,
    isPromoted: false,
  });

  // Fetch deal types and metadata
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch deal types
        const dealTypesResponse = await fetch("/api/deal-types");
        if (!dealTypesResponse.ok) {
          throw new Error("Failed to fetch deal types");
        }
        const dealTypesData = await dealTypesResponse.json();

        // Fetch all metadata
        const metadataResponse = await fetch("/api/deal-type-metadata");
        if (!metadataResponse.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const metadataData = await metadataResponse.json();

        setDealTypes(dealTypesData.dealTypes);
        setMetadata(metadataData.metadata);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Get metadata for a specific deal type
  const getMetadataForDealType = (dealTypeId: string) => {
    return metadata.filter((item) => item.dealTypeId === dealTypeId);
  };

  // Handle deal type selection
  const handleDealTypeChange = (value: string) => {
    setSelectedDealType(value);
    setDealFormData((prev) => ({
      ...prev,
      dealTypeDefinitionId: value,
    }));

    const templates = getMetadataForDealType(value);
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
      // Initialize metadata with empty values
      const initialMetadata: Record<string, any> = {};
      templates[0].schema.fields.forEach((field) => {
        if (field.type === "array") {
          initialMetadata[field.id] = [""];
        } else if (field.type === "object") {
          initialMetadata[field.id] = {};
        } else {
          initialMetadata[field.id] = "";
        }
      });
      setDealFormData((prev) => ({
        ...prev,
        metadata: initialMetadata,
      }));
    } else {
      setSelectedTemplate(null);
      setDealFormData((prev) => ({
        ...prev,
        metadata: {},
      }));
    }
  };

  // Handle basic form input changes
  const handleBasicInputChange = (field: keyof DealFormData, value: any) => {
    setDealFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle array fields for basic info
  const handleBasicArrayItemChange = (
    field: "contactPhones" | "contactEmails",
    index: number,
    value: string
  ) => {
    setDealFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleAddBasicArrayItem = (
    field: "contactPhones" | "contactEmails"
  ) => {
    setDealFormData((prev) => {
      const newArray = [...prev[field], ""];
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleRemoveBasicArrayItem = (
    field: "contactPhones" | "contactEmails",
    index: number
  ) => {
    setDealFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Handle metadata input changes
  const handleMetadataChange = (fieldId: string, value: any) => {
    setDealFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [fieldId]: value,
      },
    }));
  };

  // Handle array field changes for metadata
  const handleMetadataArrayItemChange = (
    fieldId: string,
    index: number,
    value: string
  ) => {
    setDealFormData((prev) => {
      const currentArray = prev.metadata[fieldId] || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [fieldId]: newArray,
        },
      };
    });
  };

  // Add item to array field in metadata
  const handleAddMetadataArrayItem = (fieldId: string) => {
    setDealFormData((prev) => {
      const currentArray = prev.metadata[fieldId] || [];
      const newArray = [...currentArray, ""];
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [fieldId]: newArray,
        },
      };
    });
  };

  // Remove item from array field in metadata
  const handleRemoveMetadataArrayItem = (fieldId: string, index: number) => {
    setDealFormData((prev) => {
      const currentArray = prev.metadata[fieldId] || [];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [fieldId]: newArray,
        },
      };
    });
  };

  // Handle image upload
  const handleImageUpload = async (croppedImage: string, type: "cover") => {
    try {
      // First convert the data URL to a blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      // Create form data for the upload
      const formData = new FormData();
      formData.append("image", blob, `${type}-image.jpg`);

      // Send the image to the server
      const uploadResponse = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed: " + uploadResponse.statusText);
      }

      // Parse the response to get the image URL
      const result = await uploadResponse.json();
      console.log("Upload result:", result); // Add this for debugging

      // Add the uploaded image URL to the dealFormData.images array
      if (result && result.url) {
        setDealFormData((prevData) => ({
          ...prevData,
          images: [...prevData.images, result.url],
        }));
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        `Image upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setDealFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Convert price and discount to numbers for API
      const formattedData = {
        ...dealFormData,
        price: dealFormData.price ? parseFloat(dealFormData.price) : undefined,
        discount: dealFormData.discount
          ? parseFloat(dealFormData.discount)
          : undefined,
        // Filter out empty array items
        contactPhones: dealFormData.contactPhones.filter(
          (phone) => phone.trim() !== ""
        ),
        contactEmails: dealFormData.contactEmails.filter(
          (email) => email.trim() !== ""
        ),
      };

      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deal");
      }

      // Navigate back to deals list on success
      router.push("/travel-agent/deals");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  // Render metadata field based on field type
  const renderMetadataField = (field: Field) => {
    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              value={dealFormData.metadata[field.id] || ""}
              onChange={(e) => handleMetadataChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={dealFormData.metadata[field.id] || ""}
              onChange={(e) => handleMetadataChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={dealFormData.metadata[field.id] || ""}
              onChange={(e) =>
                handleMetadataChange(field.id, parseFloat(e.target.value) || "")
              }
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={dealFormData.metadata[field.id] || ""}
              onChange={(e) => handleMetadataChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {(field.options ?? []).length <= 3 ? (
              <div className="flex gap-4">
                {(field.options ?? []).map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={dealFormData.metadata[field.id] === option}
                      onChange={() => handleMetadataChange(field.id, option)}
                      required={field.required}
                      className="accent-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <Select
                value={dealFormData.metadata[field.id] || ""}
                onValueChange={(value) => handleMetadataChange(field.id, value)}
                required={field.required}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${field.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );

      case "array":
        return (
          <div className="space-y-2" key={field.id}>
            <Label>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {(Array.isArray(dealFormData.metadata[field.id])
                ? dealFormData.metadata[field.id]
                : [""]
              ).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleMetadataArrayItemChange(
                        field.id,
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Enter ${field.label.toLowerCase()} item`}
                    required={field.required}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleRemoveMetadataArrayItem(field.id, index)
                    }
                    disabled={
                      (dealFormData.metadata[field.id] || []).length <= 1
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddMetadataArrayItem(field.id)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {field.label} Item
              </Button>
            </div>
          </div>
        );

      case "object":
        return (
          <div className="space-y-2" key={field.id}>
            <Label>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border p-4 rounded-md bg-gray-50">
              <textarea
                className="w-full min-h-32 p-2 rounded-md font-mono text-sm"
                value={JSON.stringify(
                  dealFormData.metadata[field.id] || {},
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleMetadataChange(field.id, parsed);
                  } catch (err) {
                    // Allow invalid JSON while typing
                    handleMetadataChange(field.id, e.target.value);
                  }
                }}
                placeholder={`Enter ${field.label.toLowerCase()} as JSON`}
                required={field.required}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter valid JSON for this field
              </p>
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
    return (
      <div className="flex justify-center items-center h-64">
        Loading form...
      </div>
    );
  }

  return (
    <div className="container mx-auto  px-4">
      <Button
        variant="ghost"
        className="mb-6 flex items-center"
        onClick={onBack} // Use the onBack prop instead of router.push
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Deals
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Combined Deal Selection and Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
            <div>
              <CardTitle className="text-lg">Deal Details</CardTitle>
              {selectedTemplate && (
                <CardDescription className="text-sm">
                  {dealTypes.find((dt) => dt.id === selectedDealType)?.name}
                </CardDescription>
              )}
            </div>

            <Select
              value={selectedDealType}
              onValueChange={handleDealTypeChange}
              required
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select deal type" />
              </SelectTrigger>
              <SelectContent>
                {dealTypes.map((dealType) => (
                  <SelectItem key={dealType.id} value={dealType.id}>
                    {dealType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="p-4">
            {selectedDealType ? (
              selectedTemplate ? (
                <div className="space-y-4">
                  {/* Two-column layout for form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First column */}
                    <div className="space-y-4">
                      {selectedTemplate.schema.fields
                        .filter((_, index) => index % 2 === 0)
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((field) => renderMetadataField(field))}
                    </div>

                    {/* Second column */}
                    <div className="space-y-4">
                      {selectedTemplate.schema.fields
                        .filter((_, index) => index % 2 !== 0)
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((field) => renderMetadataField(field))}
                    </div>
                  </div>

                  {/* Contact information row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">
                          Valid To<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="date"
                          value={dealFormData.validTo}
                          onChange={(e) =>
                            handleBasicInputChange("validTo", e.target.value)
                          }
                          required
                          className="h-9"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Contact Phones</Label>
                        <div className="space-y-2">
                          {dealFormData.contactPhones.map((phone, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={phone}
                                onChange={(e) =>
                                  handleBasicArrayItemChange(
                                    "contactPhones",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Phone number"
                                className="h-9"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRemoveBasicArrayItem(
                                    "contactPhones",
                                    index
                                  )
                                }
                                disabled={
                                  dealFormData.contactPhones.length <= 1
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleAddBasicArrayItem("contactPhones")
                            }
                            className="h-9 mt-1"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Phone
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Contact Emails</Label>
                        <div className="space-y-2">
                          {dealFormData.contactEmails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                  handleBasicArrayItemChange(
                                    "contactEmails",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Email"
                                className="h-9"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRemoveBasicArrayItem(
                                    "contactEmails",
                                    index
                                  )
                                }
                                disabled={
                                  dealFormData.contactEmails.length <= 1
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleAddBasicArrayItem("contactEmails")
                            }
                            className="h-9 mt-1"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-sm">Images</Label>
                    <div className="space-y-2">
                      <Label className="text-sm">Cover Image</Label>
                      <ImageCropper
                        onImageCropped={(croppedImage) =>
                          handleImageUpload(croppedImage, "cover")
                        }
                        type="cover"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {dealFormData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border rounded-md overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Deal image ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-7 w-7 opacity-90"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Loading deal template...</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Please select a deal type to begin</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Submission */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/travel-agent/deals")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !selectedDealType}
          >
            {submitting ? "Creating..." : "Create Deal"}
          </Button>
        </div>
      </form>
    </div>
  );
}

{
  /* Basic Information Section */
}
{
  /* <Card className="mb-6">
          <CardContent className="space-y-6"> */
}
{
  /* Deal Title */
}
{
  /* <div className="space-y-2">
              <Label htmlFor="title">
                Deal Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={dealFormData.title}
                onChange={(e) =>
                  handleBasicInputChange("title", e.target.value)
                }
                placeholder="Enter an attractive title for your deal"
                required
              />
            </div> */
}

{
  /* Travel Type */
}
{
  /* <div className="space-y-2">
              <Label htmlFor="travelType">
                Travel Type<span className="text-red-500">*</span>
              </Label>
              <Select
                value={dealFormData.travelType}
                onValueChange={(value) =>
                  handleBasicInputChange("travelType", value)
                }
                required
              >
                <SelectTrigger id="travelType">
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVEL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */
}

{
  /* Description */
}
{
  /* <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={dealFormData.description}
                onChange={(e) =>
                  handleBasicInputChange("description", e.target.value)
                }
                placeholder="Describe your deal in detail"
                rows={4}
              />
            </div> */
}

{
  /* Price and Discount */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={dealFormData.price}
                  onChange={(e) =>
                    handleBasicInputChange("price", e.target.value)
                  }
                  placeholder="Enter price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={dealFormData.discount}
                  onChange={(e) =>
                    handleBasicInputChange("discount", e.target.value)
                  }
                  placeholder="Enter discount percentage"
                />
              </div>
            </div> */
}

{
  /* Location */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={dealFormData.country}
                  onChange={(e) =>
                    handleBasicInputChange("country", e.target.value)
                  }
                  placeholder="Enter country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={dealFormData.state}
                  onChange={(e) =>
                    handleBasicInputChange("state", e.target.value)
                  }
                  placeholder="Enter state or province"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={dealFormData.city}
                  onChange={(e) =>
                    handleBasicInputChange("city", e.target.value)
                  }
                  placeholder="Enter city"
                />
              </div>
            </div> */
}

{
  /* Validity Period */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */
}
{
  /* <div className="space-y-2">
                <Label htmlFor="validFrom">
                  Valid From<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={dealFormData.validFrom}
                  onChange={(e) =>
                    handleBasicInputChange("validFrom", e.target.value)
                  }
                  required
                />
              </div> */
}

{
  /* Status Options */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={dealFormData.isActive}
                  onChange={(e) =>
                    handleBasicInputChange("isActive", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isActive">
                  Active (visible to customers)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPromoted"
                  checked={dealFormData.isPromoted}
                  onChange={(e) =>
                    handleBasicInputChange("isPromoted", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPromoted">
                  Featured (show in promotions)
                </Label>
              </div>
            </div> */
}
{
  /* </CardContent>
        </Card> */
}

{
  /* Media Section */
}
{
  /* <Card className="mb-6">
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Add images for your deal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label htmlFor="cover" className=" text-sm pl-2">
                  Cover
                </label>
                <ImageCropper
                  onImageCropped={(croppedImage) =>
                    handleImageUpload(croppedImage, "cover")
                  }
                  type="cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dealFormData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Deal image ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-90"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card> */
}
