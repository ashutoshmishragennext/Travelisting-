import React from "react";

interface BrandGridProps {
  brands: string[]; // Change to accept an array of strings
}

const BrandGrid: React.FC<BrandGridProps> = ({ brands }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Our Customers*</h1>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {brands?.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-4 rounded-lg shadow hover:shadow-lg"
          >
            <img
              src={brand} // Directly use the string as the src
              alt={`Brand ${index + 1}`} // Provide a fallback alt text
              className="max-h-18 object-contain"
              title={`Brand ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
