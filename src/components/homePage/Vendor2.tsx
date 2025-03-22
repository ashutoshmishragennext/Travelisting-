"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const ExploreCompanies = ({ companies }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determines the number of visible items based on screen size
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const visibleItems = isMobile ? 1 : 3; // 1 item for mobile, 3 for large screens
  const itemWidthPercentage = 100 / visibleItems;

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        isMobile
          ? prevIndex === 0
            ? companies.length - 1
            : prevIndex - 1 // Wraps around for mobile
          : prevIndex === 0
          ? companies.length - visibleItems
          : prevIndex - 1 // Wraps for large screens
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) =>
        isMobile
          ? (prevIndex + 1) % companies.length // Wraps around for mobile
          : (prevIndex + 1) % companies.length // Wraps for large screens
    );
  };

  return (
    <section className="px-4">
      <div className="relative flex items-center max-w-6xl mx-auto">
        {/* Left Arrow */}
        <button
          className="absolute left-0 bg-gray-200 p-4 rounded-full hover:bg-gray-300 text-xl z-10"
          onClick={handlePrev}
        >
          <ArrowLeft />
        </button>

        {/* Carousel Items */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * itemWidthPercentage}%)`,
            }}
          >
            {companies.map((company: any, index: any) => (
              <div
                key={index}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
              >
                <Link href={`/vendor/${company.id}`}>
                  <div className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-72">
                    <div className="relative h-48">
                      <Image
                        className="w-full h-48 object-cover"
                        src={company.image || company.url}
                        alt={company.name || company.title}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold">
                        {company.name || company.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 bg-gray-200 p-4 rounded-full hover:bg-gray-300 text-xl z-10"
          onClick={handleNext}
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  );
};

export default ExploreCompanies;
