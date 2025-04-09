"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import FoodCarousel from "./shared/Banner";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  logo: string;
}

export default function CombinedLayout() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const carouselData = [
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8901",
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902",
    },
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8902",
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902",
    },
    // Add as many items as you need
  ];

  // Category state
  const [activeTab, setActiveTab] = useState<"services" | "products">(
    "services"
  );
  const [services, setServices] = useState<Category[]>([]);
  const [products, setProducts] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Category[]>([]);
  const [profile, setProfile] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const role = useCurrentRole();
  const user = useCurrentUser();
  const [showAll, setShowAll] = useState(false);
  const initialItemsCount = {
    mobile: 4, // 2 columns × 2 rows for mobile
    tablet: 6, // 3 columns × 2 rows for tablet
    desktop: 6, // 6 columns × 1 row for desktop
  };

  useEffect(() => {
    if (!profile) {
      setIsOpen(true);
    }
  }, [profile]);

  // If profile is false, don't render anything
  // if (!profile) return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await fetch(`/api/serviceCategory`);
        const servicesResult = await servicesResponse.json();
        setServices(servicesResult);

        const productsResponse = await fetch(`/api/productCategory`);
        const productsResult = await productsResponse.json();
        setProducts(productsResult);

        setFilteredItems(
          activeTab === "services" ? servicesResult : productsResult
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkVendorProfile = async () => {
      if (role === "USER") {
        try {
          const response = await fetch(`/api/users?id=${user?.id}`);
          const data = await response.json();

          if (data && data.length > 0) {
            const vendorData = data[0];

            if (vendorData.vendorProfileId === null) {
              setProfile(false);
            } else if (vendorData.vendorProfileId) {
              setProfile(true);
            }
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          // Handle error case - redirect to a default route or show error message
        }
      }
    };

    checkVendorProfile();
  }, [role]);

  useEffect(() => {
   
  }, [searchTerm, services, products, activeTab]);

  

  const allItems = activeTab === "services" ? services : products;

  const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  const handleNavigate = (id: string) => {
    router.push(`/${activeTab}Categories/${id}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };


  return (
    <div className="min-w-full z-50">
      {/* Navigation Bar */}
      <nav className="bg-white">
        <div className="flex items-center justify-between p-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex space-x-1">
                <Image src="/logo.jpg" height={40} width={40} alt="Logo" />
                <h1 className="text-primary text-2xl font-normal">
                  Travelisting
                </h1>
              </div>
            </Link>
          </div>

          {/* Search and Category Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
            {/* Category Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center space-x-2 hover:bg-primary-foreground"
              >
                <span>
                  {activeTab === "services" ? "Services" : "Products"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleTabChange("services")}
                    className={`w-full text-left px-4 py-2 hover:bg-primary-foreground ${
                      activeTab === "services" ? "text-primary" : ""
                    }`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => handleTabChange("products")}
                    className={`w-full text-left px-4 py-2 hover:bg-primary-foreground ${
                      activeTab === "products" ? "text-primary" : ""
                    }`}
                  >
                    Products
                  </button>
                </div>
              )}
            </div> */}

            {/* Search Bar */}
            {/* <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border rounded-full shadow-lg shadow-[#d588290f] focus:outline-none focus:border-primary focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div> */}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login">
                  <button className="hover:text-primary">Sign In</button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary-foreground">
                    Join now
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-primary-foreground"
                >
                  <span className="text-primary">{session?.user?.name}</span>
                  <svg
                    className={`w-4 h-4 text-primary transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 z-50 bg-white rounded-md shadow-lg py-1">
                    <Link href="/dashboard">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-light">
                        Dashboard
                      </button>
                    </Link>
                    <form action={handleLogout}>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-light"
                        disabled={isLoading}
                      >
                        Sign Out {isLoading ? "..." : ""}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="text-primary focus:outline-none"
    aria-label="Toggle mobile menu"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          mobileMenuOpen
            ? "M6 18L18 6M6 6l12 12"
            : "M4 6h16M4 12h16M4 18h16"
        }
      />
    </svg>
  </button>
</div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
  <>
    {/* Overlay to close the menu when clicking outside */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={() => setMobileMenuOpen(false)}
    />
    
    {/* Sliding menu from right */}
    <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Menu header with close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className=" flex space-x-1 items-center">
          <Image src="/logo.jpg" height={40} width={40} alt="Logo" />
          <span className="font-medium text-lg text-primary">Travelisting</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <Link href="/auth/login">
                <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Join now
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="py-3 border-b border-gray-100">
                <p className="text-primary font-medium">{session?.user?.name}</p>
                <p className="text-gray-500 text-sm">{session?.user?.email}</p>
              </div>
              <Link href="/dashboard">
                <button className="w-full text-left py-3 border-b border-gray-100 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
              </Link>
              <form action={handleLogout}>
                <button
                  className="w-full text-left py-3 border-b border-gray-100 flex items-center text-red-500"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out {isLoading ? "..." : ""}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
)}
      </nav>

      {/* Category Grid Section */}

      {/* <FoodCarousel items={carouselData} /> */}

      <>
        {/* Popup Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                List Your Business
              </h2>
              <p className="text-gray-600 mb-6">
                Get your business listed and reach more customers!
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                {/* <Button
                  onClick={() => {
                    setIsOpen(false);
                    setProfile(false);
                  }}
                  className="bg-gray-400 text-white"
                >
                  Cancel
                </Button> */}
                <Button
                  onClick={() => (window.location.href = "/dashboard/admin")}
                  className="bg-primary hover:bg-primary text-white"
                >
                  List Business
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </>
      <div className="w-full bg-gray-50">
        {/* <div className="flex  items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Featured {activeTab}
          </h2>
          <button
            onClick={toggleShowAll}
            className="text-sm pl-3 pt-1 font-medium text-gray-700 hover:text-gray-800-hover flex items-center transition-colors duration-200"
          >
            {showAll ? "Show Less" : "See All"}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={showAll ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
              ></path>
            </svg>
          </button>
        </div> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          
        </div>

        {/* {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-8 py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-lg font-medium">
              No {activeTab} found matching your search.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria.
            </p>
          </div>
        )} */}

        {allItems.length > initialItemsCount.desktop && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={toggleShowAll}
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg shadow-md transition-colors duration-200 font-medium flex items-center"
            >
              {showAll
                ? "Show Less"
                : `See All ${allItems.length} ${activeTab}`}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={showAll ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
