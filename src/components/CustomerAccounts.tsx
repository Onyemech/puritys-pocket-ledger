import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CustomerAccountsProps {
  onBack: () => void;
  onPaymentRecorded?: () => void;
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

const CustomerAccounts = ({ onBack, onPaymentRecorded }: CustomerAccountsProps) => {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers from database
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Get all credit sales that are unpaid
      const { data: creditSales, error } = await supabase
        .from('sales')
        .select('customer_name, total_amount, date, payment_type')
        .eq('payment_type', 'credit')
        .eq('paid', false)
        .not('customer_name', 'is', null);

      if (error) throw error;

      // Group by customer and calculate totals
      const customerMap = new Map<string, Customer>();
      
      creditSales?.forEach(sale => {
        const customerName = sale.customer_name!;
        const existing = customerMap.get(customerName);
        
        if (existing) {
          existing.totalCredit += Number(sale.total_amount);
          // Keep the most recent date
          if (sale.date > existing.lastPayment) {
            existing.lastPayment = sale.date;
          }
        } else {
          customerMap.set(customerName, {
            id: customerName, // Using name as ID for simplicity
            name: customerName,
            totalCredit: Number(sale.total_amount),
            lastPayment: sale.date,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
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

    try {
      // Record the payment in the payments table
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          sale_id: null, // We'll need to link this properly in a real implementation
          amount: amount,
          payment_date: new Date().toISOString().split('T')[0]
        });

      if (paymentError) throw paymentError;

      // Update sales to mark them as paid (proportionally)
      const { data: customerSales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_name', selectedCustomer.name)
        .eq('payment_type', 'credit')
        .eq('paid', false)
        .order('date', { ascending: true });

      if (salesError) throw salesError;

      let remainingPayment = amount;
      for (const sale of customerSales || []) {
        if (remainingPayment <= 0) break;
        
        const saleAmount = Number(sale.total_amount);
        if (remainingPayment >= saleAmount) {
          // Fully pay this sale
          await supabase
            .from('sales')
            .update({ paid: true })
            .eq('id', sale.id);
          remainingPayment -= saleAmount;
        } else {
          // Partially pay this sale - for simplicity, we'll mark it as paid if payment covers most of it
          if (remainingPayment / saleAmount > 0.8) {
            await supabase
              .from('sales')
              .update({ paid: true })
              .eq('id', sale.id);
          }
          remainingPayment = 0;
        }
      }

      console.log('Payment recorded successfully:', {
        customerId: selectedCustomer.id,
        amount,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Payment Recorded! 💰",
        description: `Payment of ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })} recorded for ${selectedCustomer.name}.`,
      });

      setPaymentAmount('');
      setSelectedCustomer(null);
      
      // Refresh the customer data
      await fetchCustomers();

      // Call the callback to refresh dashboard metrics
      if (onPaymentRecorded) {
        onPaymentRecorded();
      }

    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTotalOutstanding = () => {
    return customers.reduce((sum, customer) => sum + customer.totalCredit, 0);
  };

  const handlePaymentAmountFocus = () => {
    // Clear the input when focused if it's empty or just "0"
    if (paymentAmount === '' || paymentAmount === '0') {
      setPaymentAmount('');
    }
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid number inputs
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPaymentAmount(value);
    }
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
              <p className="text-2xl font-bold text-blue-700">₦{getTotalOutstanding().toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
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
                    ₦{selectedCustomer.totalCredit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount (₦)</Label>
                  <Input
                    id="paymentAmount"
                    type="text"
                    value={paymentAmount}
                    onChange={handlePaymentAmountChange}
                    onFocus={handlePaymentAmountFocus}
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
                    onClick={() => {
                      setSelectedCustomer(null);
                      setPaymentAmount('');
                    }}
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
                  ₦{customer.totalCredit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Sale:</span>
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
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setPaymentAmount('');
                  }}
                  className="w-full mt-3"
                  size="sm"
                >
                  Record Payment
                </Button>
              )}
            </CardContent>
          </Card>
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
