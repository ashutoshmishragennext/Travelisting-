const companies = [
  {
    category: "GLOBALBIZ PICKS",
    items: [
      {
        name: "GlobalTech Innovations",
        location: "San Francisco, CA, USA",
        industry: "Technology",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "EcoFriendly Solutions",
        location: "Berlin, Germany",
        industry: "Environmental Services",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "HealthPlus Corp",
        location: "Toronto, Canada",
        industry: "Healthcare",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "NEWEST THIS MONTH",
    items: [
      {
        name: "NextGen Robotics",
        location: "Tokyo, Japan",
        industry: "Manufacturing, Technology",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "FinTech Revolution",
        location: "London, UK",
        industry: "Financial Services",
        size: "Small Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "SmartHome Devices",
        location: "Austin, TX, USA",
        industry: "Consumer Electronics",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "HIGHEST RATED SERVICE PROVIDERS",
    items: [
      {
        name: "Elite Consulting Group",
        location: "New York, NY, USA",
        industry: "Consulting",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "ProLegal Advisors",
        location: "Los Angeles, CA, USA",
        industry: "Legal Services",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "DataSecure Solutions",
        location: "Singapore",
        industry: "Cybersecurity",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "OFFSHORE COMPANY SETUP",
    items: [
      {
        name: "Offshore Experts",
        location: "Cayman Islands",
        industry: "Consulting",
        size: "Small Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Global Incorporation Services",
        location: "Hong Kong",
        industry: "Business Services",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Tax Haven Solutions",
        location: "Belize",
        industry: "Financial Services",
        size: "Small Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "APPLIANCE AND AUDIT",
    items: [
      {
        name: "Home Appliance Auditors",
        location: "Seattle, WA, USA",
        industry: "Audit Services",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Appliance Compliance Group",
        location: "Melbourne, Australia",
        industry: "Compliance Services",
        size: "Small Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Eco Appliance Audits",
        location: "Vancouver, Canada",
        industry: "Environmental Services",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "MERGERS AND ACQUISITIONS",
    items: [
      {
        name: "M&A Advisors Inc.",
        location: "Chicago, IL, USA",
        industry: "Financial Services",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Strategic Mergers Group",
        location: "London, UK",
        industry: "Consulting",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Acquisition Partners",
        location: "Toronto, Canada",
        industry: "Investment Banking",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    category: "FINANCIAL ACCOUNTING AND RECORDKEEPING",
    items: [
      {
        name: "Accurate Accounting Solutions",
        location: "New York, NY, USA",
        industry: "Accounting",
        size: "Large Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Bookkeeping Pros",
        location: "San Diego, CA, USA",
        industry: "Accounting",
        size: "Medium Size",
        image: "/api/placeholder/400/300",
      },
      {
        name: "Financial Record Keepers",
        location: "Dublin, Ireland",
        industry: "Financial Services",
        size: "Small Size",
        image: "/api/placeholder/400/300",
      },
    ],
  },
];

const CompanyCard = ({ company }: any) => (
  <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
    <div className="relative h-48">
      <img
        src={company.image}
        alt={company.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{company.location}</p>
      <p className="text-xs text-gray-500">
        {company.industry} · {company.size}
      </p>
    </div>
  </div>
);

const JobBoard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {companies.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((company, idx) => (
                <CompanyCard key={idx} company={company} />
              ))}
            </div>
          </div>
        ))}

        {/* Show More Button */}
        <div className="text-center mt-8">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Show Me More
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
