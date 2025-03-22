import React from 'react';
import Image from 'next/image';

interface JobSearchLandingProps {
  // Add any props if needed
}

const JobSearchLanding: React.FC<JobSearchLandingProps> = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <h1 className="text-center text-2xl md:text-3xl font-semibold mb-12">
        A smarter way to register vendors
      </h1>

      {/* Job Seekers Section */}
      <div className="flex flex-col md:flex-row items-center bg-gold-100 rounded-xl p-8 mb-6">
        <div className="w-48 h-48 md:mr-12 mb-6 md:mb-0 relative">
          <Image
            src="/img2.jpg"
            alt="Vendor registration"
            layout="fill"
            objectFit="cover"
            className="rounded-full group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-3">What we offer vendors</h2>
          <p className="text-gray-600">
            We provide an easy and efficient way for vendors to register their products and services, ensuring maximum visibility and streamlined processes.
          </p>
        </div>
      </div>

      {/* Employers Section */}
      <div className="flex flex-col md:flex-row-reverse items-center bg-gold-100 rounded-xl p-8 mb-6">
        <div className="w-48 h-48 md:ml-12 mb-6 md:mb-0 relative">
          <Image
            src="/service.webp"
            alt="Service providers"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-3">What we offer service providers</h2>
          <p className="text-gray-600">
            Our platform enables service providers to showcase their expertise, connect with clients, and grow their business with targeted exposure and reliable leads.
          </p>
        </div>
      </div>

      {/* How We Do It Section */}
      <div className="flex flex-col md:flex-row items-center bg-gold-100 rounded-xl p-8">
        <div className="w-48 h-48 md:mr-12 mb-6 md:mb-0 relative">
          <Image
            src="/img3.jpg"
            alt="Our process"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-3">How we make it seamless</h2>
          <p className="text-gray-600">
            We leverage cutting-edge technology and user-friendly design to make vendor registration quick, easy, and accessible, while ensuring compliance with industry standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSearchLanding;
