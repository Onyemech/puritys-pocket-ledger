
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
    console.log('Fetching recent sales with items...');
    // Fetch recent sales with their items (last 5)
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select(`
        id, 
        customer_name, 
        total_amount, 
        payment_type, 
        created_at,
        sale_items(item_name, quantity)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (salesError) {
      console.error('Error fetching sales:', salesError);
    } else {
      console.log('Sales data with items:', salesData);
      if (salesData) {
        salesData.forEach(sale => {
          // Get the first item name or show multiple items count
          const itemNames = sale.sale_items?.map(item => item.item_name) || [];
          const itemDescription = itemNames.length > 0 
            ? itemNames.length === 1 
              ? itemNames[0]
              : `${itemNames[0]} + ${itemNames.length - 1} more items`
            : 'Items';

          activities.push({
            id: sale.id,
            type: 'sale',
            title: `Sale to ${sale.customer_name || 'Customer'}`,
            description: `${itemDescription} • ₦${Number(sale.total_amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
            badge: sale.payment_type === 'cash' ? 'Cash' : 'Credit',
            badgeVariant: sale.payment_type === 'cash' ? 'secondary' : 'outline',
            timestamp: sale.created_at
          });
        });
      }
    }

    console.log('Fetching recent payments...');
    // Fetch recent payments (last 3)
    const { data: paymentsData, error: paymentsError } = await supabase
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

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
    } else {
      console.log('Payments data:', paymentsData);
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
    }

    console.log('Fetching recent inventory updates...');
    // Fetch recent inventory updates (last 2)
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('id, name, quantity, updated_at')
      .order('updated_at', { ascending: false })
      .limit(2);

    if (inventoryError) {
      console.error('Error fetching inventory:', inventoryError);
    } else {
      console.log('Inventory data:', inventoryData);
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
    }

    console.log('Fetching recent expenses...');
    // Fetch recent expenses (last 2)
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('id, description, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(2);

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
    } else {
      console.log('Expenses data:', expensesData);
      if (expensesData) {
        expensesData.forEach(expense => {
          activities.push({
            id: expense.id,
            type: 'expense',
            title: 'Expense Recorded',
            description: `${expense.description || 'Expense'} • ₦${Number(expense.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
            badge: 'Expense',
            badgeVariant: 'destructive',
            timestamp: expense.created_at
          });
        });
      }
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    console.log('Final activities:', activities.slice(0, 6));
    return activities.slice(0, 6); // Return top 6 most recent activities
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};
