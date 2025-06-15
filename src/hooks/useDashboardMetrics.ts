
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  todaySales: number;
  creditOutstanding: number;
  lowStockItems: number;
  loading: boolean;
  error: string | null;
}

export const useDashboardMetrics = (): DashboardMetrics => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todaySales: 0,
    creditOutstanding: 0,
    lowStockItems: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setMetrics(prev => ({ ...prev, loading: true, error: null }));

        // Get today's sales
        const today = new Date().toISOString().split('T')[0];
        const { data: todaySalesData, error: salesError } = await supabase
          .from('sales')
          .select('total_amount')
          .eq('date', today);

        if (salesError) throw salesError;

        const todaySales = todaySalesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;

        // Get credit outstanding (unpaid credit sales)
        const { data: creditData, error: creditError } = await supabase
          .from('sales')
          .select('total_amount')
          .eq('payment_type', 'credit')
          .eq('paid', false);

        if (creditError) throw creditError;

        const creditOutstanding = creditData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;

        // Get low stock items count
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
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }));
      }
    };

    fetchMetrics();
  }, []);

  return metrics;
};
