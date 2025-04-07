import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Lock,
  Save,
  Unlock,
  X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdvertisementPayment from "../Advertisement";
import ImageCropper from "../shared/imagecrop/Imagecrop";

// Define types
interface Advertisement {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomAd {
  name: string;
  description: string;
  image: string;
}

const AdvertisementSelector = () => {
  // Add state for tracking ad purchase status
  const [bannerBought, setBannerBought] = useState(true);
  const [popupBought, setPopupBought] = useState(true);
  const [sidebarBought, setSidebarBought] = useState(false);
  const [featuredBought, setFeaturedBought] = useState(false);
  const [notificationBought, setNotificationBought] = useState(false);
  const [emailBought, setEmailBought] = useState(false);

  // State for custom ad content
  const [customBannerAd, setCustomBannerAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });
  const [customPopupAd, setCustomPopupAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });
  const [customSidebarAd, setCustomSidebarAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });
  const [customFeaturedAd, setCustomFeaturedAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });
  const [customNotificationAd, setCustomNotificationAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });
  const [customEmailAd, setCustomEmailAd] = useState<CustomAd>({
    name: "",
    description: "",
    image: "",
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [adTypes, setAdTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const router = useRouter();

  const handleImageUpload = async (croppedImage: string, type: string) => {
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

      // Add the uploaded image URL to the dealFormData.images
      if (result && result.url) {
        updateCustomAdContent(type, "image", result.url);
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

  // Fetch advertisements data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/advertisementdefination");

        if (!response.ok) {
          throw new Error("Failed to fetch advertisement data");
        }

        const data = await response.json();
        console.log("Fetched advertisement data:", data); // Add this for debugging
        setAdvertisements(data);
        
        // Extract ad types from the names in the fetched data
        // Trim whitespace and convert to uppercase for consistency
        const types = data.map((ad: Advertisement) => ad.name.trim().toUpperCase());
        setAdTypes(types);
        
        setLoading(false);
      } catch (err) {
        setError("Error fetching advertisement data. Please try again later.");
        setLoading(false);
        console.error("Error fetching advertisement data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle advertisement type selection
  const toggleAdType = (type: string) => {
    // Check if ad is already bought
    if (isAdBought(type)) {
      return;
    }

    let initialPrice = 0;

    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
      initialPrice -= Number(
        advertisements.find((item) =>
          item.name.trim().toUpperCase() === type
        )?.price
      );
    } else {
      setSelectedTypes([...selectedTypes, type]);
      initialPrice += Number(
        advertisements.find((item) =>
          item.name.trim().toUpperCase() === type
        )?.price
      );
    }

    selectedTypes.map((items) => {
      const price = advertisements.find((item) =>
        item.name.trim().toUpperCase() === items
      )?.price;
      if (price) {
        initialPrice = Number(initialPrice) + Number(price);
      }
    });

    setTotalPrice(initialPrice);
  };

  // Calculate total price
  const [totalPrice, setTotalPrice] = useState<string | number>(0);

  // Handle payment success
  const handlePaymentSuccess = () => {
    // Simulate purchase by setting the bought status for each selected type
    selectedTypes.forEach((type) => {
      buyAdvertisement(type);
    });

    // Clear selection
    setSelectedTypes([]);
    setTotalPrice(0);

    toast({
      title: "Purchase Successful",
      description: "Your advertisements have been purchased successfully.",
    });
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: `There was an error processing your payment: ${error}`,
      variant: "destructive",
    });
  };

  // Buy advertisement by type
  const buyAdvertisement = (type: string) => {
    switch (type) {
      case "BANNER":
        setBannerBought(true);
        break;
      case "POPUP ADVERTISEMENT":
        setPopupBought(true);
        break;
      case "SIDEBAR":
        setSidebarBought(true);
        break;
      case "FEATURED DEAL":
        setFeaturedBought(true);
        break;
      case "NOTIFICATION":
        setNotificationBought(true);
        break;
      case "EMAIL":
        setEmailBought(true);
        break;
    }
  };

  // Check if ad is already bought
  const isAdBought = (type: string): boolean => {
    switch (type) {
      case "BANNER":
        return bannerBought;
      case "POPUP ADVERTISEMENT":
        return popupBought;
      case "SIDEBAR":
        return sidebarBought;
      case "FEATURED DEAL":
        return featuredBought;
      case "NOTIFICATION":
        return notificationBought;
      case "EMAIL":
        return emailBought;
      default:
        return false;
    }
  };

  // Get custom ad content by type
  const getCustomAdContent = (type: string): CustomAd => {
    switch (type) {
      case "BANNER":
        return customBannerAd;
      case "POPUP ADVERTISEMENT":
        return customPopupAd;
      case "SIDEBAR":
        return customSidebarAd;
      case "FEATURED DEAL":
        return customFeaturedAd;
      case "NOTIFICATION":
        return customNotificationAd;
      case "EMAIL":
        return customEmailAd;
      default:
        return { name: "", description: "", image: "" };
    }
  };

  // Update custom ad content
  const updateCustomAdContent = (
    type: string,
    field: keyof CustomAd,
    value: string
  ) => {
    switch (type) {
      case "BANNER":
        setCustomBannerAd({ ...customBannerAd, [field]: value });
        break;
      case "POPUP ADVERTISEMENT":
        setCustomPopupAd({ ...customPopupAd, [field]: value });
        break;
      case "SIDEBAR":
        setCustomSidebarAd({ ...customSidebarAd, [field]: value });
        break;
      case "FEATURED DEAL":
        setCustomFeaturedAd({ ...customFeaturedAd, [field]: value });
        break;
      case "NOTIFICATION":
        setCustomNotificationAd({ ...customNotificationAd, [field]: value });
        break;
      case "EMAIL":
        setCustomEmailAd({ ...customEmailAd, [field]: value });
        break;
    }
  };

  // Save custom ad
  const saveCustomAd = (type: string) => {
    toast({
      title: "Advertisement Saved",
      description: `Your ${type} advertisement has been saved successfully.`,
    });
  };

  // Get advertisement by type
  const getAdByType = (type: string) => {
    return advertisements.find((item) =>
      item.name.trim().toUpperCase() === type
    );
  };

  // For banner navigation
  const handleBannerPrev = () => {
    setActiveBannerIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleBannerNext = () => {
    setActiveBannerIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading advertisement options...</p>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        {error}
      </div>
    );
  }

  // Render ad configuration form
  const renderAdConfigForm = (type: string) => {
    const customAd = getCustomAdContent(type);

    return (
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={customAd.name}
            onChange={(e) =>
              updateCustomAdContent(type, "name", e.target.value)
            }
            placeholder={`Enter your ${type} title`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={customAd.description}
            onChange={(e) =>
              updateCustomAdContent(type, "description", e.target.value)
            }
            placeholder={`Enter your ${type} description`}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <ImageCropper
            onImageCropped={(croppedImage) =>
              handleImageUpload(croppedImage, type)
            }
            type="cover"
          />
        </div>
        <Button onClick={() => saveCustomAd(type)} className="w-full">
          <Save size={16} className="mr-2" />
          Save {type} Advertisement
        </Button>
      </div>
    );
  };

  // Render different ad type previews
  const renderAdPreview = (type: string) => {
    const ad = isAdBought(type) ? getCustomAdContent(type) : getAdByType(type);
    if (!ad) return null;

    // Get title and description based on whether it's a bought ad or not
    const title = isAdBought(type) ? ad.name : ad.name;
    const description = isAdBought(type) ? ad.description : ad.description;
    const image = isAdBought(type) ? ad.image : ad.image;

    switch (type) {
      case "BANNER":
        return (
          <div className="w-full overflow-hidden">
            <div className="relative h-52 w-full bg-white shadow-md rounded overflow-hidden">
              {/* Show lock/unlock icon */}
              <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
                {isAdBought(type) ? (
                  <Unlock size={16} className="text-green-600" />
                ) : (
                  <Lock size={16} className="text-gray-600" />
                )}
              </div>

              {/* Banner with dots navigation instead of horizontal slider */}
              <div className="relative h-full w-full">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      i === activeBannerIndex
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="h-full w-full object-cover relative">
                      <Image
                        src={image}
                        alt={title}
                        layout="fill"
                        objectFit="fit"
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-top space-y-8 items-center pt-4">
                      <p className="text-white font-bold text-lg">{title}</p>
                      <p className="mt-2 text-sm text-white px-10 text-center">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Navigation dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBannerIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === activeBannerIndex
                          ? "bg-white scale-110"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow navigation */}
                <button
                  onClick={handleBannerPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleBannerNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1"
                  aria-label="Next banner"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        );

      case "POPUP ADVERTISEMENT":
        return (
          <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
            {/* Show lock/unlock icon */}
            <div className="absolute top-2 right-2 z-20 bg-white/80 rounded-full p-2">
              {isAdBought(type) ? (
                <Unlock size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
            </div>

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white shadow-lg rounded-lg w-4/5 max-w-md p-4 relative">
                {/* Enhanced cross/close button */}
                <button className="absolute top-2 right-2 text-gray-700 z-10 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                  <X size={16} />
                </button>
                <div className="flex flex-col items-center">
                  <div className="h-32 w-full object-cover relative">
                    <Image
                      src={image}
                      alt={title}
                      layout="fill"
                      objectFit="fit"
                      priority
                    />
                  </div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-center mt-2">{description}</p>
                  <Button size="sm" className="mt-3">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "SIDEBAR":
        return (
          <div className="flex">
            {/* Show lock/unlock icon */}
            <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
              {isAdBought(type) ? (
                <Unlock size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
            </div>

            <div className="w-2/3 bg-gray-100 h-64 p-4">
              <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-300">
                <p className="text-gray-500">Main Website Content</p>
              </div>
            </div>
            <div className="w-1/3 bg-white h-64 p-2 border-l border-gray-200">
              <div className="h-full flex flex-col rounded overflow-hidden shadow">
                <div className="h-1/2 w-full object-cover relative">
                  <Image
                    src={image}
                    alt={title}
                    layout="fill"
                    objectFit="fit"
                    priority
                  />
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-sm">{title}</h4>
                  <p className="text-xs mt-1">
                    {description.substring(0, 60)}...
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full text-xs"
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "FEATURED DEAL":
        return (
          <div className="w-full h-64 relative bg-gray-50 rounded-lg overflow-hidden">
            {/* Show lock/unlock icon */}
            <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
              {isAdBought(type) ? (
                <Unlock size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
            </div>

            <div className="h-full w-full object-cover relative">
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="fit"
                priority
              />
            </div>
            <div className="absolute inset-0 top-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
              <div className="flex space-x-5 items-center">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block w-fit mb-2">
                  FEATURED
                </span>
                <h3 className="text-white font-bold text-xl text-center -translate-y-1">
                  {title}
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-around">
                <p className="text-white/90 text-sm mt-1 px-8 text-center">
                  {description}
                </p>
                <Button className="mt-3 w-fit">Learn More</Button>
              </div>
            </div>
          </div>
        );

      case "NOTIFICATION":
        return (
          <div className="w-full">
            {/* Show lock/unlock icon */}
            <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
              {isAdBought(type) ? (
                <Unlock size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-3 max-w-sm mx-auto border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Bell size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {description.substring(0, 80)}...
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Button size="sm" variant="outline" className="text-xs mr-2">
                  Dismiss
                </Button>
                <Button size="sm" className="text-xs">
                  View
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-center text-gray-500">
              Notification appears in corner of screen
            </p>
          </div>
        );

      case "EMAIL":
        return (
          <div className="w-full bg-gray-50 p-4 rounded-lg">
            {/* Show lock/unlock icon */}
            <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
              {isAdBought(type) ? (
                <Unlock size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto">
              <div className="bg-blue-600 p-3 text-white">
                <h3 className="font-bold">Email Newsletter</h3>
              </div>
              <div className="p-4">
                <div className="h-32 w-full object-cover relative mb-4">
                  <Image
                    src={image}
                    alt={title}
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
                <h4 className="font-bold text-lg">{title}</h4>
                <p className="text-gray-600 mt-2">{description}</p>
                <Button className="w-full mt-4">Read More</Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <div className="relative h-48 bg-gray-100">
              <div className="h-full w-full object-cover relative">
                <Image
                  src={image}
                  alt={title}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </div>
            <CardContent className="pt-4">
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        );
    }
  };

  // Format advertisement name for display
  const formatAdTypeName = (typeName: string) => {
    // Convert "POPUP ADVERTISEMENT" to "Popup Advertisement" for display
    return typeName.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Advertisement Management</h1>

      {/* Advertisement type selector buttons */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Advertisement Types</h2>
        <div className="flex flex-wrap gap-2">
          {adTypes.map((type) => (
            <Button
              key={type}
              variant={
                isAdBought(type)
                  ? "default"
                  : selectedTypes.includes(type)
                  ? "default"
                  : "outline"
              }
              onClick={() => toggleAdType(type)}
              className={`min-w-32 ${
                isAdBought(type) ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              disabled={isAdBought(type)}
            >
              {isAdBought(type) ? (
                <>
                  <Unlock size={16} className="mr-2" />
                  {formatAdTypeName(type)}
                </>
              ) : (
                <>
                  {selectedTypes.includes(type) ? (
                    ""
                  ) : (
                    <Lock size={16} className="mr-2" />
                  )}
                  {formatAdTypeName(type)}
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Purchased ads section */}
      {(bannerBought ||
        popupBought ||
        sidebarBought ||
        featuredBought ||
        notificationBought ||
        emailBought) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Your Purchased Advertisements
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {adTypes.map(
              (type) =>
                isAdBought(type) && (
                  <div key={type} className="p-4 border rounded-lg relative">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Unlock size={16} className="mr-2 text-green-600" />
                      {formatAdTypeName(type)} Advertisement
                    </h3>
                    {renderAdConfigForm(type)}
                    <h4 className="font-medium mt-6 mb-3">Preview</h4>
                    {renderAdPreview(type)}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Preview section for selected but not purchased ads */}
      {selectedTypes.length > 0 && advertisements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Selected Advertisement Previews
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {selectedTypes.map(
              (type) =>
                !isAdBought(type) && (
                  <div key={type} className="p-4 border rounded-lg relative">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Lock size={16} className="mr-2 text-gray-600" />
                      {getAdByType(type)?.name}
                    </h3>
                    {renderAdPreview(type)}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Checkout section */}
      {selectedTypes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Selection</CardTitle>
            <CardDescription>
              You've selected {selectedTypes.length} advertisement type
              {selectedTypes.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {selectedTypes.map((type) => (
                <li key={type}>{getAdByType(type)?.name}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-4">
            <AdvertisementPayment
                selectedTypes={selectedTypes.map(type => {
                  const ad = advertisements.find(item => item.name.trim().toUpperCase() === type);
                  return ad?.id || ""; // Return the ID of the found advertisement or empty string if not found
                })}
              totalPrice={Number(totalPrice)}
              getAdByType={getAdByType}                                       
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AdvertisementSelector;