import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay } from 'date-fns';

// TypeScript Interfaces
interface CommissionSummary {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  transactionCount: number;
}

interface DateFilter {
  startDate?: Date;
  endDate?: Date;
}

interface CommissionDashboardProps {
  salesPersonId?: string;
  className?: string;
}

const CommissionDashboard: React.FC<CommissionDashboardProps> = ({ 
  salesPersonId,
  className = ''
}) => {
  // State Management
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [summary, setSummary] = useState<CommissionSummary>({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (salesPersonId) {
        params.append('salesPersonId', salesPersonId);
      }

      if (dateRange?.from) {
        params.append('startDate', startOfDay(dateRange.from).toISOString());
      }

      if (dateRange?.to) {
        params.append('endDate', endOfDay(dateRange.to).toISOString());
      }

      const response = await fetch(`/api/commissions?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch commission data');
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching commission summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [dateRange, salesPersonId]);

  // Card Component
  const SummaryCard: React.FC<{
    title: string;
    value: number;
    prefix?: string;
    format?: boolean;
  }> = ({ title, value, prefix = '₹', format = true }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {format ? `${prefix}${value.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}` : value}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">
          {salesPersonId ? 'Sales Person Commission' : 'Overall Commission Summary'}
        </h2>
        {/* <DatePickerWithRange
          date={dateRange}
          onSelect={(newDateRange) => {
            setDateRange(newDateRange);
          }}
          className="w-full sm:w-[300px]"
        /> */}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Revenue"
            value={summary.totalRevenue}
          />
          <SummaryCard
            title="Total Commission"
            value={summary.totalCommission}
          />
          <SummaryCard
            title="Net Revenue"
            value={summary.netRevenue}
          />
          <SummaryCard
            title="Total Transactions"
            value={summary.transactionCount}
            prefix=""
            format={false}
          />
        </div>
      )}
    </div>
  );
};

export default CommissionDashboard;