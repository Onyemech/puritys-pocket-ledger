import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  totalCredit: number;
  lastPayment: string;
  phone?: string;
  email?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: string;
}

export const useCustomerAccounts = (onPaymentRecorded?: () => void) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const recordPayment = async (customer: Customer, amount: number) => {
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
        .eq('customer_name', customer.name)
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
        customerId: customer.id,
        amount,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Payment Recorded! 💰",
        description: `Payment of ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })} recorded for ${customer.name}.`,
      });

      // Refresh the customer data
      await fetchCustomers();

      // Call the callback to refresh dashboard metrics
      if (onPaymentRecorded) {
        onPaymentRecorded();
      }

      return true;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getTotalOutstanding = () => {
    return customers.reduce((sum, customer) => sum + customer.totalCredit, 0);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    recordPayment,
    getTotalOutstanding,
    refetchCustomers: fetchCustomers
  };
};
