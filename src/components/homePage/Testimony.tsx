"use client";

import { useState, useEffect } from "react";
import { QuoteIcon } from "lucide-react";

const TestimonialSection = ({ vendorId }: { vendorId: string }) => {
  const [vendorReferences, setVendorReferences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferences = async () => {
      setIsLoading(true); // Set loading state to true before fetch
      try {
        const response = await fetch(
          `/api/vendorReferences?vendorId=${vendorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendor references.");
        }
        const referencesResult = await response.json();
        console.log(referencesResult);
        setVendorReferences(referencesResult);
      } catch (error: any) {
        console.log("error", error);
        setError(
          error.message || "An error occurred while fetching vendor references."
        );
      } finally {
        setIsLoading(false); // Set loading state to false after fetch attempt
      }
    };

    fetchReferences();
  }, [vendorId]);

  if (isLoading) {
    return <p className="text-gray-500">Loading testimonials...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!vendorReferences || vendorReferences.length === 0) {
    return (
      <p className="text-gray-500">
        No testimonials available for this vendor.
      </p>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Client Testimonials
      </h2>
      <div className="space-y-6">
        {vendorReferences.map((reference) => (
          <div
            key={reference.id}
            className="p-6 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <QuoteIcon className="h-6 w-6 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">
                {reference.clientCompanyName || "No company name provided"}
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              {reference.projectDescription ||
                "No project description available"}
            </p>

            <div className="mt-4">
              <span className="text-sm font-semibold text-gray-500">{`Industry: ${
                reference.clientIndustry || "Industry not provided"
              }`}</span>
              <div className="text-sm text-gray-500 mt-1">
                {`Project Period: ${
                  reference.servicePeriodStart
                    ? new Date(
                        reference.servicePeriodStart
                      ).toLocaleDateString()
                    : "Start date not available"
                } - ${
                  reference.servicePeriodEnd
                    ? new Date(reference.servicePeriodEnd).toLocaleDateString()
                    : "End date not available"
                }`}
              </div>
            </div>

            {reference.isPublic &&
            reference.contactPersonName &&
            reference.contactEmail ? (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800">{`Contact Person: ${reference.contactPersonName}`}</h4>
                <p className="text-sm text-gray-500">{`Email: ${reference.contactEmail}`}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Contact details not available.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
