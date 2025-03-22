import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

// Types
interface PaymentData {
    id: string;
    vendorId: string;
    orderId: string;
    paymentId: string | null;
    amount: string;
    currency: string;
    status: string;
    paymentMethod: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    commission?: number;
}

interface VendorData {
    id: string;
    userId: string;
    companyName: string;
    createdAt: string | null;
    paymentStatus: string;
}

interface CommissionSummary {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  transactionCount: number;
}

type DashboardProps = {
  vendorData: VendorData[];
  paymentData: PaymentData[];
  salesPersonId?: string;
};

type DateRange = 'YTD' | 'QTD' | 'MTD' | 'LIFETIME';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CombinedDashboard = ({ vendorData, paymentData, salesPersonId }: DashboardProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('MTD');
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary>({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    transactionCount: 0
  });

  // Calculate date ranges
  const getDateRange = (range: DateRange): Date => {
    const today = new Date();
    switch (range) {
      case 'YTD':
        return new Date(today.getFullYear(), 0, 1);
      case 'QTD':
        const quarter = Math.floor(today.getMonth() / 3);
        return new Date(today.getFullYear(), quarter * 3, 1);
      case 'MTD':
        return new Date(today.getFullYear(), today.getMonth(), 1);
      case 'LIFETIME':
        return new Date(0);
      default:
        return new Date(today.getFullYear(), today.getMonth(), 1);
    }
  };

  // Fetch commission data
  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = getDateRange(dateRange);
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      });
      
      if (salesPersonId) {
        params.append('salesPersonId', salesPersonId);
      }

      const response = await fetch(`/api/commissions?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch commission data');
      }

      const data = await response.json();
      setCommissionSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching commission summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionData();
  }, [dateRange, salesPersonId]);

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    const startDate = getDateRange(dateRange);
    return {
      payments: paymentData.filter(payment => 
        new Date(payment.createdAt) >= startDate &&
        payment.status === 'completed'
      ),
      vendors: vendorData.filter(vendor => 
        vendor.createdAt && new Date(vendor.createdAt) >= startDate
      )
    };
  }, [dateRange, paymentData, vendorData]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalPayments = filteredData.payments.reduce((sum, payment) => 
      sum + parseFloat(payment.amount), 0
    );
    
    const draftPayments = filteredData.vendors.filter(p => 
      p.paymentStatus === 'draft'
    ).length;

    const completedPayments = filteredData.vendors.filter(p => 
      p.paymentStatus === 'success'
    ).length;

    return {
      totalPayments,
      totalVendors: filteredData.vendors.length,
      draftPayments,
      completedPayments
    };
  }, [filteredData]);

  // Process vendor registration data
  const processRegistrationData = () => {
    const groupedData = new Map();
    
    filteredData.vendors.forEach(vendor => {
      if (!vendor.createdAt) return;
      const date = new Date(vendor.createdAt);
      let key;
      
      if (timeRange === 'month') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (timeRange === 'week') {
        const weekNumber = Math.ceil((date.getDate() + 6) / 7);
        key = `Week ${weekNumber}`;
      } else {
        key = date.toISOString().split('T')[0];
      }
      
      groupedData.set(key, (groupedData.get(key) || 0) + 1);
    });
    
    return Array.from(groupedData).map(([date, count]) => ({
      date,
      count
    }));
  };

  // Process payment data
  const processPaymentData = () => {
    const statusCount = filteredData.payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <div className="space-y-4 p-4">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {salesPersonId ? 'Sales Person Dashboard' : 'Overall Dashboard Summary'}
        </h2>
        <div className="w-48">
          <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MTD">Month to Date</SelectItem>
              <SelectItem value="QTD">Quarter to Date</SelectItem>
              <SelectItem value="YTD">Year to Date</SelectItem>
              <SelectItem value="LIFETIME">Lifetime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{commissionSummary.totalRevenue.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{commissionSummary.totalCommission.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{commissionSummary.netRevenue.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commissionSummary.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVendors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incompleted Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.draftPayments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Registrations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processRegistrationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={processPaymentData()} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={100} 
                  fill="#8884d8" 
                  dataKey="value" 
                  label
                >
                  {processPaymentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default CombinedDashboard;