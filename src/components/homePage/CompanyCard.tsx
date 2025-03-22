import Image from "next/image";
import Link from "next/link";

interface CompanyLocation {
  city?: string;
  pincode?: string;
  headquartersAddress?: string;
}

interface Company extends CompanyLocation {
  id: string;
  name: string;
  image: string ;
  industry?: string;
  size?: string;
}

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { id, name, image, headquartersAddress, city, pincode } = company;

  return (
    <Link href={`/vendor/${id}`}>
      <div className="bg-white rounded-large shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[92%] border border-gray-100  mt-4 p-2 px-4">
        {/* Image Section with Gradient Overlay */}
        <div className="relative h-36 md:h-36 lg:h-36">
          <Image
            src={image || ""}
            alt={name}
            fill
            className="object-fit object-center rounded-large"
            layout="fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content Section */}
        <div className="p-2 md:p-3  flex flex-col justify-between h-[calc(100%-8rem)] md:h-[calc(100%-10rem)] lg:h-[calc(100%-12rem)]">
          {/* Header */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-2">
              {name}
            </h3>

            {/* Details */}
            <div className="space-y-2">
              {headquartersAddress && (
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {headquartersAddress}
                  </p>
                </div>
              )}

              {(city || pincode) && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {[city, pincode].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
