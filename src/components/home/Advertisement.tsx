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
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdvertisementPayment from "../Advertisement";
import { useCurrentUser } from "@/hooks/auth";
import ImageCropperWithSize from "../shared/imagecrop/ImageCropWithSize";

// Define types
interface Advertisement {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  timePeriod : string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UserAd {
  id: string;
  title: string;
  AdvertisementTypeId: string;
  type: string;
  content: string;
  imageUrl: string;
  redirectUrl: string;
  startDate: string;
  paymentId: string;
  endDate: string;
  isActive: boolean;
  targetAudience: string;
  metrics: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomAd {
  name: string;
  description: string;
  image: string;
  redirectUrl: string; // Add this line
}
const AdvertisementSelector = () => {
  // Add state for tracking ad purchase status
  const [bannerBought, setBannerBought] = useState(false);
  const [popupBought, setPopupBought] = useState(false);
  const [sidebarBought, setSidebarBought] = useState(false);
  const [featuredBought, setFeaturedBought] = useState(false);
  const [notificationBought, setNotificationBought] = useState(false);
  const user = useCurrentUser();

  // Add state for user's existing ads
  const [userAds, setUserAds] = useState<UserAd[]>([]);
  const [userAdMap, setUserAdMap] = useState<Record<string, UserAd>>({});

  // State for custom ad content
  const [customBannerAd, setCustomBannerAd] = useState<CustomAd>({
    name: " ",
    description: " ",
    image: "",
    redirectUrl: "", 

  });
  const [customPopupAd, setCustomPopupAd] = useState<CustomAd>({
    name: " ",
    description: " ",
    image: "",
    redirectUrl: "", 

  });
  const [customSidebarAd, setCustomSidebarAd] = useState<CustomAd>({
    name: " ",
    description: " ",
    image: "",
    redirectUrl: "", 

  });
  const [customFeaturedAd, setCustomFeaturedAd] = useState<CustomAd>({
    name: " ",
    description: " ",
    image: "",
    redirectUrl: "", 

  });
  const [customNotificationAd, setCustomNotificationAd] = useState<CustomAd>({
    name: " ",
    description: " ",
    image: "",
    redirectUrl: "", 

  });

  const [openForms, setOpenForms] = useState<Record<string, boolean>>({});

  // Open close content
  const toggleAdForm = (type: string) => {
    setOpenForms((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [adTypes, setAdTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'myAds' | 'buyAds' | null>('myAds');
  const [days, setDays] = useState({
    BANNER : '',
    NOTIFICATION : '',
    SIDEBAR : "",
    FEATURE : "",
    POPUP : ""
  });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch advertisement definitions
        const adResponse = await fetch("/api/advertisementdefination");
        if (!adResponse.ok) {
          throw new Error("Failed to fetch advertisement data");
        }
        const adData = await adResponse.json();
        setAdvertisements(adData);

        // Create an id to type mapping for advertisement definitions
        const adIdToTypeMap: any = {};
        adData.forEach((ad: any) => {
          adIdToTypeMap[ad.id] = ad.name.trim().toUpperCase();
        });

        // Extract ad types from the names in the fetched data
        const types = adData.map((ad: any) => ad.name.trim().toUpperCase());
        setAdTypes(types);

        // Fetch user's existing ads
        const userAdsResponse = await fetch(
          `/api/advertisements?vendorId=${user?.id}`
        );
        if (!userAdsResponse.ok) {
          throw new Error("Failed to fetch user advertisements");
        }
        const userAdsData = await userAdsResponse.json();

        if (userAdsData.success && userAdsData.data) {
          setUserAds(userAdsData.data);

          userAdsData.data.map((item:any) => {
            if(item.type.toUpperCase().includes("BANNER"))
              setCustomBannerAd({
                name: " ",
                description: " ",
                image: item.imageUrl,
                redirectUrl: item.redirectUrl,
              })
              if(item.type.toUpperCase().includes("POPUP"))
                setCustomPopupAd({
                  name: " ",
                  description: " ",
                  image: item.imageUrl,
                  redirectUrl: item.redirectUrl,
                })
                if(item.type.toUpperCase().includes("SIDEBAR"))
                  setCustomSidebarAd({
                    name: " ",
                    description: " ",
                    image: item.imageUrl,
                    redirectUrl: item.redirectUrl,
                  })
                  if(item.type.toUpperCase().includes("NOTIFICATION"))
                    setCustomNotificationAd({
                      name: " ",
                      description: " ",
                      image: item.imageUrl,
                      redirectUrl: item.redirectUrl,
                    })
                    if(item.type.toUpperCase().includes("FEATURE"))
                      setCustomFeaturedAd({
                        name: " ",
                        description: " ",
                        image: item.imageUrl,
                        redirectUrl: item.redirectUrl,
                      })
          })

          // Create a map for quick access
          const adMap: any = {};
          userAdsData.data.forEach((ad: any) => {
            // Use the AdvertisementTypeId to find the type
            const adType = adIdToTypeMap[ad.AdvertisementTypeId] || ad.type;
            ad.type = adType; // Ensure the ad has the correct type
            adMap[adType] = ad;
          });
          setUserAdMap(adMap);

          userAdsData.data.forEach((ad: any) => {
            const adType = adIdToTypeMap[ad.AdvertisementTypeId] || ad.type;
            setAdBoughtStatus(adType, true);

          });
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // Set ad bought status
  const setAdBoughtStatus = (type: string, isBought: boolean) => {
    switch (type) {
      case "BANNER":
        setBannerBought(isBought);
        break;
      case "POPUP ADVERTISEMENT":
      case "POPUP":
        setPopupBought(isBought);
        break;
      case "SIDEBAR":
        setSidebarBought(isBought);
        break;
      case "FEATURED DEAL":
      case "FEATURED":
        setFeaturedBought(isBought);
        break;
      case "NOTIFICATION":
        setNotificationBought(isBought);
        break;
    }
  };

  // Handle Price for advertisements
  const toggleAdType = (type: string) => {
    // Check if ad is already bought
    if (isAdBought(type)) {
      return;
    }
    let initialPrice = 0;
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
      initialPrice -= Number(
        advertisements.find((item) => item.name.trim().toUpperCase() === type)
          ?.price
      );
    } else {
      setSelectedTypes([...selectedTypes, type]);
      initialPrice += Number(
        advertisements.find((item) => item.name.trim().toUpperCase() === type)
          ?.price
      );
    }

    selectedTypes.map((items) => {
      const price = advertisements.find(
        (item) => item.name.trim().toUpperCase() === items
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
    window.location.reload();

    toast({
      title: "Purchase Successful",
      description: "Your advertisements have been purchased successfully.",
    });

  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    window.location.reload();
    toast({
      title: "Payment Failed",
      description: `There was an error processing your payment: ${error}`,
      variant: "destructive",
    });
  };

  // Buy advertisement by type
  const buyAdvertisement = (type: string) => {
    setAdBoughtStatus(type, true);
  };

  // Check if ad is already bought
  const isAdBought = (type: string): boolean => {
    switch (type) {
      case "BANNER":
        return bannerBought;
      case "POPUP ADVERTISEMENT":
      case "POPUP":
        return popupBought;
      case "SIDEBAR":
        return sidebarBought;
      case "FEATURED DEAL":
      case "FEATURED":
        return featuredBought;
      case "NOTIFICATION":
        return notificationBought;
      default:
        return false;
    }
  };

  // Get custom ad content by type
  const getCustomAdContent : any = (type: string): CustomAd => {
    switch (type) {
      case "BANNER":
        return customBannerAd;
      case "POPUP ADVERTISEMENT":
      case "POPUP":
        return customPopupAd;
      case "SIDEBAR":
        return customSidebarAd;
      case "FEATURED_DEAL":
      case "FEATURED DEAL":
      case "FEATURED":
        return customFeaturedAd;
      case "NOTIFICATION":
        return customNotificationAd;
      default:
        return { name: "", description: "", image: "" , redirectUrl : "" };
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
      case "POPUP":
        setCustomPopupAd({ ...customPopupAd, [field]: value });
        break;
      case "SIDEBAR":
        setCustomSidebarAd({ ...customSidebarAd, [field]: value });
        break;
      case "FEATURED DEAL":
      case "FEATURED":
        setCustomFeaturedAd({ ...customFeaturedAd, [field]: value });
        break;
      case "NOTIFICATION":
        setCustomNotificationAd({ ...customNotificationAd, [field]: value });
        break;
    }
  };

  // Save custom ad with PUT request to update existing ad
  const saveCustomAd = async (type2: string) => {
    try {
      let type = type2.toUpperCase()
      
      const adId = userAdMap[type]?.id;

      if (!adId) {
        toast({
          title: "Error",
          description: "Could not find advertisement to update",
          variant: "destructive",
        });
        return;
      }

      const customAd = getCustomAdContent(type);

      // Prepare data for update
      if(type.includes("FEATURE"))
        type = "FEATURED_DEAL"
      const advertisementId = adId;
      // Inside saveCustomAd function, update the updateData object
      const updateData = {
        title: customAd.name,
        content: customAd.description,
        imageUrl: customAd.image,
        redirectUrl: customAd.redirectUrl, // Add this line
        type: type === "POPUP ADVERTISEMENT" ? "POPUP" : type,
      };
      // Send PUT request to update ad
      const response = await fetch(`/api/advertisements?vendorId=${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ advertisementId, updateData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update advertisement");
      }

      toast({
        title: "Advertisement Updated",
        description: `Your ${formatAdTypeName(
          type
        )} advertisement has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating advertisement:", error);
      toast({
        title: "Update Failed",
        description: `There was an error updating your advertisement: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  // Get advertisement by type
  const getAdByType = (type: string) => {
    return advertisements.find(
      (item) => item.name.trim().toUpperCase() === type
    );
  };

  const getAdByTypeOfUser = (type: string) => {
    return userAds.find(
      (item) => item.type.trim().toUpperCase() === type
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
  const renderAdConfigForm = (type2: string) => {
    const type = type2.toUpperCase();
    const customAd = getCustomAdContent(type);
    const userAd = userAdMap[type];
    
    return (
      <div className="space-y-4 mb-6">
        
        
      
        <div>
          <label className="block text-sm font-medium mb-1">Redirect URL</label>
          <Input
            value={customAd.redirectUrl}
            onChange={(e) =>
              updateCustomAdContent(type, "redirectUrl", e.target.value)
            }
            placeholder="Enter the URL users will be sent to when clicking"
          />
        </div>
{ type.includes("POPUP") &&(
        <div>
          <ImageCropperWithSize
            onImageCropped={(croppedImage) =>
              handleImageUpload(croppedImage, type)
            }
            type="cover"
            fixedWidth={600} 
            fixedHeight={400} 
          />
        </div>
)} 
{ type.includes("BANNER") &&(
        <div>
          <ImageCropperWithSize
            onImageCropped={(croppedImage) =>
              handleImageUpload(croppedImage, type)
            }
            type="cover"
            fixedWidth={970} 
            fixedHeight={120} 
          />
        </div>
)}
{ type.includes("FEATURE") &&(
        <div>
          <ImageCropperWithSize
            onImageCropped={(croppedImage) =>
              handleImageUpload(croppedImage, type)
            }
            type="cover"
            fixedWidth={700} 
            fixedHeight={120} 
          />
        </div>
)}
{ type.includes("SIDEBAR") &&(
        <div>
          <ImageCropperWithSize
            onImageCropped={(croppedImage) =>
              handleImageUpload(croppedImage, type)
            }
            type="cover"
            fixedWidth={600} 
            fixedHeight={400} 
          />
        </div>
)}
        <Button
          onClick={() => saveCustomAd(type)}
          className="w-full"
          disabled={!userAdMap[type]?.id}
        >
          <Save size={16} className="mr-2" />
          Update {formatAdTypeName(type)} Advertisement
        </Button>
        {userAd && (
          <div className="text-xs text-gray-500 mt-1 font-bold">
            <p>Active until: {new Date(userAd.endDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    );
  };

  const calculateDays = (timePeriod: string | undefined): number => {
    if (!timePeriod) return 0;

    const dayMatch = timePeriod.match(/(\d+)D/);
    const monthMatch = timePeriod.match(/(\d+)M/);
    const yearMatch = timePeriod.match(/(\d+)Y/);

    const days = dayMatch ? parseInt(dayMatch[1]) : 0;
    const months = monthMatch ? parseInt(monthMatch[1]) : 0;
    const years = yearMatch ? parseInt(yearMatch[1]) : 0;

    return days + (months * 30) + (years * 365);
};

  const getValidity = (type2 : string): number => {
    const type = type2.toUpperCase();
    const adDays = advertisements.find(
      (item) => item.name.trim().toUpperCase() === type
    )?.timePeriod;

    const actualDays = calculateDays(adDays);


    return actualDays;
  }

  // Render different ad type previews
  const renderAdPreview = (type2: string) => {
    const type = type2.toUpperCase();
    const ad = isAdBought(type)  ? getCustomAdContent(type) : getAdByType(type);
    if (!ad) return null;

    const adDefination = advertisements.find(
      (item) => item.name.trim().toUpperCase() === type
    )?.description;


    // Get default image from ad definition when no custom image is available
    let defaultAdImage = "";
    if(!isAdBought(type))
      defaultAdImage = getAdByType(type)?.image || "/placeholder-image.jpg";
    else
      defaultAdImage = getAdByTypeOfUser(type)?.imageUrl || "/placeholder-image.jpg";

    // Get title and description based on whether it's a bought ad or not
    const title = isAdBought(type)
      ? ad.name || getAdByTypeOfUser(type)?.title  || ""
      :   ad.name || getAdByType(type)?.name ;
    const description = isAdBought(type)
      ? ad.description || getAdByTypeOfUser(type)?.content ||  ""
      : ad.description || getAdByType(type)?.description;
    const image = isAdBought(type) ? ad.image || defaultAdImage : ad.image;

    switch (type) {
      case "BANNER":
        return (

          <div>
            <div className=" p-4 flex flex-col ">
                <label className="block text-sm font-medium mb-1">Description</label>
                <div>{adDefination}</div>
              </div>
          <div
            className={`w-full overflow-hidden ${
              isAdBought(type) ? "hover:opacity-90 transition-opacity" : ""
            } `}
          >
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
                        objectFit="contain"
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-top space-y-8 items-center pt-4">
                <p className="text-white font-bold text-lg">{title || 'Advertisement'}</p>
                <div className='relative top-12'>
                  <p className="mt-2 text-sm text-white px-10 text-center">{description || 'Click to learn more'}</p>
                </div>
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
          </div>

        );

      case "POPUP ADVERTISEMENT":
      case "POPUP":
        return (

          
          <div>
            <div className=" p-4 flex flex-col ">
                <label className="block text-sm font-medium mb-1">Description</label>
                <div>{adDefination}</div>
              </div>

          <div
            className={` ${
              isAdBought(type) ? "hover:opacity-90 transition-opacity" : ""
            } `}
          >
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
                  <button className="absolute top-2 right-2 text-red-700 z-10 hover:text-red-800 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                    <X size={16} />
                  </button>
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-full object-cover relative">
                      <Image
                        src={image}
                        alt={title}
                        layout="fill"
                        objectFit="contain"
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
          </div>
          </div>

        );

      case "SIDEBAR":
        return (
          
          <div>
            <div className=" p-4 flex flex-col ">
                <label className="block text-sm font-medium mb-1">Description</label>
                <div>{adDefination}</div>
              </div>
          <div
            className={` ${
              isAdBought(type) ? "hover:opacity-90 transition-opacity" : ""
            } `}
          >
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
          </div>
          </div>
        );

      case "FEATURED DEAL":
      case "FEATURED":
        return (
          
          <div>
            <div className=" p-4 flex flex-col ">
                <label className="block text-sm font-medium mb-1">Description</label>
                <div>{adDefination}</div>
              </div>
          <div
            className={` ${
              isAdBought(type) ? "hover:opacity-90 transition-opacity" : ""
            }  w-[970px] ` }
          >
            <div className="w-full h-full relative bg-gray-50 rounded-lg overflow-hidden">
              {/* Show lock/unlock icon */}
              <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2">
                {isAdBought(type) ? (
                  <Unlock size={16} className="text-green-600" />
                ) : (
                  <Lock size={16} className="text-gray-600" />
                )}
              </div>

              <div className="h-[120px] w-[970px] object-cover relative my-2">
                <Image
                  src={image}
                  alt={title}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
              <div className="absolute inset-0 top-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
                <div className="flex space-x-5 items-center">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block w-fit mb-2">
                    FEATURED
                  </span>
                  
                </div>
              </div>
            </div>
          </div>
          </div>

        );

      case "NOTIFICATION":
        return (
          
          <div>
            <div className=" p-4 flex flex-col ">
                <label className="block text-sm font-medium mb-1">Description</label>
                <div>{adDefination}</div>
              </div>
          <div
            className={` ${
              isAdBought(type) ? "hover:opacity-90 transition-opacity" : ""
            } `}
          >
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

  const formatAdTypeName = (typeName: string) => {
    return typeName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


// Add this function to toggle sections
const toggleSection = (section: 'myAds' | 'buyAds') => {
  setActiveSection(prev => prev === section ? null : section);
};

return (
  <div className="container mx-auto px-4 py-8">
    <div className="flex gap-4 mb-6 max-w-64">
      <Button 
        variant={activeSection === 'myAds' ? 'default' : 'outline'} 
        onClick={() => toggleSection('myAds')}
        className="flex-1"
      >
        My Advertisements
      </Button>
      <Button 
        variant={activeSection === 'buyAds' ? 'default' : 'outline'} 
        onClick={() => toggleSection('buyAds')}
        className="flex-1"
      >
        Buy Advertisements
      </Button>
    </div>

    {/* My Ads Section */}
    {activeSection === 'myAds' && (
      <div className="mb-8 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          Your Purchased Advertisements
        </h2>
        
        {/* Buttons for purchased ads */}
        <div className="flex flex-wrap gap-2 mb-6">
          {adTypes.map((type) => 
            isAdBought(type) && (
              <Button
                key={type}
                variant={openForms[type] ? "default" : "outline"}
                onClick={() => toggleAdForm(type) }
                className="min-w-32"
              >
                <Unlock size={16} className="mr-2 text-green-600" />
                {formatAdTypeName(type)}
              </Button>
            )
          )}
        </div>
        
        {/* Display selected ad details */}
        <div className="grid grid-cols-1 gap-8">
          {adTypes.map(
            (type) =>
              isAdBought(type) && openForms[type] && (
                <div key={type} className="p-4 border rounded-lg relative">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Unlock
                      size={16}
                      className="mr-2 text-green-600"
                    />
                    {formatAdTypeName(type)} Advertisement
                  </h3>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Preview</h4>
                    <div className="cursor-pointer">
                      {renderAdPreview(type)}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-3">Edit Advertisement</h4>
                    {renderAdConfigForm(type)}
                  </div>
                </div>
              )
          )}
        </div>
        
        {!adTypes.some(type => isAdBought(type)) && (
          <div className="text-center py-8 text-gray-500">
            You haven't purchased any advertisements yet.
          </div>
        )}
      </div>
    )}

    {/* Buy Ads Section */}
    {activeSection === 'buyAds' && (
      <div className="mb-8 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Available Advertisement Types</h2>
        
        {/* Buttons for available ads */}
        <div className="flex flex-wrap gap-2 mb-6">
          {adTypes.map((type) => (
            !isAdBought(type) && (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                onClick={() => toggleAdType(type)}
                className={`min-w-32 ${
                  type.toLocaleLowerCase().includes("email") ? "hidden" : ""
                }`}
              >
                {selectedTypes.includes(type) ? (
                  formatAdTypeName(type)
                ) : (
                  <>
                    <Lock size={16} className="mr-2" />
                    {formatAdTypeName(type)}
                  </>
                )}
              </Button>
            )
          ))}
        </div>

        {/* Selected ads payment forms and payment sections */}
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
                  <li key={type} className=" font-bold">{getAdByType(type)?.name} <span className="font-normal">(Valid for : {getValidity(type)} Days)</span></li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-4">
              <AdvertisementPayment
                selectedTypes={selectedTypes.map((type) => {
                  const ad = advertisements.find(
                    (item) => item.name.trim().toUpperCase() === type
                  );
                  return ad?.id || "";
                })}
                totalPrice={Number(totalPrice)}
                getAdByType={getAdByType}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isTotalHide={false}
              />
            </CardFooter>
          </Card>
        )}

        {/* Preview section for selected but not purchased ads */}
        {selectedTypes.length > 0 && advertisements.length > 0 && (
          <div className="mb-8 mt-8">
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
      </div>
    )}

    {/* Show a message if no section is selected */}
    {!activeSection && (
      <div className="text-center py-16 text-gray-500">
        <h2 className="text-xl font-semibold mb-4">Advertisement Management</h2>
        <p>Please select "My Ads" to view and manage your purchased advertisements, or "Buy Ads" to browse available ad types.</p>
      </div>
    )}
  </div>
);
};

export default AdvertisementSelector;
