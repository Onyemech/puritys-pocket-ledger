
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchCreditSales, 
  fetchPaymentsForSales 
} from '@/services/customerService';
import { 
  createPaymentMap, 
  processCustomerData 
} from '@/utils/customerUtils';

interface DashboardMetrics {
  todaySales: number;
  creditOutstanding: number;
  lowStockItems: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardMetrics = (): DashboardMetrics => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todaySales: 0,
    creditOutstanding: 0,
    lowStockItems: 0,
    loading: true,
    error: null,
    refetch: () => {}
  });

  const fetchMetrics = async () => {
    if (!user) {
      setMetrics(prev => ({
        ...prev,
        loading: false,
        todaySales: 0,
        creditOutstanding: 0,
        lowStockItems: 0
      }));
      return;
    }

    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));

      // Get today's sales for current user
      const today = new Date().toISOString().split('T')[0];
      const { data: todaySalesData, error: salesError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('date', today);

      if (salesError) throw salesError;

      const todaySales = todaySalesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;

      // Get credit outstanding for current user
      const creditSales = await fetchCreditSales();
      const saleIds = creditSales?.map(sale => sale.id) || [];
      const payments = await fetchPaymentsForSales(saleIds);
      const paymentMap = createPaymentMap(payments || []);
      const customers = processCustomerData(creditSales || [], paymentMap);
      const creditOutstanding = customers.reduce((sum, customer) => sum + customer.totalCredit, 0);

      // Get low stock items count for current user
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity, low_stock_threshold');

      if (inventoryError) throw inventoryError;

      const lowStockItems = inventoryData?.filter(item => 
        item.quantity <= item.low_stock_threshold
      ).length || 0;

      setMetrics({
        todaySales,
        creditOutstanding,
        lowStockItems,
        loading: false,
        error: null,
        refetch: fetchMetrics
      });

    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        refetch: fetchMetrics
      }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  return { ...metrics, refetch: fetchMetrics };
};
