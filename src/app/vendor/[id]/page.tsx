// "use client";

// import React, { useState } from "react";
// import {
//   Building2,
//   Globe,
//   Linkedin,
//   Mail,
//   Phone,
//   MapPin,
//   Users,
//   BadgeDollarSign,
//   Shield,
//   Calendar,
//   Building,
//   Facebook,
//   Twitter,
//   QuoteIcon,
//   Package,
//   Wrench,
//   Edit
// } from "lucide-react";
// import Loader from "@/components/shared/Loader";
// import ExploreCompanies from "@/components/homePage/Vendor2";
// import { VendorProfile } from "@/components/shared/vendor/VendorPage";
// import { VendorCertifications } from "@/components/shared/vendor/Certificate";
// import Footer from "@/components/shared/Footer";
// import ServicesDisplay from "@/components/shared/vendor/VendorService";
// import Navigation from "@/components/pages/Navbar";
// import WhyChooseUs from "@/components/homePage/Whychoswus";
// import Sponser from "@/components/homePage/Sponser";
// import ProductDisplay from "@/components/shared/vendor/ProductDetails";
// import { useCurrentUser } from "@/hooks/auth";
// import Link from "next/link";
// import BrandGrid from "@/components/homePage/Logo";

// interface VendorData {
//   id: string;
//   userId: string;
//   companyName: string;
//   legalEntityType: string | null;
//   taxId: string | null;
//   establishmentYear: number | null;
//   socialLinks: any | null;
//   logo: string;
//   coverImage: string;
//   pictures: string[] | null;
//   primaryContactName: string;
//   primaryContactEmail: string;
//   primaryContactPhone: string;
//   whatsappnumber: string | null;
//   headquartersAddress: string;
//   state: string;
//   city: string;
//   pincode: string;
//   ourcustomers: any[] | null;
//   operatingCountries: string[] | null;
//   employeeCountRange: string | null;
//   annualRevenueRange: string | null;
//   regulatoryLicenses: string[] | null;
//   insuranceCoverage: any | null;
//   businessOpeningDays: string[];
//   services: Service[];
//   products: any[];
//   createdAt: string;  // Add this
//   updatedAt: string;  // Add this
//   vendoruser: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }

// interface VendorData1 {
//   id: string;
//   userId: string;
//   companyName: string;
//   legalEntityType: string | null;
//   taxId: string | null;
//   establishmentYear: number | null;
//   socialLinks: Record<string, string> | null;
//   logo: string;
//   coverImage: string;
//   pictures: string[] | null;
//   primaryContactName: string;
//   primaryContactEmail: string;
//   primaryContactPhone: string;
//   whatsappnumber: string | null;
//   headquartersAddress: string;
//   state: string;
//   city: string;
//   pincode: string;
//   ourcustomers: any[] | null;
//   operatingCountries: string[];
//   employeeCountRange: string;
//   annualRevenueRange: string;
//   regulatoryLicenses: string[];
//   insuranceCoverage: Record<string, any> | null;
//   businessOpeningDays: string[];
//   services: Service[];
//   products: any[];
//   vendoruser: {
//       id: string;
//       name: string;
//       email: string;
//   };
// }

// interface Service {
//   id: string;
//   vendorId: string;
//   serviceId: string;
//   description: string;
//   price: string;
//   photo: string[];
//   service: {
//     name: string;
//     description: string;
//   };
// }

// export default function VendorDetails({ params }: { params: { id: string } }) {
//   const [data, setData] = useState<any | null>(null);
//   const [activeTab, setActiveTab] = useState<'services' | 'products' | null>(null);
//   const [canEdit, setCanEdit] = useState(false);
//   const user = useCurrentUser();
//   const userId = user?.id;

//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/vendordetails?vendorId=${params.id}`);
//         const vendorData = await response.json();
//         setData(vendorData);
        
//         // Set initial active tab based on available data
//         if (vendorData.services?.length > 0) {
//           setActiveTab('services');
//         } else if (vendorData.products?.length > 0) {
//           setActiveTab('products');
//         }

//         // Check if current user can edit
//         if (vendorData.userId === userId) {
//           setCanEdit(true);
//         }
//       } catch (error) {
//         console.error("Error fetching vendor data:", error);
//       }
//     };

//     fetchData();
//   }, [params.id, userId]);

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader />
//       </div>
//     );
//   }

//   const hasServices = data.services?.length > 0;
//   const hasProducts = data.products?.length > 0;

//   const TabButton = ({ type, isActive, onClick }: { type: 'services' | 'products', isActive: boolean, onClick: () => void }) => {
//     const Icon = type === 'services' ? Wrench : Package;
//     return (
//       <button
//         onClick={onClick}
//         className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//           isActive 
//             ? 'bg-blue-500 text-white' 
//             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }`}
//       >
//         <Icon className="w-5 h-5 mr-2" />
//         {type === 'services' ? 'Services' : 'Products'}
//       </button>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div><Navigation /></div>
//       <header className="bg-white border-b shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
//                 {data.companyName}
//               </h1>
//               {canEdit && (
//                 <Link 
//                   href={`/vendor/edit/${params.id}`}
//                   className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-00 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                 </Link>
//               )}
//             </div>

//             <div className="flex space-x-4">
//               {data.socialLinks && Object.entries(data.socialLinks).map(([platform, url]: [string, any]) => {
//                 const Icon =
//                   platform === "twitter"
//                     ? Twitter
//                     : platform === "facebook"
//                     ? Facebook
//                     : platform === "linkedin"
//                     ? Linkedin
//                     : Globe;

//                 return (
//                   <a
//                     key={platform}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
//                   >
//                     <Icon className="h-6 w-6" />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
//             {data.legalEntityType && (
//               <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
//                 <Building2 className="h-6 w-6 text-gray-400 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Legal Entity</p>
//                   <p className="mt-1 text-sm text-gray-900">{data.legalEntityType}</p>
//                 </div>
//               </div>
//             )}

//             {data.headquartersAddress && (
//               <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
//                 <MapPin className="h-6 w-6 text-gray-400 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Headquarters</p>
//                   <p className="mt-1 text-sm text-gray-900">{data.headquartersAddress}</p>
//                 </div>
//               </div>
//             )}

//             {data.employeeCountRange && (
//               <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
//                 <Users className="h-6 w-6 text-gray-400 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Employees</p>
//                   <p className="mt-1 text-sm text-gray-900">{data.employeeCountRange}</p>
//                 </div>
//               </div>
//             )}

//             {data.annualRevenueRange && (
//               <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
//                 <BadgeDollarSign className="h-6 w-6 text-gray-400 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
//                   <p className="mt-1 text-sm text-gray-900">{data.annualRevenueRange}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div className="lg:col-span-2 space-y-8">
//             <VendorProfile vendor={data} />
            
//             {/* {data.pictures?.length > 0 && (
//               <section className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <ExploreCompanies companies={data.pictures} />
//               </section>
//             )} */}

//             {(hasServices || hasProducts) && (
//               <div className="space-y-4">
//                 <div className="flex space-x-4">
//                   {hasServices && (
//                     <TabButton 
//                       type="services" 
//                       isActive={activeTab === 'services'} 
//                       onClick={() => setActiveTab('services')} 
//                     />
//                   )}
//                   {hasProducts && (
//                     <TabButton 
//                       type="products" 
//                       isActive={activeTab === 'products'} 
//                       onClick={() => setActiveTab('products')} 
//                     />
//                   )}
//                 </div>

//                  {activeTab === 'services' && hasServices && (
//                   <ServicesDisplay data={data.services} />
//                 )}
//                 {activeTab === 'products' && hasProducts && (
//                   <ProductDisplay data={data.products} />
//                 )} 
//               </div>
//             )}
//           </div>
//         </div>

//         {data.ourcustomers && <BrandGrid brands={data.ourcustomers} />}
//       </main>

//       <div className="w-full mb-8">
//         <WhyChooseUs />
//       </div>
//       <Footer />
//     </div>
//   );
// }

import React from 'react'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>{params.id}</div>
  )
}

export default page