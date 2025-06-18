
import { supabase } from '@/integrations/supabase/client';

export interface ReportData {
  sales: number;
  expenses: number;
  profit: number;
  transactions: number;
  topItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export const fetchReportData = async (reportType: 'daily' | 'weekly' | 'monthly'): Promise<ReportData> => {
  try {
    const now = new Date();
    let startDate: Date;
    
    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = now.toISOString().split('T')[0];

    // Fetch sales data - RLS will filter by user automatically
    const { data: salesData } = await supabase
      .from('sales')
      .select('total_amount, created_at')
      .gte('date', startDateStr)
      .lte('date', endDateStr);

    const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
    const totalTransactions = salesData?.length || 0;

    // Fetch expenses data - RLS will filter by user automatically
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('amount')
      .gte('date', startDateStr)
      .lte('date', endDateStr);

    const totalExpenses = expensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

    // Fetch top selling items - RLS will filter by user automatically through sales relationship
    const { data: topItemsData } = await supabase
      .from('sale_items')
      .select(`
        item_name,
        quantity,
        subtotal,
        sales!inner(date)
      `)
      .gte('sales.date', startDateStr)
      .lte('sales.date', endDateStr);

    // Group by item name and calculate totals
    const itemMap: { [key: string]: { quantity: number; revenue: number } } = {};
    
    topItemsData?.forEach(item => {
      if (!itemMap[item.item_name]) {
        itemMap[item.item_name] = { quantity: 0, revenue: 0 };
      }
      itemMap[item.item_name].quantity += item.quantity;
      itemMap[item.item_name].revenue += Number(item.subtotal);
    });

    const topItems = Object.entries(itemMap)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    return {
      sales: totalSales,
      expenses: totalExpenses,
      profit: totalSales - totalExpenses,
      transactions: totalTransactions,
      topItems
    };
  } catch (error) {
    console.error('Error fetching report data:', error);
    return {
      sales: 0,
      expenses: 0,
      profit: 0,
      transactions: 0,
      topItems: []
    };
  }
};
