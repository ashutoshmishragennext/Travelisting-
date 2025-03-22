import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import ImageCropper from "../shared/imagecrop/Imagecrop";

interface SocialLinks {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

interface VendorData {
  companyName?: string;
  legalEntityType?: string;
  taxId?: string;
  establishmentYear?: number;
  socialLinks?: SocialLinks;
  logo?: string;
  coverImage?: string;
  businessOpeningDays?: string[];
  businessTiming?: { start: string; end: string };
  state?: string;
  city?: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  headquartersAddress?: string;
  operatingCountries?: string[];
}

interface VendorBasicInfoProps {
  data: VendorData;
  updateData: (data: Partial<VendorData>) => void;
}

const VendorBasicInfo: React.FC<VendorBasicInfoProps> = ({
  data,
  updateData,
}) => {
  const [loading, setLoading] = useState(false);
  const addressInputRef = useRef(null);

  const handleCroppedImage = async (
    croppedImage: string,
    type: "logo" | "cover"
  ) => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("image", blob, `${type}-image.jpg`);

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");

      const result = await response.json();
      updateData({ [type === "logo" ? "logo" : "coverImage"]: result.url });
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
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    const cleanedPincode = pincode.replace(/\D/g, "").slice(0, 6);
    updateData({ pincode: cleanedPincode });

    if (cleanedPincode.length === 6) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${cleanedPincode}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          updateData({
            state: postOffice.State,
            city: postOffice.District,
          });

          toast({
            title: "Location details updated",
            description: `${postOffice.District}, ${postOffice.State}`,
            variant: "default",
          });
        } else {
          updateData({ state: "", city: "" });
          toast({
            title: "Invalid pincode",
            description: "Please enter a valid 6-digit pincode",
            variant: "destructive",
          });
        }
      } catch (error) {
        updateData({ state: "", city: "" });
        toast({
          title: "Error fetching location details",
          description: "Please check your pincode and try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-x-12 flex flex-col md:flex-row gap-8 ">
      <div className="w-full md:w-1/2">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Enter Basic Business Details
          </h2>
          <div className="flex justify-between items-center">
            <div className="border-b-4 border-primary w-32 "></div>
            <div className="border-b-4 border-gray-200 w-32"></div>
            <div className="border-b-4 border-gray-200 w-32"></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <Input
              type="text"
              value={data.companyName || ""}
              onChange={(e) => updateData({ companyName: e.target.value })}
              className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="Business Name"
            />
          </div>

          {/* Pincode */}
          <div>
            <Input
              type="text"
              value={data.pincode || ""}
              onChange={(e) => handlePincodeChange(e.target.value)}
              className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="Pincode"
              maxLength={6}
              disabled={loading}
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <Input
              type="text"
              value={data.addressLine1 || ""}
              onChange={(e) => updateData({ addressLine1: e.target.value })}
              className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="Address Line 1"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <Input
              type="text"
              value={data.addressLine2 || ""}
              onChange={(e) => updateData({ addressLine2: e.target.value })}
              className="w-full bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="Address Line 2"
            />
          </div>

          {/* City and State in same row */}
          <div className="flex gap-4">
            <Input
              type="text"
              value={data.city || ""}
              onChange={(e) => updateData({ city: e.target.value })}
              className=" bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="City"
            />
            <Input
              type="text"
              value={data.state || ""}
              onChange={(e) => updateData({ state: e.target.value })}
              className=" bg-gray-50 rounded-lg p-3 text-gray-700"
              placeholder="State"
            />
          </div>
          <div className="flex gap-4">
            <ImageCropper
              onImageCropped={(croppedImage) =>
                handleCroppedImage(croppedImage, "logo")
              }
              type="logo"
            />
            <ImageCropper
              onImageCropped={(croppedImage) =>
                handleCroppedImage(croppedImage, "cover")
              }
              type="cover"
            />
          </div>

          {/* Save and Continue Button */}
          <button
            className="w-full bg-primary text-white py-3 px-6 rounded-lg mt-4 hover:bg-[#d58829d4] transition duration-300"
            onClick={() => {
              toast({
                title: "Information Saved",
                variant: "default",
              });
            }}
          >
            Save and Continue
          </button>
        </div>
      </div>

      {/* Right Side - Mobile Preview */}
      <div className="w-full md:w-1/2 flex justify-center items-start">
        <div className="relative bg-gray-900 rounded-3xl p-3 shadow-xl max-w-xs">
          <div className="relative bg-white rounded-2xl overflow-hidden h-[500px] w-64">
            {/* Preview Content */}
            <div>
              {data.coverImage ? (
                <img
                  src={data.coverImage}
                  alt="Business Cover"
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 bg-gray-200"></div>
              )}

              <div className="p-4 relative">
                {/* Business Card */}
                <div className="bg-white rounded-lg shadow-md p-3 mb-4 -mt-6 relative z-10">
                  <div className="flex items-center">
                    <div className="w-14 h-14 mr-3 bg-gray-100 rounded-md overflow-hidden">
                      {data.logo ? (
                        <img
                          src={data.logo}
                          alt="Business Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {data.companyName || "Business Name"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Restaurant and Coffee
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.city && data.state
                          ? `${data.city}, ${data.state}`
                          : "Location"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Reviews</h4>
                  <div className="flex items-center">
                    <div className="flex text-amber-500">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      (101 Reviews)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Open until 9:00 PM today - 9:30 AM to 9:00 PM
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">
                    Message
                  </button>
                  <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">
                    Call
                  </button>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Items</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 rounded-lg h-16"></div>
                    <div className="bg-gray-100 rounded-lg h-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden image uploaders */}
    </div>
  );
};

export default VendorBasicInfo;
