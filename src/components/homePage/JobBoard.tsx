import React, { useState } from "react";
import CompanyCard from "./CompanyCard";

interface JobBoardProps {
  sections: {
    category: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
      location?: string;
      industry?: string;
      size?: string;
    }>;
  }[];
}

const JobBoard = ({ sections }: JobBoardProps) => {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section className="w-full px-3 sm:px-5 py-3 sm:py-8 bg-gray-50">
      {sections.map((section, index) => (
        <div key={index} className="">
          <div className="flex  items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {section.category}
            </h2>

            <button
              onClick={toggleShowAll}
              className="text-sm pl-3 pt-2 font-medium text-primary hover:text-primary-hover flex items-center transition-colors duration-200"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-5">
            {section.items
              .slice(0, showAll ? section.items.length : 4)
              .map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default JobBoard;
