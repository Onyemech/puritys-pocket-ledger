
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Transaction {
  id: string;
  date: string;
  customer?: string;
  type: "sale" | "expense" | "payment";
  amount: number;
  items?: string;
  description?: string;
}

type HistoryData = {
  recent: Transaction[];
  monthly: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const getStartDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

export function useTransactionHistory(): HistoryData {
  const { user } = useAuth();
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [monthly, setMonthly] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user) {
      setRecent([]);
      setMonthly([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const yesterday = getStartDate(1);
      const monthAgo = getStartDate(30);

      // SALES - RLS will automatically filter by user
      const { data: salesRecent, error: salesRecentErr } = await supabase
        .from("sales")
        .select("id, date, customer_name, total_amount, sale_items(item_name, quantity), payment_type")
        .gte("date", yesterday)
        .lte("date", today)
        .order("date", { ascending: false });

      const { data: salesMonthly, error: salesMonthlyErr } = await supabase
        .from("sales")
        .select("id, date, customer_name, total_amount, sale_items(item_name, quantity), payment_type")
        .gte("date", monthAgo)
        .lte("date", today)
        .order("date", { ascending: false });

      // EXPENSES - RLS will automatically filter by user
      const { data: expensesRecent, error: expensesRecentErr } = await supabase
        .from("expenses")
        .select("id, date, amount, description")
        .gte("date", yesterday)
        .lte("date", today)
        .order("date", { ascending: false });

      const { data: expensesMonthly, error: expensesMonthlyErr } = await supabase
        .from("expenses")
        .select("id, date, amount, description")
        .gte("date", monthAgo)
        .lte("date", today)
        .order("date", { ascending: false });

      // PAYMENTS - RLS will automatically filter by user through sales relationship
      const { data: paymentsRecent, error: paymentsRecentErr } = await supabase
        .from("payments")
        .select("id, payment_date, amount, sales(customer_name)")
        .gte("payment_date", yesterday)
        .lte("payment_date", today)
        .order("payment_date", { ascending: false });

      const { data: paymentsMonthly, error: paymentsMonthlyErr } = await supabase
        .from("payments")
        .select("id, payment_date, amount, sales(customer_name)")
        .gte("payment_date", monthAgo)
        .lte("payment_date", today)
        .order("payment_date", { ascending: false });

      if (
        salesRecentErr ||
        salesMonthlyErr ||
        expensesRecentErr ||
        expensesMonthlyErr ||
        paymentsRecentErr ||
        paymentsMonthlyErr
      ) {
        throw (
          salesRecentErr ||
          salesMonthlyErr ||
          expensesRecentErr ||
          expensesMonthlyErr ||
          paymentsRecentErr ||
          paymentsMonthlyErr
        );
      }

      // Format data (same as before)
      const mapSales = (data: any[]) =>
        (data || []).map(sale => ({
          id: sale.id,
          date: sale.date,
          customer: sale.customer_name || undefined,
          type: "sale" as const,
          amount: Number(sale.total_amount),
          items: sale.sale_items?.length
            ? sale.sale_items.length === 1
              ? sale.sale_items[0].item_name
              : `${sale.sale_items[0].item_name} + ${sale.sale_items.length - 1} more`
            : undefined,
          description: undefined,
        }));

      const mapExpenses = (data: any[]) =>
        (data || []).map(exp => ({
          id: exp.id,
          date: exp.date,
          type: "expense" as const,
          amount: Number(exp.amount),
          description: exp.description,
        }));

      const mapPayments = (data: any[]) =>
        (data || []).map(pay => ({
          id: pay.id,
          date: pay.payment_date,
          type: "payment" as const,
          amount: Number(pay.amount),
          customer: pay.sales?.customer_name,
        }));

      setRecent([
        ...mapSales(salesRecent || []),
        ...mapExpenses(expensesRecent || []),
        ...mapPayments(paymentsRecent || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      setMonthly([
        ...mapSales(salesMonthly || []),
        ...mapExpenses(expensesMonthly || []),
        ...mapPayments(paymentsMonthly || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    } catch (err: any) {
      setError(err?.message || "Failed to fetch transaction history.");
      setRecent([]);
      setMonthly([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return {
    recent,
    monthly,
    loading,
    error,
    refetch: fetchTransactions,
  };
}
