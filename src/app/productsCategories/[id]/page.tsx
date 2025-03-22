"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Navigation from '@/components/pages/Navbar';
import Link from 'next/link';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/shared/Footer';
import FoodHeaderBanner from '@/components/shared/Banner';
import Navbar from '@/components/shared/Gennextfooter';
import FoodCarousel from '@/components/shared/Banner';

interface Product {
  id: string;
  name: string;
  image: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  brand: string;
  isActive: boolean;
}

export default function AllProductsComponent({ params } : any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const carouselData = [
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8901"
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902"
    },
    {
      id: "ba8c068c-4adb-42f6-bf6b-bd09df4f4991",
      image: "/gym.jpg",
      contactNo: "+1 234-567-8902"
    },
    {
      id: "a7055a6c-d5e3-4d40-986b-449a2111fb8d",
      image: "/gym2.jpg",
      contactNo: "+1 234-567-8902"
    },
    // Add as many items as you need
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product?id=${params.id}`);
        const data = await response.json();
        
        // Filter only active products
        const activeProducts = data.filter((product: Product) => product.isActive);
        
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.id]);

  // Search functionality
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = (productId: string) => {
    router.push(`/allProduct/${productId}`);
  };

  if (loading) {
    return (
      <div>
      <Navigation/>
      <FoodCarousel items={carouselData} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div>
      <Navigation/>
      <FoodCarousel items={carouselData} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
        <div className="w-64">
          <div className="relative flex justify-end">
            <Input 
              type="text" 
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full bg-gray-50"
            />
          </div>
        </div>
        </div>
        <div className="text-center text-gray-600">
          No products available or matching your search.
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation/>
      <FoodCarousel items={carouselData} />
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Furniture</h1>
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            See all &gt;
          </Link>
        </div>
        
        <div className="w-64">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="block"
          >
            <Card className="overflow-hidden border rounded-3xl shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-base font-medium text-center">
                {product.name}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </div>
      <Navbar/>
    </div>
  );
}