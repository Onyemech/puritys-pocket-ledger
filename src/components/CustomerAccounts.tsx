
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomerAccountsProps {
  onBack: () => void;
}

interface Customer {
  id: string;
  name: string;
  totalCredit: number;
  lastPayment: string;
  phone?: string;
  email?: string;
}

interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: string;
}

const CustomerAccounts = ({ onBack }: CustomerAccountsProps) => {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // Mock customer data
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      totalCredit: 450.00,
      lastPayment: '2024-01-10',
      phone: '(555) 123-4567',
      email: 'john@email.com'
    },
    {
      id: '2',
      name: 'Mary Johnson',
      totalCredit: 275.50,
      lastPayment: '2024-01-08',
      phone: '(555) 987-6543'
    },
    {
      id: '3',
      name: 'Robert Davis',
      totalCredit: 825.75,
      lastPayment: '2024-01-05',
      email: 'robert@email.com'
    }
  ]);

  // Mock payment history
  const [paymentHistory] = useState<Payment[]>([
    { id: '1', customerId: '1', amount: 200.00, date: '2024-01-10', method: 'Cash' },
    { id: '2', customerId: '2', amount: 150.00, date: '2024-01-08', method: 'Bank Transfer' },
    { id: '3', customerId: '1', amount: 300.00, date: '2024-01-05', method: 'Cash' },
  ]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer || !paymentAmount) return;
    
    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedCustomer.totalCredit) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }

    console.log('Recording payment:', {
      customerId: selectedCustomer.id,
      amount,
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Payment Recorded! 💰",
      description: `Payment of $${amount.toFixed(2)} recorded for ${selectedCustomer.name}.`,
    });

    setPaymentAmount('');
    setSelectedCustomer(null);
  };

  const getCustomerPayments = (customerId: string) => {
    return paymentHistory.filter(payment => payment.customerId === customerId);
  };

  const getTotalOutstanding = () => {
    return customers.reduce((sum, customer) => sum + customer.totalCredit, 0);
  };

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
              <p className="text-2xl font-bold text-blue-700">{customers.length}</p>
              <p className="text-sm text-blue-600">Total Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">${getTotalOutstanding().toFixed(2)}</p>
              <p className="text-sm text-blue-600">Outstanding Credit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">
                {customers.filter(c => c.totalCredit > 0).length}
              </p>
              <p className="text-sm text-blue-600">Pending Payments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Record Payment - {selectedCustomer.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Outstanding Balance</Label>
                  <div className="text-2xl font-bold text-red-600">
                    ${selectedCustomer.totalCredit.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedCustomer.totalCredit}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button type="submit" className="flex-1">
                    Record Payment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className={customer.totalCredit > 0 ? 'border-amber-200' : 'border-green-200'}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                {customer.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outstanding:</span>
                <Badge variant={customer.totalCredit > 0 ? "destructive" : "secondary"}>
                  ${customer.totalCredit.toFixed(2)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Payment:</span>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  {new Date(customer.lastPayment).toLocaleDateString()}
                </div>
              </div>
              
              {customer.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              
              {customer.email && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}
              
              {customer.totalCredit > 0 && (
                <Button
                  onClick={() => setSelectedCustomer(customer)}
                  className="w-full mt-3"
                  size="sm"
                >
                  Record Payment
                </Button>
              )}
              
              {/* Recent Payments */}
              <div className="pt-2 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Recent Payments:</p>
                <div className="space-y-1">
                  {getCustomerPayments(customer.id).slice(0, 2).map((payment) => (
                    <div key={payment.id} className="flex justify-between text-xs text-gray-600">
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                      <span className="text-green-600">${payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {getCustomerPayments(customer.id).length === 0 && (
                    <p className="text-xs text-gray-500">No recent payments</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No customers found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerAccounts;
