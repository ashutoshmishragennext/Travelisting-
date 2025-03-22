import React from "react";
import Image from "next/image";

const BusinessSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Create Account",
      description: "Enter your GST number to get started",
      image: "/create.jpg",
    },
    {
      id: 2,
      title: "Enter Business Details",
      description: "Add name, address, business hours and photos",
      image: "/second.webp",
    },
    {
      id: 3,
      title: "Select Categories",
      description: "Add relevant categories to your free listing page",
      image: "/third.jpg",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Get Your Business Listed in 3 Simple Steps
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center space-y-4 md:w-1/3"
          >
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <Image
                src={step.image}
                alt={`Step ${step.id}`}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h2 className="text-lg font-semibold">
              Step {index + 1}: {step.title}
            </h2>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessSteps;
