// components/BrandGrid.tsx
import Image from "next/image";
import React from "react";

interface Brand {
  name: string;
  logo: string;
}

interface BrandGridProps {
  brands: Brand[];
}

const BrandGrid: React.FC<BrandGridProps> = ({ brands }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Our Customers*</h1>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-4  rounded-lg shadow hover:shadow-lg"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              height={96}
              width={96}
              className=" object-contain"
              // title={brand.name}
            />
          </div>
        ))}
      </div>
      {/* <p className="mt-4 text-sm text-gray-500 text-center">
        *These trademarks or logos are used for illustration purposes only & we disclaim any specific connection with the brand in this regard.
      </p> */}
    </div>
  );
};

export default BrandGrid;
