import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package2, DollarSign, Users, Clock, CheckCircle, XCircle, Shield } from 'lucide-react';
import Image from 'next/image';

interface Product {
  product: {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    requiredCertifications: string[];
    isActive: boolean;
  };
  // vendorProductDetails: {
    id: number;
    experienceYears: number;
    clientCount: number;
    pricingModel: string;
    photo: string;
    description: string;
    specifications: any;
    stock: number;
    rateRangeMin: number | null;
    currency: string;
    isActive: boolean;
  // };
}

interface ProductDisplayProps {
  data: Product[];
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ data }) => {
 
  console.log("data",data);
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products available at this time.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center mb-12">
       <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
       
          <Shield className="h-8 w-8 mr-3 text-blue-500" />
          Our Product
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">{item.product.name}</CardTitle>
                {item.isActive ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{item.product.categoryName}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {item.photo && (
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={item.photo[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <p className="text-gray-600">{item.description || item.product.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{item.experienceYears} Years Experience</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{item.clientCount} Clients</span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    {item.rateRangeMin 
                      ? `${item.currency} ${item.rateRangeMin}`
                      : 'Price on request'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Package2 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Stock: {item.stock}</span>
                </div>
              </div>

              {/* {item.product.requiredCertifications && item.product.requiredCertifications.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.product.requiredCertifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProductDisplay;


// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Package2, DollarSign, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
// import Image from 'next/image';

// const ProductDisplay = ({ data }) => {
//   if (!data || data.length === 0) {
//     return <div className="text-center py-8"><p className="text-gray-500">No products</p></div>;
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       {data.map(item => (
//         <Card key={item.vendorProductDetails.id} className="hover:shadow-lg">
//           <CardHeader>
//             <div className="flex justify-between">
//               <CardTitle>{item.product.name}</CardTitle>
//               <Badge className={item.vendorProductDetails.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
//                 {item.vendorProductDetails.isActive ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
//                 {item.vendorProductDetails.isActive ? 'Active' : 'Inactive'}
//               </Badge>
//             </div>
//             <p className="text-sm text-gray-500">{item.product.categoryName}</p>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             {item.vendorProductDetails.photo && (
//               <div className="relative h-48 rounded-md overflow-hidden">
//                 <Image src={item.vendorProductDetails.photo[0]} alt={item.product.name} fill className="object-cover" />
//               </div>
//             )}
//             <p className="text-gray-600">{item.vendorProductDetails.description || item.product.description}</p>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-2"><Clock className="w-5 h-5 text-gray-400" /><span className="text-sm">{item.vendorProductDetails.experienceYears}yr</span></div>
//               <div className="flex items-center space-x-2"><Users className="w-5 h-5 text-gray-400" /><span className="text-sm">{item.vendorProductDetails.clientCount} clients</span></div>
//               <div className="flex items-center space-x-2"><DollarSign className="w-5 h-5 text-gray-400" /><span className="text-sm">{item.vendorProductDetails.rateRangeMin ? `${item.vendorProductDetails.currency} ${item.vendorProductDetails.rateRangeMin}` : 'Price on request'}</span></div>
//               <div className="flex items-center space-x-2"><Package2 className="w-5 h-5 text-gray-400" /><span className="text-sm">Stock: {item.vendorProductDetails.stock}</span></div>
//             </div>

//             {item.product.requiredCertifications?.length > 0 && (
//               <div className="pt-4 border-t">
//                 <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {item.product.requiredCertifications.map((cert, i) => <Badge key={i} variant="secondary">{cert}</Badge>)}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default ProductDisplay;