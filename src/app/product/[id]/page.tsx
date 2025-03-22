"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { MdVerified, MdLocationOn, MdShare } from 'react-icons/md';
import ReviewsAndRatings from '@/components/Rating';
import Navigation from '@/components/pages/Navbar';
import VendorImageGallery from '@/components/vendorpage/ImageGallery';
import Footer from '@/components/shared/Footer';
import Loader from '@/components/shared/Loader';
import BrandGrid from '@/components/product/Logo';
import ContactCard from '@/components/product/User';
import Navbar from '@/components/shared/Gennextfooter';

interface Params {
  id: string;
}

interface VendorService {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  currency: string;
}

interface Vendor {
  id: string;
  companyName: string;
  headquartersAddress: string;
  city: string;
  pincode: string;
  primaryContactPhone: string;
  whatsappnumber: string;
  businessOpeningDays: string[];
}

interface Service {
  id: string;
  name: string;
  categoryName: string;
}

interface VendorServiceDetails {
  experienceYears: number;
  photo: string[];
  description: string;
  price: number;
  currency: string;
}

interface ServiceData {
  success: boolean;
  vendorService: {
    vendor: Vendor;
    vendorServiceDetails: VendorServiceDetails;
    service: Service;
  };
}

interface WeatherCoolEngineersProps {
  params: Params;
}

const WeatherCoolEngineers: React.FC<WeatherCoolEngineersProps> = ({ params }) => {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [otherServices, setOtherServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const formatOpeningDays = (days: string[]): string => {
    return days.join(', ');
  };

  const brands = [
    { name: "LG", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAArlBMVEX///+kADNra2tmZmaxsbGiACtdXV1iYmKdnZ2gACPHx8fNoKy4Y3WcABWkADGjAC719fXs7Ozz6e6hACafABugAB9/f3+cABCioqLW1tb89/rYr7mXl5eySmPOzs5aWlqJiYnx4efixc7UprHcucK3W3KbAAnq09vmzdV1dXXi4uK8vLzHh5a+dIaOjo7JjJumIEPOmKW9bX+sPVmkFDqoJEa0VWyzTGSpME/Ff5AJaCLjAAAH00lEQVR4nO2ce1+yMBTHVQTCBFKgFZjlXVMzL/Xo+39jzy6AA6agWeuT5/uXCiL7uZ1zdnZGqQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBpdnuz+WAwqM8XwdiXfTeyaQZ1G3mGoxIcx3PRZt6/XlX8YI081SonsFTPHHRl35oU/Jnn2WURluqWb2Xf3o/jz5DD9Q7Ltm2+s1ie05N9iz9LXzUiAWzHNd3ydr3eJMaP5X6MZN/lz+F/mmHrsdH4t+w26ad1NTl47OFM8n3+GCPVYW120CfnWNKKlMvetinxNn+OYMg6iIrmYYP9UT/oBeusnVWdaxg5S0QFsVCd6uEHqw1yPc8wRI7HQn/fES8QGzCbMXk3HmQjkqQkw78uyZIJYtbJm+7WPCoH6yXji/1447Fdm05r7dfGxS75ZfpD9scv8evmJxJHaClJ3APmdXof8VDgl9sPE03TQzTtpfp6yXadTYfZkGEfvw7cjG8RY2/EF6vqFYZyk/e7jRtNVyo8iqJVphdu3Tm8005BTcMc5Y2XGGcgvFhVKajIXes5KUeIrtQu38TT2BmkgSjALz+9onpgzEB0taKKtHWhHgTt5RtaeQIjakQ8Eon+M04QpGwZogRBQUWqz4f0IF+t3H1PW4uxJWNGfcKvBicJgsfNXHC5YopUtSOCEEm+qbFFCFzyd3vYcyxc1lDVMCLrqhoHUgMM1Mler5AiteOC4C/ff1+L86BzWxdP8sdDNhbMeq83YHM+dRWIovgYVWBciyjSSAii6Br2T4rGOx5dnhfuk45hb/Eri4XxBp2zdF3yzrgVzfQ4htmgpIgiL5xR1SbTV2Y1GrU3TQkHjcRgjXYBsxt5nLLXZ5/3jCKKOLvMBQso8rjvIsrkkT/SeNPohxINaweFXaTJ4njLCQ/4ZhFF4tP3FFDkPu4iylv6GLYwMm0ItqZO2C/mLDlCxw+F2JdcRcpuZsaXr8jeioja3n5+uVTjzuLdIqYDdwkU/ul2dMQt0kfKzip9xXxF4jMqmmh0tC/VtrOgg0adh2aD/9MDr5AiewUj8hWZxF2k+o1NOxPabq8bGljaRIu6j45TyNdgo5wOSXIVuYsHjfaLpv8Rc9Jc04/sKpXEnXW7OxaPFFDES09uchV5jCbHFakW9AAkgifGtM/N8CzH88JFmwKKZPxvriJT5RcPmhKJw4gZmTnC5hZQxH5KXTJXkYfoBF2uDRXSpEEHjuA/xc0uoIiVThzlKvIWnaD9jnxZghFxsSQa2YjzRAUUKaPUNXMVuRf53mnrJklLTtjaJYq4eCJj5CrimlnoUDNTSZJcRWLnq3EfPuhKkmdJinhMERqyH1XE7TSzLIkkZmqyl6tIRahIOqEmDN6+H6oIjih8lKeIKfo6jWZQKqj4A4qc20fCQNf8W4qcb0eG61JpaXzNjnCN/i2KfMHXqKswijnZ18TpIj6I/y2KNKMkyOnxiLNkh06PR1pxhMbFIzda6GMkK/KFmJX0rA/7nJg1PkHnVqpqVcaNIlkR0bymmCKoyTzU6fOaWrwMKlgYjqeBshShmTNsGw+438OKWO+l0phaoZPnvq/7LGv2oHRFsvmRgoo4szAjeXp+pLTPj2QnNtIVoTk0sjTXEw6bw4qQtStiRs7JocXORnnJHJOuyD7Paor870FFiO3pEEelZhY68xWZxikjLZMPkK9InIvfibwNVcSwCckDbvSNc3Lxd/tF8My4ka8It14j6CREkd0T4V/iqI3tqk8893nrNa19OKalakXkK7Jf05sJCgOMfR18IqolpYoLcr6TrfbdK9K6awjAp7xylRL6pLZv+91jS3Y8wq/7lrOd5IAiZAHc98gH6Mi6L1nbzjIh57T4mF3XJq1qdVp9eKtwa+HyFAlrA4KosiaBWr+N4PSyHDy5Wzn0ePZ61fQMJQnLv6fOSUXwkhWhncRycSOXblYSI4LrIsMxnjXTkO5o/cgxRV6PVRjJVoSrMaoXqkJDPTxm6CaT4zVGxxQptfMkkakIV4f2WaDsCpGi1yc1Gj0ZiilSetSOnicrz8rgahUH2YGThFUBz2lnQn3R1QoqUmrc6wdPUrQXuQugXD3r7Hg9q01VmNEkpCMwq6XiiuBJcEVYwKno2o3slZymua957hviVAntIN47MaU7KgiJ0kRUn/VjTPhz22/Y33KqKFgN5eY3LPWxuvgyHRF+/VBdvIoW5OQ6HVkH6+Jfa0dJN/dx2rpngYuu3Leq7d9SLnDL8iMurT0crVF274TlDFdEg+aW9iELXXbT0Z3Ukl4R4XYSp0xnbqOV6zpcT7Ed05rRPtEzbSbIX99fgyUZhnuwBmwPVn/3gUyP4JrmesF204y2rnUtgpB9enZoLVZhJOp3uv0g6I8jgzH+F1oYVRXEqn+QkeVEFvQpyMRezeWHGeaOvO21PELAH0SJNNtD60W/Ezbc7wR4CEVbGK9ovy+mb3N7wj3TNDbbj41nul5sZi13ew07W/f4CzPx3ADLti3+vWcLdxn9aY4+W2JzZc9RiBA+fwQPovo1uNwDNIOVhVzDceJn1Lxf8zNqQprd3mJeHwxWuyU8xwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8vgPMAeddday/foAAAAASUVORK5CYII=" },
    { name: "Voltas", logo: "data:image/png;base64,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" },
    { name: "Haier", logo: "data:image/png;base64,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" },
    { name: "Hitachi", logo: "data:image/png;base64,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" },
    
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current service
        const response = await fetch(`/api/vendorservice?vendorServiceId=${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setServiceData(data);
          
          // Fetch other services by the same vendor
          const vendorId = data.vendorService.vendor.id;
          const otherServicesResponse = await fetch(`/api/vendor?id=${vendorId}`);
          const otherServicesData = await otherServicesResponse.json();
          
          if (otherServicesData.success && otherServicesData.data.services) {
            setOtherServices(otherServicesData.data.services.filter(
              (service: VendorService) => service.id !== params.id
            ));
          }
          
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div>
    <Navigation />
    <Loader /></div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!serviceData) return null;

  const { vendor, vendorServiceDetails, service } = serviceData.vendorService;

  return (
    <div>
      <div><Navigation /></div>
      <div className="mx-auto px-4 py-6 bg-gray-50 rounded-lg">
        <div className="bg-white border rounded-lg mb-6 shadow-sm p-4 mx-auto transition-transform transform hover:scale-100 duration-300 ease-in-out">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold">{vendor.companyName}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span className="flex items-center bg-green-500 text-white px-2 py-1 rounded-md font-semibold">
                  4.2 ★
                </span>
                <span>813 Ratings</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <div className="flex items-center space-x-2 text-gray-500">
              <MdLocationOn />
              <span>{`${vendor.headquartersAddress}, ${vendor.city}, (${vendor.pincode})`}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              <span className="font-medium text-green-600">Opens at 09:30 AM</span> • {vendorServiceDetails.experienceYears} Years in Business
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
            <div className='flex flex-wrap space-x-2'>
              <a 
                href={`tel:${vendor.primaryContactPhone}`} 
                className="bg-green-500 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
              >
                <FaPhoneAlt />
                <span className="whitespace-nowrap">{vendor.primaryContactPhone}</span>
              </a>
              <a 
                href={`https://wa.me/${vendor.whatsappnumber}`} 
                className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-transform transform hover:scale-105 duration-200 ease-in-out"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
              <span className="font-medium">Open:</span>
              <span>{formatOpeningDays(vendor.businessOpeningDays)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full pt-8 md:w-2/3">
            <div>
              <div className="flex space-x-4 pt-4">
                <VendorImageGallery
                  images={vendorServiceDetails.photo || []} 
                />
              </div>
            </div>

            <div className="mt-6 mr-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Name:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{`${vendorServiceDetails.currency} ${vendorServiceDetails.price}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{service.categoryName}</span>
                </div>
                {vendorServiceDetails.description && (
                  <div className="pt-2">
                    <span className="text-gray-600">Description:</span>
                    <p className="mt-1 text-gray-700">{vendorServiceDetails.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 mr-4 bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Other Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherServices.map((service) => (
                  <div key={service.id} className="border p-4 rounded-md hover:shadow-md transition-shadow">
                    <h3 className="font-semibold">{service.serviceName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    <p className="text-green-600 font-medium mt-2">
                      {service.currency} {service.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='sm:hidden'>
          <ContactCard {...vendor} />
          </div>
        </div>

        <div className="p-4 bg-gray-50">
          <BrandGrid brands={brands} />
        </div>

        <div className="mt-6">
          <ReviewsAndRatings/>
        </div>
      </div>
      <div className='mt-10'>
        <Navbar/>
      </div>
    </div>
  );
};

export default WeatherCoolEngineers;