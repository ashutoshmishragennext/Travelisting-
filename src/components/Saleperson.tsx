import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

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

interface CommissionData {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  transactionCount: number;
}

interface SalesPersonWithCommission extends User {
  commission?: CommissionData;
}

// Main Table Component
const SalesPersonTable: React.FC = () => {
  const [users, setUsers] = useState<SalesPersonWithCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales persons
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const salesPersons = data.filter((user: User) => user.role === 'SALE_PERSON');

        // Fetch commission data for each sales person
        const salesPersonsWithCommission = await Promise.all(
          salesPersons.map(async (user: User) => {
            try {
              const commissionResponse = await fetch(`/api/commissions?salesPersonId=${user.id}`);
              if (!commissionResponse.ok) throw new Error('Failed to fetch commission data');
              const commissionData = await commissionResponse.json();
              return { ...user, commission: commissionData };
            } catch (error) {
              console.error(`Failed to fetch commission data for ${user.id}:`, error);
              return { ...user, commission: undefined };
            }
          })
        );

        setUsers(salesPersonsWithCommission);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // if (selectedSalesPersonId) {
  //   return (
      // <VendorList 
      //   salesPersonId={selectedSalesPersonId} 
      //   onBack={() => setSelectedSalesPersonId(null)} 
      // />
    
  //   );
  // }

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
        Error loading users: {error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Team Members ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                {/* <th className="px-4 py-2 text-left">Email</th> */}
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-right">Total Revenue</th>
                <th className="px-4 py-2 text-right">Commission</th>
                <th className="px-4 py-2 text-right">Net Revenue</th>
                <th className="px-4 py-2 text-center">Transactions</th>
                {/* <th className="px-4 py-2 text-left">Status</th> */}
                {/* <th className="px-4 py-2 text-left">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </td>
                  {/* <td className="px-4 py-2">{user.email}</td> */}
                  <td className="px-4 py-2">{user.mobile || 'N/A'}</td>
                  <td className="px-4 py-2 text-right">
                    {user.commission ? formatCurrency(user.commission.totalRevenue) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {user.commission ? formatCurrency(user.commission.totalCommission) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {user.commission ? formatCurrency(user.commission.netRevenue) : '-'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {user.commission ? user.commission.transactionCount : '-'}
                  </td>
                  {/* <td className="px-4 py-2">
                    <span 
                      className={`px-2 py-1 text-sm rounded-full ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td> */}
                  {/* <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedSalesPersonId(user.id)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                    >
                      View Vendors
                    </button>
                  </td> */}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No sales team members found
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

export default SalesPersonTable;