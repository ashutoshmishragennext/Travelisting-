import React from "react";
import Image from "next/image";

const companies = [
  {
    category: "Globalbiz picks",
    items: [
      {
        name: "Transportation Security Administration",
        image: "/tsa.jpg",
        location: "Springfield, VA",
        industry: "Consumer Goods & Services, Government",
      },
      {
        name: "Wells Fargo",
        image: "/wellsfargo.jpg",
        location: "Multiple Locations",
        industry: "Banking",
      },
      {
        name: "Hudson River Trading",
        image: "/hrt.jpg",
        location: "Austin, TX",
        industry: "Finance",
      },
    ],
  },
  {
    category: "Actively Hiring Companies",
    items: [
      {
        name: "Atlassian",
        image: "/atlassian.jpg",
        location: "Austin, TX",
        industry: "Software",
      },
      {
        name: "Surescripts",
        image: "/surescripts.jpg",
        location: "Arlington, VA",
        industry: "Healthcare",
      },
      {
        name: "Capital One",
        image: "/capitalone.jpg",
        location: "Chicago, IL",
        industry: "Banking",
      },
    ],
  },
  {
    category: "Innovative Companies",
    items: [
      {
        name: "Zoom",
        image: "/zoom.jpg",
        location: "Multiple Locations",
        industry: "Technology",
      },
      {
        name: "ORIX Corporation USA",
        image: "/orix.jpg",
        location: "Manhattan, NY",
        industry: "Finance",
      },
      {
        name: "GeoBlue",
        image: "/geoblue.jpg",
        location: "King of Prussia, PA",
        industry: "Healthcare",
      },
    ],
  },
];

const ExploreCompanies = () => {
  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Explore Service Providers
      </h2>

      {companies.map((section, index) => (
        <div key={index} className="mx-24 mb-20">
          <h3 className="text-xl font-semibold mb-4">{section.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {section.items.map((company, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={company.image}
                    alt={company.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">{company.name}</h4>
                  <p className="text-sm text-gray-600">{company.location}</p>
                  <p className="text-sm text-gray-500">{company.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ExploreCompanies;
