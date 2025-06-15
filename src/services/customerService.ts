
import { supabase } from '@/integrations/supabase/client';

export const fetchCreditSales = async () => {
  const { data: creditSales, error } = await supabase
    .from('sales')
    .select('id, customer_name, total_amount, date, payment_type')
    .eq('payment_type', 'credit')
    .eq('paid', false)
    .not('customer_name', 'is', null);

  if (error) throw error;
  return creditSales;
};

export const fetchPaymentsForSales = async (saleIds: string[]) => {
  const { data: payments, error } = await supabase
    .from('payments')
    .select('sale_id, amount')
    .in('sale_id', saleIds);

  if (error) throw error;
  return payments;
};

export const insertPayments = async (paymentsToRecord: Array<{
  sale_id: string;
  amount: number;
  payment_date: string;
}>) => {
  const { error } = await supabase
    .from('payments')
    .insert(paymentsToRecord);

  if (error) throw error;
};

export const updateSalesAsPaid = async (saleIds: string[]) => {
  const { error } = await supabase
    .from('sales')
    .update({ paid: true })
    .in('id', saleIds);

  if (error) throw error;
};

export const fetchCustomerSales = async (customerName: string) => {
  const { data: customerSales, error } = await supabase
    .from('sales')
    .select('*')
    .eq('customer_name', customerName)
    .eq('payment_type', 'credit')
    .eq('paid', false)
    .order('date', { ascending: true });

  if (error) throw error;
  return customerSales;
};
