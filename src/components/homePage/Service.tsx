// types.ts remains the same
interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl?: string;
}

interface Service {
  id: string;
  name: string;
  image: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  requiredCertifications: string[];
  isActive: boolean;
}

interface ServiceCategoriesProps {
  categories: ServiceCategory[];
  servicesMap: Record<string, Service[]>;
  loading?: boolean;
  error?: string | null;
}

// ServiceCategories.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const ServiceCategories = ({
  categories = [],
  servicesMap = {},
  loading = false,
  error = null,
}: ServiceCategoriesProps) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          No services available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {servicesMap[category.id]?.slice(0, 3).map((service) => (
                  <Link
                    href={`/allService/${service.id}`}
                    key={service.id}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-2">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src={service.image}
                          alt={service.name}
                          // width={96}
                          // height={96}
                          // layout="fill"
                          fill
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {service.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
