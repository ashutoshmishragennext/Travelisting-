"use client";

import Loader from "@/components/shared/Loader";
import { useState, useEffect } from "react";
import {
  CurrencyIcon,
  BriefcaseIcon,
  UserIcon,
  CheckCircleIcon,
} from "lucide-react";

export default function VendorDetails({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/get/services/${params.id}`);
        const result = await response.json();
        setService(result);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  if (!service) {
    return <Loader />;
  }

  const { name, description, requiredCertifications, category, vendors } =
    service;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">{name}</h1>
        <p className="text-lg text-gray-600 mb-4">{description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Category</h2>
          <p className="text-gray-600">{category?.name}</p>
          <p className="text-sm text-gray-500">{category?.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Required Certifications
          </h2>
          <ul className="list-disc pl-6 text-gray-600">
            {requiredCertifications?.map((cert: any, index: any) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>

        {/* <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Vendors</h2>
          {vendors?.map((vendor: any) => (
            <div key={vendor.id} className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-800">{`Vendor ID: ${vendor.vendorId}`}</h3>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    vendor.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {vendor.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center space-x-4">
                  <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">{`Experience: ${vendor.experienceYears} years`}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <CurrencyIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">
                    {`Pricing Model: ${vendor.pricingModel}`} (Range:{" "}
                    {vendor.currency} {vendor.rateRangeMin} -{" "}
                    {vendor.rateRangeMax})
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <CheckCircleIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">{`Clients Served: ${vendor.clientCount}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-12">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                Contact Us
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
                gentrify.
              </p>
            </div>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                  </div>
                </div>
                <div className="p-2 w-full">
                  <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Button
                  </button>
                </div>
                <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                  <a className="text-indigo-500">example@email.com</a>
                  <p className="leading-normal my-5">
                    49 Smith St.
                    <br/>Saint Cloud, MN 56301
                  </p>
                  <span className="inline-flex">
                    <a className="text-gray-500">
                      <svg
                        fill="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </a>
                    <a className="ml-4 text-gray-500">
                      <svg
                        fill="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </a>
                    <a className="ml-4 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                      </svg>
                    </a>
                    <a className="ml-4 text-gray-500">
                      <svg
                        fill="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
