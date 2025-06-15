
import { supabase } from '@/integrations/supabase/client';

export interface RecentActivity {
  id: string;
  type: 'sale' | 'payment' | 'inventory' | 'expense';
  title: string;
  description: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive';
  timestamp: string;
}

export const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  const activities: RecentActivity[] = [];
  
  try {
    // Fetch recent sales (last 10)
    const { data: salesData } = await supabase
      .from('sales')
      .select('id, customer_name, total_amount, payment_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (salesData) {
      salesData.forEach(sale => {
        activities.push({
          id: sale.id,
          type: 'sale',
          title: `Sale to ${sale.customer_name || 'Customer'}`,
          description: `₦${Number(sale.total_amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
          badge: sale.payment_type === 'cash' ? 'Cash' : 'Credit',
          badgeVariant: sale.payment_type === 'cash' ? 'secondary' : 'outline',
          timestamp: sale.created_at
        });
      });
    }

    // Fetch recent payments (last 5)
    const { data: paymentsData } = await supabase
      .from('payments')
      .select(`
        id, 
        amount, 
        payment_date, 
        created_at,
        sales!inner(customer_name)
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    if (paymentsData) {
      paymentsData.forEach(payment => {
        activities.push({
          id: payment.id,
          type: 'payment',
          title: 'Payment Received',
          description: `${payment.sales.customer_name || 'Customer'} • ₦${Number(payment.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
          badge: 'Credit',
          badgeVariant: 'default',
          timestamp: payment.created_at
        });
      });
    }

    // Fetch recent inventory updates (last 2)
    const { data: inventoryData } = await supabase
      .from('inventory')
      .select('id, name, quantity, updated_at')
      .order('updated_at', { ascending: false })
      .limit(2);

    if (inventoryData) {
      inventoryData.forEach(item => {
        activities.push({
          id: item.id,
          type: 'inventory',
          title: 'Inventory Updated',
          description: `${item.name} • ${item.quantity} units`,
          badge: 'Stock',
          badgeVariant: 'outline',
          timestamp: item.updated_at
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return activities.slice(0, 6); // Return top 6 most recent activities
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};
