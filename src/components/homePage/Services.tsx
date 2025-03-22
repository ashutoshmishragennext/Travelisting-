import React from "react";
import {
  Phone,
  Mail,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  ArrowRight,
} from "lucide-react";

// types.ts
export interface ServiceCategory {
  service_category_id: string;
  short_name: string;
  title: string;
  description: string;
  direct_reporting: string;
  created_by: string;
  date_time: string;
}

export interface Service {
  service_id: string;
  short_name: string;
  title: string;
  description: string;
  direct_reporting: string;
  created_by: string;
  service_category_id: string;
  created_datetime: string;
}

// data.ts
export const serviceCategories: ServiceCategory[] = [
  {
    service_category_id: "3",
    short_name: "FACT",
    title: "Finance & Accounts Services",
    description:
      "FA Services includes Accounting, Audit, Assurance and Advisory Services For Internal and External Customers",
    direct_reporting: "Department Head",
    created_by: "1",
    date_time: "2021-08-05 14:06:05",
  },
  {
    service_category_id: "5",
    short_name: "ITMG",
    title: "Information Technology Services",
    description:
      "IT Services includes Advising, Designing, Development, Implementation, Maintenance of IT Products and Services for Internal and External Customers",
    direct_reporting: "Department Head",
    created_by: "1",
    date_time: "2021-08-05 14:26:36",
  },
  // Add other categories as needed
];

export const services: Service[] = [
  {
    service_id: "1",
    short_name: "FACT02",
    title: "Chart of Accounts and Configuration of Features",
    description:
      "Book Keeping Services Includes Accounts payable (bills and payments), Accounts receivables (invoices and collections), General ledger maintenance, Job cost reporting, Payroll processing, Expense classification, Delivery and Order Processing",
    direct_reporting: "",
    created_by: "1",
    service_category_id: "3",
    created_datetime: "2021-02-06 23:01:38",
  },
  {
    service_id: "3",
    short_name: "ITMG01",
    title: "Web application Development",
    description:
      "Web application development services including full-stack solutions, responsive design, and modern web technologies",
    direct_reporting: "",
    created_by: "1",
    service_category_id: "5",
    created_datetime: "2021-02-09 23:03:46",
  },
  // Add other services as needed
];

// Additional mock data for the service details page
export const serviceDetails = {
  benefits: [
    {
      title: "Expert Team",
      description:
        "Our team consists of certified professionals with years of industry experience",
      icon: "Users",
    },
    {
      title: "Fast Delivery",
      description:
        "Quick turnaround time with our streamlined processes and dedicated team",
      icon: "Clock",
    },
    {
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to address all your concerns",
      icon: "Headphones",
    },
  ],
  processSteps: [
    {
      title: "Requirement Analysis",
      description: "We analyze your needs and create a detailed project scope",
      duration: "2-3 days",
      deliverables: [
        "Project scope document",
        "Timeline estimation",
        "Resource allocation plan",
      ],
    },
    {
      title: "Development",
      description: "Our team works on implementing the solution",
      duration: "1-4 weeks",
      deliverables: [
        "Progress reports",
        "Milestone deliveries",
        "Quality assurance tests",
      ],
    },
    {
      title: "Testing & Review",
      description: "Thorough testing and client review phase",
      duration: "3-5 days",
      deliverables: [
        "Test reports",
        "Client feedback implementation",
        "Performance metrics",
      ],
    },
    {
      title: "Deployment",
      description: "Final deployment and handover",
      duration: "1-2 days",
      deliverables: [
        "Deployment documentation",
        "Training materials",
        "Support documentation",
      ],
    },
  ],
  pricingPlans: [
    {
      name: "Basic",
      price: "499",
      billingPeriod: "monthly",
      features: [
        "Basic service features",
        "Email support",
        "5 users included",
        "Basic reporting",
        "48-hour response time",
      ],
    },
    {
      name: "Professional",
      price: "999",
      billingPeriod: "monthly",
      features: [
        "All Basic features",
        "Priority email & phone support",
        "20 users included",
        "Advanced reporting",
        "24-hour response time",
        "Custom integrations",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      billingPeriod: "custom",
      features: [
        "All Professional features",
        "24/7 dedicated support",
        "Unlimited users",
        "Custom reporting",
        "1-hour response time",
        "Dedicated account manager",
        "Custom development",
      ],
    },
  ],
  contactInfo: {
    phone: "+1 (555) 123-4567",
    email: "support@company.com",
    address: "123 Business Street, Tech City, TC 12345",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM",
    socialMedia: {
      linkedin: "company-linkedin",
      twitter: "company-twitter",
      facebook: "company-facebook",
    },
  },
};

const ServiceDetailsPage = ({ service, category }: any) => {
  // Mock pricing data - in real app, this would come from your backend
  const pricingTiers = [
    {
      name: "Basic",
      price: "499",
      features: ["Initial consultation", "Basic setup", "Email support"],
    },
    {
      name: "Professional",
      price: "999",
      features: ["Everything in Basic", "Priority support", "Monthly review"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom solutions", "24/7 support", "Dedicated manager"],
    },
  ];

  // Mock process steps - in real app, this would come from your backend
  const processSteps = [
    {
      title: "Initial Consultation",
      description: "We discuss your needs and requirements",
      duration: "1-2 days",
    },
    {
      title: "Planning",
      description: "Develop a detailed project plan",
      duration: "3-5 days",
    },
    {
      title: "Implementation",
      description: "Execute the planned solutions",
      duration: "1-4 weeks",
    },
    {
      title: "Review & Support",
      description: "Regular check-ins and ongoing support",
      duration: "Ongoing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-blue-500 bg-opacity-25 rounded-full px-3 py-1 text-sm font-semibold mb-4">
            {category?.short_name}
          </span>
          <h1 className="text-4xl font-bold mb-4">{service?.title}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {service?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Why Choose Our Service?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Team",
                desc: "Highly qualified professionals with years of experience",
              },
              {
                title: "Fast Delivery",
                desc: "Quick turnaround time without compromising quality",
              },
              {
                title: "Dedicated Support",
                desc: "24/7 customer support for all your queries",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {step.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Pricing Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${tier.price}
                  {tier.price !== "Custom" && (
                    <span className="text-lg text-gray-500">/mo</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-6">
                Have questions about our {service?.title}? Our team is here to
                help!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <span>support@company.com</span>
                </div>
              </div>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  return (
    <div>
      <ServiceDetailsPage
        service={serviceDetails}
        category={serviceCategories}
      />
    </div>
  );
}
