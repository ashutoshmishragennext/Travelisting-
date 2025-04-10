"use client";
import imagetree from "@/components/assets/imagetree.jpg";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import BannerAd from "@/components/advertisements/adshow/Banner";
import StickyFeaturedDeal from "@/components/advertisements/adshow/FeaturedDeal";
import FullPopupAd from "@/components/advertisements/adshow/FullPopUp";
import { LuPackageSearch } from "react-icons/lu";

const TravelDealSearch = () => {
  const pathname = usePathname();
  const [dealTypes, setDealTypes] = useState<{ id: string; name: string }[]>(
    []
  );
  const router = useRouter();
  const [selectedDealType, setSelectedDealType] = useState("");
  const [metadataSchema, setMetadataSchema] = useState<{
    schema: {
      fields: {
        id: string;
        type: string;
        label: string;
        options: string[];
        required?: boolean;
        placeholder?: string;
      }[];
    };
    dealTypeName?: string;
    dealTypeDescription?: string;
  } | null>(null);
  const [formData, setFormData] = useState<{
    dealTypeId: string;
    isActive: boolean;
    metadata: Record<string, any>;
  }>({
    dealTypeId: "",
    isActive: true,
    metadata: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDealTypes, setIsLoadingDealTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface Deal {
    id: string;
    title?: string;
    description: string;
    images?: string;
    city?: string;
    state?: string;
    country?: string;
    price?: number;
    travelType?: string;
    validFrom?: string;
    validTo?: string;
    metadata?: Record<string, any>;
  }

  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [selectedTab, setSelectedTab] = useState("Flights");

  // Add this with your other useState declarations
  const [isMobile, setIsMobile] = useState(false);

  // Add this useEffect to detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the 'sm' breakpoint in Tailwind
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  // Fetch all available deal types
  const fetchDealTypes = async () => {
    try {
      setIsLoadingDealTypes(true);
      const response = await fetch("/api/deal-types");
      const data = await response.json();

      if (data.dealTypes && Array.isArray(data.dealTypes)) {
        setDealTypes(data.dealTypes);
        // Initialize with the first deal type if available
        if (data.dealTypes.length > 0) {
          handleDealTypeSelect(data.dealTypes[0].id);
        }
      } else {
        setError("Invalid deal types response format");
      }
    } catch (err) {
      setError("Error fetching deal types");
      console.error(err);
    } finally {
      setIsLoadingDealTypes(false);
    }
  };

  // Fetch metadata schema when deal type changes
  const fetchMetadataSchema = async (dealTypeId: any) => {
    if (!dealTypeId) {
      setMetadataSchema(null);
      setFormData((prev) => ({ ...prev, metadata: {} }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?dealTypeId=${dealTypeId}`);
      const data = await response.json();

      if (data.success) {
        setMetadataSchema(data.schema);
        // Initialize metadata object based on schema
        const initialMetadata: Record<string, string> = {};
        data.schema.schema.fields.forEach((field: { id: string }) => {
          initialMetadata[field.id] = "";
        });
        setFormData((prev) => ({
          ...prev,
          metadata: initialMetadata,
        }));
        // handleSubmit2();
        setSearchResults([]);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch schema");
      }
    } catch (err) {
      setError("Error fetching metadata schema");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("metadata.")) {
      const metadataField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]:
            type === "checkbox"
              ? checked
              : type === "number"
              ? Number(value)
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    }
  };

  // Handle select change for shadcn/ui Select component
  const handleSelectChange = (value: string, fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [fieldId]: value,
      },
    }));
  };

  // Handle deal type selection
  const handleDealTypeSelect = (dealTypeId: string) => {
    setSelectedDealType(dealTypeId);
    setFormData((prev) => ({ ...prev, dealTypeId }));
    fetchMetadataSchema(dealTypeId);
  };

  function Deal(id: string) {
    router.push(`/details/${id}`);
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.deals);
        setTimeout(() => {
          document
            .getElementById("Cards")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError("Error performing search");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch deal types when component mounts
  useEffect(() => {
    fetchDealTypes();
  }, []);

  const renderMetadataFields = () => {
    if (!metadataSchema || !metadataSchema.schema?.fields) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 bg-white">
        {metadataSchema.schema.fields.map((field) => {
          const value = formData.metadata?.[field.id] || "";

          // Skip rendering Description here
          if (field.id === "Description") return null;

          switch (field.type) {
            case "text":
            case "textarea":
              return (
                <div
                  key={field.id}
                  className="mb-4 bg-white bg-opacity-90 rounded sm:p-3 sm:border"
                >
                  <label className="  sm:block hidden text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Input
                    type="text"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full bg-transparent border-gray-300"
                    placeholder={field.label || ""}
                  />
                </div>
              );

            case "number":
              return (
                <div
                  key={field.id}
                  className="mb-4 bg-white bg-opacity-90 rounded p-3 border"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Input
                    type="number"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full bg-transparent border-gray-300"
                    placeholder={field.label || ""}
                  />
                </div>
              );

            case "date":
              return (
                <div
                  key={field.id}
                  className="mb-4 bg-white bg-opacity-90 rounded p-3 border"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Input
                    type="date"
                    name={`metadata.${field.id}`}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full bg-transparent border-gray-300"
                  />
                </div>
              );

            case "select":
              // Use radio buttons if there are exactly two options
              if (field.options?.length === 2) {
                // Set default value to first option if no value is selected
                const currentValue = value || field.options[0];

                  if (!value && field.options?.length === 2) {
                    handleSelectChange(field.options[1], field.id);
                  }

                return (
                  <div
                    key={field.id}
                    className="mb-4 bg-white bg-opacity-90 rounded sm:p-3 sm:border"
                  >
                    <label className="sm:block hidden text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Create a new array with first and second elements swapped */}
                      {[...field.options].map((option, index, array) => {
                        if (index === 0) {
                          option = array[1];
                        } else if (index === 1) {
                          option = array[0];
                        }

                        return (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`${field.id}-${option}`}
                              name={`metadata.${field.id}`}
                              value={option}
                              checked={currentValue === option}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleSelectChange(option, field.id);
                                }
                              }}
                              className="mr-2"
                              required={field.required}
                            />
                            <label
                              htmlFor={`${field.id}-${option}`}
                              className="text-sm text-gray-700"
                            >
                              {option}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                // Use dropdown for more than two options
                return (
                  <div
                    key={field.id}
                    className="mb-4 bg-white bg-opacity-90 rounded sm:p-3 sm:border"
                  >
                    <label className="sm:block hidden text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Select
                      value={value}
                      onValueChange={(newValue) =>
                        handleSelectChange(newValue, field.id)
                      }
                    >
                      <SelectTrigger className="w-full bg-transparent border-gray-300">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const icons = ["✈️", "🏨", "💰", "📦"];

  const handleAdClick = (ad: any) => {
    console.log("Ad clicked:", ad);
    // You can add analytics tracking or other logic here
  };

  return (
    <div className="w-full min-h-screen inset-0 bg-slate-200 bg-opacity-40 py-1">
      {/* Hero Section with Background Image Slider */}
      <div
        className="relative w-full bg-cover bg-center bg-black bg-opacity-0"
        style={{
          backgroundImage: `url(${imagetree})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {dealTypes && metadataSchema &&
        <StickyFeaturedDeal isShowAbove={true} />}

          {dealTypes && metadataSchema &&
        <FullPopupAd />}

        <div
          className=" inset-0 h-full mt-12 bg-black bg-opacity-0 "
          style={{
            backgroundImage: `url(${imagetree})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 pt-0 text-center">
            {/* Navigation Tabs */}
            <div className="flex justify-center max-w-3xl border-primary mx-auto mt-12 z-50">
              {isLoadingDealTypes ? (
                <div className="p-4 text-primary flex items-center">
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Loading deal types...
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                      Find Your Perfect Travel Deals
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Search through our exclusive collection of travel offers
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Search Form based on tab */}
            <div className="max-w-6xl mx-auto mt-3">
              {true && (
                <div>
                  <div className="bg-white bg-opacity-90 p-6 pb-3 rounded-lg backdrop-blur-sm shadow-xl">
                    {metadataSchema && (
                      <div className="mb-8">
                        <div className=" flex justify-around">
                          <div className="flex border w-fit m-auto border-primary rounded-lg shadow-lg ">
                            {dealTypes.map((dealType, index) => (
                              <button
                                key={dealType.id}
                                onClick={() =>
                                  handleDealTypeSelect(dealType.id)
                                }
                                className={`${
                                  selectedDealType === dealType.id
                                    ? "bg-primary text-white"
                                    : "bg-white bg-opacity-90 text-primary hover:bg-opacity-100"
                                } px-2 sm:px-4 md:px-8 py-4 flex items-center justify-center transition-colors duration-200 rounded-lg `}
                              >
                                <span className="mr-2">
                                  {dealType.name
                                    .toLowerCase()
                                    .includes("flight")
                                    ? icons[0]
                                    : ""}{" "}
                                  {dealType.name.toLowerCase().includes("hotel")
                                    ? icons[1]
                                    : ""}{" "}
                                  {dealType.name.toLowerCase().includes("deal")
                                    ? icons[2]
                                    : ""}
                                  {dealType.name
                                    .toLowerCase()
                                    .includes("package")
                                    ? icons[3]
                                    : ""}
                                </span>{" "}
                                {dealType.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className=" bg-white p-6 pb-0 rounded-lg text-gray-800">
                          <form
                            onSubmit={handleSubmit}
                            className=" sm:flex space-x-4 items-start mb-4"
                          >
                            {renderMetadataFields()}

                            <div className=" mt-2 flex justify-center">
                              <Button
                                type="submit"
                                disabled={isLoading || !formData.dealTypeId}
                                className="px-4 py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300"
                              >
                                {isLoading ? (
                                  <span className="flex items-center">
                                    <Loader2 className="animate-spin  h-5 w-5" />
                                    <p className="pl-2 sm:hidden">
                                      Searching...
                                    </p>
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Search className=" h-5 w-5" />
                                    <p className=" pl-2 sm:hidden">Search</p>
                                  </span>
                                )}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Search results */}
      <div className="max-w-6xl mx-auto px-4 pb-12 ">
        {/* Results Section */}
        {searchResults.length > 0 ? (
          <div className="mt-12" id="Cards">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              {searchResults.length} Amazing Deals Found
            </h2>
            {/* <PopupAd 
                className="w-64 md:w-80" 
                intervalTime={30000} 
                onAdClick={handleAdClick}
              /> */}
            <BannerAd
              className="h-40 mb-8" // Custom styling using className prop
              autoRotateInterval={4000} // 3 seconds rotation
              onAdClick={handleAdClick}
              maxBannersToShow={3} // Show maximum 4 banners
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((deal) => (
                <Card
                  key={deal.id}
                  onClick={() => Deal(deal.id)}
                  className="overflow-hidden transition-all hover:shadow-lg border-gray-100"
                >
                  {/* Image Section */}
                  {deal.images && (
                    <div className="h-52 overflow-hidden relative">
                      <div className="h-52 w-full object-cover relative">
                        <Image
                          src={deal.images}
                          alt={deal.title || "Travel Deal"}
                          layout="fill"
                          objectFit="fit"
                          priority
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/api/placeholder/400/300"; // Fallback image
                          }}
                        />
                      </div>
                      {/* Optional overlay gradient for better text visibility */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent opacity-30"></div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {deal.title}
                    </h3>

                    {/* Location Info */}
                    {(deal.city ||
                      deal.state ||
                      deal.country ||
                      (deal.metadata && deal.metadata.Location)) && (
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        {[
                          deal.city || (deal.metadata && deal.metadata.City),
                          deal.state || (deal.metadata && deal.metadata.State),
                          deal.country,
                        ]
                          .filter(Boolean)
                          .join(", ") ||
                          deal.metadata?.Location ||
                          ""}
                      </p>
                    )}

                    {deal.description && (
                      <div
                        className="line-clamp-1 text-ellipsis overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: deal.description }}
                      />
                    )}

                    {/* Price */}
                    {/* {deal.price && (
                      <p className="text-2xl font-bold text-primary mb-3">
                        ₹{deal.price.toLocaleString()}
                      </p>
                    )} */}

                    {/* Travel Type */}
                    {/* {(deal.travelType ||
                      (deal.metadata && deal.metadata.Type)) && (
                      <div className="mb-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {deal.travelType || deal.metadata?.Type || "Package"}
                        </Badge>
                      </div>
                    )} */}

                    {/* Valid Dates */}
                    {deal.validFrom && deal.validTo && (
                      <div className="text-xs text-gray-500 mt-3">
                        Valid: {new Date(deal.validFrom).toLocaleDateString()} -{" "}
                        {new Date(deal.validTo).toLocaleDateString()}
                      </div>
                    )}

                    <Button
                      className="mt-4 w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                      onClick={() => Deal(deal.id)}
                    >
                      View Deal Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : searchResults.length === 0 &&
          !isLoading &&
          !error &&
          selectedDealType ? (
          <Card className="p-8 text-center mt-8 bg-gray-50 border-gray-100">
            <CardContent className="pt-6 flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary/50 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-800 text-lg">
                No deals found matching your search criteria.
              </p>
              <p className="text-primary mt-2">
                Try adjusting your search parameters or check back later.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Mobile Bottom Navigation Bar - Only visible on small screens */}
      {isMobile && !pathname?.includes("/dashboard") && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => {
                router.push("/");
              }}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${
                pathname === "/"
                  ? "text-primary font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search className="h-5 w-5 mb-1" />
              <span className="text-xs">Search</span>
            </button>

            <button
              onClick={() => {
                router.push("/dashboard");
              }}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${
                pathname?.includes("/dashboard")
                  ? "text-primary font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LuPackageSearch className="h-5 w-5 mb-1" />
              <span className="text-xs">List Deal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDealSearch;
