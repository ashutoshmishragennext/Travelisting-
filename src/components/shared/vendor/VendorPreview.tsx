import React, { useState } from "react";
import {
  Building2, Globe, Linkedin, Mail, Phone, MapPin,
  Users, BadgeDollarSign, Shield, Calendar, Building,
  Facebook, Twitter, QuoteIcon
} from "lucide-react";
import Link from "next/link";
import { VendorProfile } from "@/components/shared/vendor/VendorPage";
import { VendorCertifications } from "@/components/shared/vendor/Certificate";
import ExploreCompanies from "@/components/homePage/Vendor2";

export default function VendorPreview({ data }: any) {
  const [services, setServices] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - More responsive padding */}
      <header className="bg-white border-b shadow-sm">
        <div className="mx-auto p-1 sm:p-1 lg:p-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
              {data.companyName}
            </h1>

            <div className="flex flex-wrap gap-4">
              {data.socialLinks &&
                Object.entries(data.socialLinks).map(([platform, url]: any) => {
                  const Icon = 
                    platform === "twitter" ? Twitter :
                    platform === "facebook" ? Facebook :
                    platform === "linkedin" ? Linkedin : Globe;

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Company Info Cards - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 mt-6">
            {data.legalEntityType && (
              <div className="flex items-start gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Legal Entity</p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{data.legalEntityType}</p>
                </div>
              </div>
            )}

            {data.headquartersAddress && (
              <div className="flex items-start gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Headquarters</p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{data.headquartersAddress}</p>
                </div>
              </div>
            )}

            {data.employeeCountRange && (
              <div className="flex items-start gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Employees</p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{data.employeeCountRange}</p>
                </div>
              </div>
            )}

            {data.annualRevenueRange && (
              <div className="flex items-start gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <BadgeDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Annual Revenue</p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{data.annualRevenueRange}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto p-1 sm:p-1 lg:p-1">
        <div className="space-y-1">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-1 sm:p-1">
            <VendorProfile vendor={data} />
          </div>

          {/* Pictures Section */}
          {data.pictures?.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ExploreCompanies companies={data.pictures} />
            </section>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-1 sm:p-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center mb-4 sm:mb-6">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2" />
                Services
              </h2>
              <div className="grid gap-4">
                {services.map((service: any) => (
                  <Link
                    href={`/vendor/service/${service.service.id}`}
                    key={service.service.id}
                  >
                    <div className="group p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-400 transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.service.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {service.service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials Section */}
          {data.references && data.references.length > 0 && (
            <section className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Client Testimonials
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.references.map((reference: any) => (
                  <div
                    key={reference.id}
                    className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <QuoteIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        {reference.clientCompanyName || "Company"}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      {reference.projectDescription || "No description available"}
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-gray-500">
                        <span className="font-medium">Industry:</span>{" "}
                        {reference.clientIndustry || "N/A"}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-medium">Period:</span>{" "}
                        {new Date(reference.servicePeriodStart).toLocaleDateString()} -{" "}
                        {new Date(reference.servicePeriodEnd).toLocaleDateString()}
                      </p>

                      {reference.isPublic && reference.contactPersonName && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="font-medium text-gray-900">
                            {reference.contactPersonName}
                          </p>
                          <a
                            href={`mailto:${reference.contactEmail}`}
                            className="text-blue-600 hover:text-blue-800 break-words"
                          >
                            {reference.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="py-4 sm:py-6">
              <VendorCertifications certifications={data.certifications} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}