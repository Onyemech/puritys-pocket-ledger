
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface CustomerSummaryCardProps {
  totalCustomers: number;
  totalOutstanding: number;
  pendingPayments: number;
}

const CustomerSummaryCard = ({ 
  totalCustomers, 
  totalOutstanding, 
  pendingPayments 
}: CustomerSummaryCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <DollarSign className="h-5 w-5" />
          Credit Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{totalCustomers}</p>
            <p className="text-sm text-blue-600">Total Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">₦{totalOutstanding.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-blue-600">Outstanding Credit</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">
              {pendingPayments}
            </p>
            <p className="text-sm text-blue-600">Pending Payments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSummaryCard;
