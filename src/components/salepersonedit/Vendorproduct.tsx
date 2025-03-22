import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Package, Clock, Loader2, Tag } from 'lucide-react';
import VendorProductForm from '../vendorpage/ProductPage';
// import VendorProductForm from '../vendorpage/ProductInfo';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface VendorProductDetails {
  id: string;
  stock: number;
  price: number;
  discountPrice?: number;
  currency: string;
  description: string;
  specifications: string;
  photo: string;
  isAvailable: boolean;
  warranty?: string;
  shippingInfo: string;
}

interface VendorProduct {
  product: Product;
  vendorProductDetails: VendorProductDetails;
}

interface VendorProductsPageProps {
  vendorId: string;
}

const VendorProductsPage: React.FC<VendorProductsPageProps> = ({ vendorId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{products: any[]}>({ products: [] });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch vendor products and available products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorProductsResponse = await fetch(`/api/vendorproduct?vendorId=${vendorId}`);
        const vendorProductsData = await vendorProductsResponse.json();
        if (vendorProductsData.success) {
          setVendorProducts(vendorProductsData.products);
        }

        const productsResponse = await fetch('/api/product');
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [vendorId]);

  const handleFormUpdate = (newData: Partial<{ products?: any[] }>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleCardClick = (vendorProduct: VendorProduct) => {
    const formattedProduct = {
      productId: vendorProduct.product.id,
      stock: vendorProduct.vendorProductDetails.stock,
      price: vendorProduct.vendorProductDetails.price,
      discountPrice: vendorProduct.vendorProductDetails.discountPrice,
      currency: vendorProduct.vendorProductDetails.currency,
      description: vendorProduct.vendorProductDetails.description,
      specifications: vendorProduct.vendorProductDetails.specifications,
      photo: vendorProduct.vendorProductDetails.photo,
      isAvailable: vendorProduct.vendorProductDetails.isAvailable,
      warranty: vendorProduct.vendorProductDetails.warranty,
      shippingInfo: vendorProduct.vendorProductDetails.shippingInfo,
      id: vendorProduct.vendorProductDetails.id
    };

    setFormData({ products: [formattedProduct] });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmitProducts = async () => {
    if (formData.products.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const submitPromises = formData.products.map(product =>
        fetch('/api/vendorproduct', {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vendorId,
            ...product,
          }),
        })
      );

      await Promise.all(submitPromises);

      const updatedProducts = await fetch(`/api/vendorproduct?vendorId=${vendorId}`);
      const updatedData = await updatedProducts.json();
      if (updatedData.success) {
        setVendorProducts(updatedData.products);
      }

      setShowForm(false);
      setFormData({ products: [] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: `Products ${isEditing ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = (price: number, discountPrice?: number) => {
    if (!discountPrice) return null;
    const discount = ((price - discountPrice) / price) * 100;
    return Math.round(discount);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Products</h1>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setFormData({ products: [] });
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Products
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Product' : 'Add New Products'}</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorProductForm
              vendorId={vendorId}
              data={formData}
              updateData={handleFormUpdate}
            />
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({ products: [] });
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitProducts}
                disabled={isLoading || formData.products.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  isEditing ? 'Update Product' : 'Submit Products'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendorProducts.map((vendorProduct) => (
          <Card 
            key={vendorProduct.vendorProductDetails.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(vendorProduct)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {vendorProduct.product.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {vendorProduct.vendorProductDetails.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>Stock: {vendorProduct.vendorProductDetails.stock}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Tag className="h-4 w-4" />
                  <span>{vendorProduct.product.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {vendorProduct.vendorProductDetails.discountPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-gray-400">
                          {vendorProduct.vendorProductDetails.price} {vendorProduct.vendorProductDetails.currency}
                        </span>
                        <span className="text-red-600">
                          {vendorProduct.vendorProductDetails.discountPrice} {vendorProduct.vendorProductDetails.currency}
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {calculateDiscount(vendorProduct.vendorProductDetails.price, vendorProduct.vendorProductDetails.discountPrice)}% OFF
                        </span>
                      </div>
                    ) : (
                      <span>
                        {vendorProduct.vendorProductDetails.price} {vendorProduct.vendorProductDetails.currency}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vendorProduct.vendorProductDetails.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vendorProduct.vendorProductDetails.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {vendorProduct.vendorProductDetails.warranty && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {vendorProduct.vendorProductDetails.warranty} Warranty
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorProductsPage;