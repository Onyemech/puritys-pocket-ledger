
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

      console.log('Fetched credit sales:', creditSales);

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

      const updatedCustomers = Array.from(customerMap.values());
      console.log('Updated customers:', updatedCustomers);
      setCustomers(updatedCustomers);
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
      console.log('Recording payment:', { customer: customer.name, amount });
      
      // Get customer sales to update (oldest first)
      const { data: customerSales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_name', customer.name)
        .eq('payment_type', 'credit')
        .eq('paid', false)
        .order('date', { ascending: true });

      if (salesError) throw salesError;

      if (!customerSales || customerSales.length === 0) {
        throw new Error('No unpaid sales found for this customer');
      }

      console.log('Customer sales found:', customerSales);

      let remainingPayment = amount;
      const paymentsToRecord = [];
      const salesToUpdate = [];

      for (const sale of customerSales) {
        if (remainingPayment <= 0) break;
        
        const saleAmount = Number(sale.total_amount);
        const paymentForThisSale = Math.min(remainingPayment, saleAmount);
        
        console.log(`Processing sale ${sale.id}: amount=${saleAmount}, payment=${paymentForThisSale}`);
        
        // Record payment for this sale
        paymentsToRecord.push({
          sale_id: sale.id,
          amount: paymentForThisSale,
          payment_date: new Date().toISOString().split('T')[0]
        });

        // If this payment fully covers the sale, mark it as paid
        if (paymentForThisSale >= saleAmount) {
          salesToUpdate.push(sale.id);
        }

        remainingPayment -= paymentForThisSale;
      }

      console.log('Payments to record:', paymentsToRecord);
      console.log('Sales to mark as paid:', salesToUpdate);

      // Insert all payments
      const { error: paymentError } = await supabase
        .from('payments')
        .insert(paymentsToRecord);

      if (paymentError) throw paymentError;

      // Update sales as paid
      if (salesToUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from('sales')
          .update({ paid: true })
          .in('id', salesToUpdate);

        if (updateError) throw updateError;
      }

      console.log('Payment recorded successfully:', {
        customerId: customer.id,
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentsRecorded: paymentsToRecord.length,
        salesUpdated: salesToUpdate.length
      });

      toast({
        title: "Payment Recorded! 💰",
        description: `Payment of ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })} recorded for ${customer.name}.`,
      });

      // Refresh the customer data immediately and wait for it to complete
      console.log('Refreshing customer data...');
      await fetchCustomers();
      console.log('Customer data refreshed');

      // Call the callback to refresh dashboard metrics
      if (onPaymentRecorded) {
        onPaymentRecorded();
      }

      return true;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: `Failed to record payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
