import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CompanyCard from "./CompanyCard";

interface Company {
  id: string;
  name: string;
  image: string;
}

interface ExploreCompaniesProps {
  companies: Company[];
}

const ExploreCompanies = ({ companies }: ExploreCompaniesProps) => {
  console.log("company",companies);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleItems = isMobile ? 1 : 3;
  const itemWidthPercentage = 100 / visibleItems;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? companies.length - visibleItems : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= companies.length - visibleItems ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Explore Service Providers
        </h2>
        <div className="relative flex items-center">
          <button
            className="absolute -left-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * itemWidthPercentage
                }%)`,
              }}
            >
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-2"
                >
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute -right-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
            onClick={handleNext}
            aria-label="Next"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default ExploreCompanies;
