import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { useCurrentUser } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import RegisterFormVendor from './forms/RegisterFormVendor';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  profilePic: string | null;
  emailVerified: Date | null;
  createdAt: string;
  role: 'USER' | 'SALE_PERSON' | 'SUPER_ADMIN' | 'VENDOR';
}

interface Vendor extends User {
  vendorProfileId: string;
  createdBy: string;
  vendorProfile: {
    paymentStatus: string;
  } | null;
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useCurrentUser();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
 console.log(vendors);
 

  useEffect(() => {
    const fetchVendors = async () => {
      if (!user?.id) return;
      
      try {
        const vendorsResponse = await fetch(`/api/users?createdBy=${user.id}`);
        if (!vendorsResponse.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const data = await vendorsResponse.json();

        const vendorsList = data.filter((user: Vendor) => user.role === 'VENDOR');
        setVendors(vendorsList);
        setFilteredVendors(vendorsList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [user?.id]);

  useEffect(() => {
    const filtered = vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  const handleVendorClick = (vendorId: string , vendorid : string) => {
    if(vendorId == null){
      
      router.push(`/vendorcreation/${vendorid}`);
    }else{
      router.push(`/vendor/edit/${vendorId}`);
    }
   
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Vendors ({filteredVendors.length})</CardTitle>
          <div className='flex space-x-3'>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
          </div>
          <Button
          
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showRegisterForm ? 'Hide Form' : 'Add Vendor'}
        </Button>
        </div>
       
        </div>
      </CardHeader>
      {showRegisterForm && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <RegisterFormVendor 
              text="Create your account" 
              role="USER" 
              vendorId={user?.id} 
            />
          </CardContent>
        </Card>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Profile Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleVendorClick(vendor.vendorProfileId , vendor.id)}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {vendor.profilePic ? (
                        <img
                          src={vendor.profilePic}
                          alt={vendor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {vendor.name.charAt(0)}
                        </div>
                      )}
                      <span>{vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{vendor.email}</td>
                  <td className="px-4 py-2">{vendor.mobile || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    
                    <span 
                      className={`px-2 py-1 text-sm rounded-full ${
                      (vendor.vendorProfile?.paymentStatus === "success")
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {vendor.vendorProfile?.paymentStatus === "success" ? 'Success' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {searchQuery ? 'No vendors found matching your search' : 'No vendors found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorList;