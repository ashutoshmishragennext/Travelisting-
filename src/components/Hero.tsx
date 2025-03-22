"use client";
"use cache";
import React, { useState, useEffect } from "react";
import Hero from "@/components/homePage/Hero";
import ExploreCompanies from "@/components/homePage/ExploreCompanies";
import JobBoard from "@/components/homePage/JobBoard";
import Loader from "@/components/shared/Loader";
import BusinessSteps from "./home/Steps";
import JobSearchLanding from "./Mid";
import Sponser from "./homePage/Sponser";
import WhyChooseUs from "./homePage/Whychoswus";
import ServiceCategories from "./homePage/Service";
import ExploreCities from "./shared/exporeCities";
// import SimpleNavigation from "./SimpleNavigation";
interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl?: string;
}

interface Service {
  id: string;
  name: string;
  image: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
}

interface ServiceCategoriesProps {
  categories: ServiceCategory[];
  servicesMap: Record<string, Service[]>;
  loading?: boolean;
  error?: string | null;
}

export default function Hero1() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        ("use cache");
        const response = await fetch("/api/get/vendor");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();

        // Filter vendors based on paymentStatus
        const formattedCompanies = data
          .filter((vendor: any) => vendor.paymentStatus === "success") // Filter condition
          .map((vendor: any) => ({
            id: vendor.id,
            name: vendor.companyName,
            image: vendor.logo || "/ashu.jpg",
            headquartersAddress: vendor.headquartersAddress,
            city: vendor.city,
            pincode: vendor.pincode,
          }));

        setVendors(formattedCompanies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching vendor data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        ("use cache");
        const response = await fetch("/api/serviceCategory");
        const data = await response.json();

        const servicesData: Record<string, Service[]> = {};

        // Add a limit parameter to your API call
        await Promise.all(
          data.map(async (category: ServiceCategory) => {
            // Modify your API endpoint to accept a limit parameter
            "use cache";
            const serviceResponse = await fetch(
              `/api/service?id=${category.id}`
            );
            const services = await serviceResponse.json();
            // setCategories(["c8008a6d-5c03-47d3-8ecb-d52198d02a0e"]);
            setServicesMap(services);
            if (services.length > 0) {
              servicesData[category.id] = services;
            }
          })
        );

        const categoriesWithServices = data.filter(
          (category: ServiceCategory) => servicesData[category.id]?.length > 0
        );

        setCategories(categoriesWithServices);
        setServicesMap(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* <Hero /> */}
      {/* <ServiceCategories
        categories={categories}
        servicesMap={servicesMap}
        loading={loading}
        error={error}
      /> */}
      <ExploreCities/>

      {/* <SimpleNavigation /> */}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <JobBoard
            sections={[
              {
                category: "Featured Companies",
                items: vendors,
              },
              // {
              //   category: "Recently Added",
              //   items: vendors.slice(6, 12),
              // },
            ]}
          />

          {/* <ExploreCompanies companies={vendors} /> */}

          <BusinessSteps />
          <JobSearchLanding />
          <Sponser />
          <WhyChooseUs />
        </>
      )}
    </main>
  );
}
