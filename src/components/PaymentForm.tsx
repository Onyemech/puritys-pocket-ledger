
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/hooks/useCustomerAccounts';

interface PaymentFormProps {
  selectedCustomer: Customer;
  onPaymentSuccess: () => void;
  onCancel: () => void;
  onRecordPayment: (customer: Customer, amount: number) => Promise<boolean>;
}

const PaymentForm = ({ 
  selectedCustomer, 
  onPaymentSuccess, 
  onCancel, 
  onRecordPayment 
}: PaymentFormProps) => {
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedCustomer.totalCredit) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }
    const success = await onRecordPayment(selectedCustomer, amount);
    if (success) {
      setPaymentAmount('');
      onPaymentSuccess();
    }
  };

  const handlePaymentAmountFocus = () => {
    if (paymentAmount === '' || paymentAmount === '0') {
      setPaymentAmount('');
    }
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid number inputs or empty
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  return (
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
                type="number"
                step="0.01"
                min="0"
                value={paymentAmount === '0' ? '' : paymentAmount}
                onChange={handlePaymentAmountChange}
                onFocus={handlePaymentAmountFocus}
                placeholder="Amount"
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
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;

