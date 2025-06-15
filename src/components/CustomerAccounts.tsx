
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCustomerAccounts, type Customer } from '@/hooks/useCustomerAccounts';
import CustomerSummaryCard from '@/components/CustomerSummaryCard';
import PaymentForm from '@/components/PaymentForm';
import CustomerCard from '@/components/CustomerCard';

interface CustomerAccountsProps {
  onBack: () => void;
  onPaymentRecorded?: () => void;
}

const CustomerAccounts = ({ onBack, onPaymentRecorded }: CustomerAccountsProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { customers, loading, recordPayment, getTotalOutstanding } = useCustomerAccounts(onPaymentRecorded);

  const handleRecordPayment = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handlePaymentSuccess = () => {
    setSelectedCustomer(null);
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Customer Accounts</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">Customer Accounts</h2>
      </div>

      {/* Summary Card */}
      <CustomerSummaryCard 
        totalCustomers={customers.length}
        totalOutstanding={getTotalOutstanding()}
        pendingPayments={customers.filter(c => c.totalCredit > 0).length}
      />

      {/* Payment Form */}
      {selectedCustomer && (
        <PaymentForm
          selectedCustomer={selectedCustomer}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
          onRecordPayment={recordPayment}
        />
      )}

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onRecordPayment={handleRecordPayment}
          />
        ))}
      </div>

      {customers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No customers with outstanding credit found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerAccounts;
