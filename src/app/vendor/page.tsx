import React from 'react'
import Link from 'next/link'

const ProductCard = ({ product }: any) => {

  
  return (
    <Link href={`/product/${product.id}`}>
      <div className="border rounded-lg p-2 shadow-lg flex flex-col md:flex-row cursor-pointer hover:shadow-xl transition-shadow">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-32 object-cover rounded-lg md:w-32 md:h-32"
        />
        <div className="flex flex-col ml-0 md:ml-4 flex-1">
          <h2 className="text-xl font-semibold text-center md:text-left">{product.title}</h2>
          <p className="text-blue-500 text-center md:text-left">{product.price}</p>
          <p className="text-center md:text-left">{product.seller}</p>
          <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
            <span className="text-green-600 font-bold">{product.rating}</span>
            <span className="text-gray-500">
              ★ {product.reviews} Ratings | {product.years}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center md:text-left">
            <span className="text-gray-800">{product.location}</span> |{" "}
            {product.type}
          </p>
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded mb-2 md:mb-0">
              Show Number
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2 md:mb-0">
              Get Best Price
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded mb-2 md:mb-0">
              WhatsApp
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center md:text-left">
            {product.enquiries} people recently enquired
          </p>
        </div>
      </div>
    </Link>
  );
};

const ProductList = ({vendorId}:any) => {
  // Placeholder for products data
  const products=[
    {
      "id": 1,
      "title": "Son of India Plants",
      "price": "Ask for Price",
      "seller": "Sy Nursery",
      "rating": 4.6,
      "reviews": 9,
      "years": "12 Years in business",
      "location": "Mumbai",
      "type": "Wholesaler",
      "image": "data:image/jpeg;base64,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",
      "enquiries": 31
    },
    {
      "id": 2,
      "title": "Areca Palm",
      "price": "₹500 onwards",
      "seller": "Green World",
      "rating": 4.8,
      "reviews": 15,
      "years": "8 Years in business",
      "location": "Delhi",
      "type": "Retailer",
      "image": "https://masonhome.in/cdn/shop/files/IMG_9344.jpg?v=1724395560",
      "enquiries": 45
    },
    {
      "id": 3,
      "title": "Money Plant",
      "price": "Ask for Price",
      "seller": "Plantify",
      "rating": 4.7,
      "reviews": 12,
      "years": "5 Years in business",
      "location": "Bangalore",
      "type": "Wholesaler",
      "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQbQoj8TwNIz-VKCGEavOnj8MHeW0umnBBhwztrkXSQsCfrYeSrCJDgpSt1-jOL_QOURgSM_AnR4CTya3-rdO0UWiqy569ZC8efDQHyjOk3P5ON7_RjGXASAQ",
      "enquiries": 20
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top Products in Mumbai
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;