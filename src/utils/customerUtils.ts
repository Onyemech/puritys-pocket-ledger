import type { Customer } from '@/types/customer';

export const createPaymentMap = (payments: Array<{ sale_id: string; amount: number }>) => {
  const paymentMap = new Map<string, number>();
  payments?.forEach(payment => {
    const existing = paymentMap.get(payment.sale_id) || 0;
    paymentMap.set(payment.sale_id, existing + Number(payment.amount));
  });
  return paymentMap;
};

export const processCustomerData = (
  creditSales: Array<{
    id: string;
    customer_name: string;
    total_amount: number;
    date: string;
  }>,
  paymentMap: Map<string, number>
): Customer[] => {
  const customerMap = new Map<string, Customer>();
  
  creditSales?.forEach(sale => {
    const customerName = sale.customer_name!;
    const saleAmount = Number(sale.total_amount);
    const paidAmount = paymentMap.get(sale.id) || 0;
    const remainingAmount = saleAmount - paidAmount;

    console.log(`Sale ${sale.id}: amount=${saleAmount}, paid=${paidAmount}, remaining=${remainingAmount}`);

    // Only include if there's still a remaining balance
    if (remainingAmount > 0) {
      const existing = customerMap.get(customerName);
      
      if (existing) {
        existing.totalCredit += remainingAmount;
        // Keep the most recent date
        if (sale.date > existing.lastPayment) {
          existing.lastPayment = sale.date;
        }
      } else {
        customerMap.set(customerName, {
          id: customerName, // Using name as ID for simplicity
          name: customerName,
          totalCredit: remainingAmount,
          lastPayment: sale.date,
        });
      }
    }
  });

  return Array.from(customerMap.values());
};

export const calculatePaymentDistribution = (
  customerSales: Array<{
    id: string;
    total_amount: number;
  }>,
  paymentAmount: number
) => {
  let remainingPayment = paymentAmount;
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

  return { paymentsToRecord, salesToUpdate };
};
