// pages/index.tsx
import Link from 'next/link';
import React from 'react';

export default function Home2() {
  const data = {
    heroSection: {
      title: "List Your Business ",
      subtitle: "with India's No. 1 Local Search Engine",
      backgroundImage: "https://via.placeholder.com/1920x1080", // Replace with your actual image URL
      buttonText: "Get Started Now",
      benefits: [
        "Expand Your Business Online",
        "Respond to Reviews & Queries Faster",
        "Showcase Your Products & Services",
      ],
    },
    stats: {
      buyers: "19.8 Crore+ Buyers",
      customers: "5.9 Lakh+ Happy Customers",
      businesses: "4.6 Crore+ Businesses Listed",
    },
  };

  return (
    <div className=" ">
      {/* Hero Section */}
      <section
  className="relative bg-cover bg-center bg-no-repeat text-white p-8 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
  style={{
    backgroundImage: `url(${'https://hikerwolf.com/wp-content/uploads/2020/07/India.jpg.webp'})`,
    minHeight: "500px",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 hover:bg-opacity-60"></div>
  {/* Content */}
  <div className="relative z-10 flex flex-col my-[8%] justify-center items-center text-center h-full">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
      {data.heroSection.title}
    </h1>
    <p className="text-lg md:text-xl text-gray-200 mb-6 animate-fade-in delay-200">
      {data.heroSection.subtitle}
    </p>
    <Link href="/dashboard/admin">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow-lg transition duration-300 transform hover:scale-105">
        {data.heroSection.buttonText}
      </button>
    </Link>
    {/* Benefits */}
    <ul className="mt-6 space-y-2">
      {data.heroSection.benefits.map((benefit, index) => (
        <li key={index} className="flex items-center text-gray-300 animate-fade-in delay-300">
          <span className="text-green-400 mr-3">✔</span> {benefit}
        </li>
      ))}
    </ul>
  </div>
</section>

<style jsx>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease forwards;
  }
`}</style>


      {/* Stats Section */}
      <section className="text-center mt-12">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Impact</h2>
  <div className="flex flex-col lg:flex-row justify-around bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-md shadow-lg">
    <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform hover:scale-105 mb-4 lg:mb-0 lg:mr-4">
      <h3 className="text-3xl font-bold text-gray-800">{data.stats.buyers}</h3>
      <p className="text-gray-600">Buyers</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform hover:scale-105 mb-4 lg:mb-0 lg:mr-4">
      <h3 className="text-3xl font-bold text-gray-800">{data.stats.customers}</h3>
      <p className="text-gray-600">Customers</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform hover:scale-105 mb-4 lg:mb-0">
      <h3 className="text-3xl font-bold text-gray-800">{data.stats.businesses}</h3>
      <p className="text-gray-600">Businesses</p>
    </div>
  </div>
</section>


    </div>
  );
}
