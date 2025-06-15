
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/types/customer';
import { 
  fetchCreditSales, 
  fetchPaymentsForSales, 
  fetchCustomerSales,
  insertPayments,
  updateSalesAsPaid
} from '@/services/customerService';
import { 
  createPaymentMap, 
  processCustomerData, 
  calculatePaymentDistribution 
} from '@/utils/customerUtils';

export const useCustomerAccounts = (onPaymentRecorded?: () => void) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers from database
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const creditSales = await fetchCreditSales();
      console.log('Fetched credit sales:', creditSales);

      // Get all payments for these sales
      const saleIds = creditSales?.map(sale => sale.id) || [];
      const payments = await fetchPaymentsForSales(saleIds);
      console.log('Fetched payments:', payments);

      // Create a map of payments by sale_id
      const paymentMap = createPaymentMap(payments || []);

      // Group by customer and calculate remaining balances
      const updatedCustomers = processCustomerData(creditSales || [], paymentMap);
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
      
      const customerSales = await fetchCustomerSales(customer.name);

      if (!customerSales || customerSales.length === 0) {
        throw new Error('No unpaid sales found for this customer');
      }

      console.log('Customer sales found:', customerSales);

      const { paymentsToRecord, salesToUpdate } = calculatePaymentDistribution(
        customerSales, 
        amount
      );

      console.log('Payments to record:', paymentsToRecord);
      console.log('Sales to mark as paid:', salesToUpdate);

      // Insert all payments
      await insertPayments(paymentsToRecord);

      // Update sales as paid
      if (salesToUpdate.length > 0) {
        await updateSalesAsPaid(salesToUpdate);
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

export type { Customer };
