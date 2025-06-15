import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, Users, Package, AlertTriangle, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SalesForm from "@/components/SalesForm";
import CustomerAccounts from "@/components/CustomerAccounts";
import Reports from "@/components/Reports";
import ExpenseForm from "@/components/ExpenseForm";
import InventoryList from "@/components/InventoryList";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import Navbar from "@/components/Navbar";
import HistoryCard from "@/components/history/HistoryCard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
const Index = () => {
  const {
    user,
    signOut
  } = useAuth();
  const [currentView, setCurrentView] = useState<"dashboard" | "sales" | "customers" | "reports" | "expenses" | "inventory">("dashboard");
  const {
    todaySales,
    creditOutstanding,
    lowStockItems,
    loading: metricsLoading,
    refetch: refetchMetrics
  } = useDashboardMetrics();
  const {
    activities,
    loading: activitiesLoading,
    refetch: refetchActivities
  } = useRecentActivity();
  const handleRefreshData = () => {
    refetchMetrics();
    refetchActivities();
  };
  const handleSignOut = async () => {
    await signOut();
  };
  if (currentView === "sales") {
    return <SalesForm onBack={() => setCurrentView("dashboard")} onSaleRecorded={handleRefreshData} />;
  }
  if (currentView === "customers") {
    return <CustomerAccounts onBack={() => setCurrentView("dashboard")} onPaymentRecorded={handleRefreshData} />;
  }
  if (currentView === "reports") {
    return <Reports onBack={() => setCurrentView("dashboard")} />;
  }
  if (currentView === "expenses") {
    return <ExpenseForm onBack={() => setCurrentView("dashboard")} />;
  }
  if (currentView === "inventory") {
    return <InventoryList onBack={() => setCurrentView("dashboard")} />;
  }

  // Dummy empty arrays for recent/monthly transactions for now
  const recentTransactions: any[] = [];
  const monthlyTransactions: any[] = [];
  return (
    <div className="animated-pink-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-2">Welcome, Miss Nzube!</h2>
          <p className="text-pink-500">
            Track your sales, manage inventory, and stay happy 🙂
          </p>
        </div>
        <DashboardStats todaySales={todaySales} creditOutstanding={creditOutstanding} lowStockItems={lowStockItems} loading={metricsLoading} />
        <QuickActions onSetView={setCurrentView} />
        <RecentActivityCard activities={activities} loading={activitiesLoading} />
        <HistoryCard recent={recentTransactions} monthly={monthlyTransactions} />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-pink-400 animate-pulse-pink rounded-full p-3 shadow-2xl text-white" title="Get push notifications (coming soon!)">
          <svg className="inline w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0" />
          </svg>
        </button>
      </div>
      <style>
        {`
          .animate-pulse-pink {
            animation: pulsePink 2s cubic-bezier(0.4,0,0.6,1) infinite;
          }
          @keyframes pulsePink {
            0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
            50% { box-shadow: 0 0 36px 12px rgba(244, 114, 182, 0.18); }
          }
        `}
      </style>
    </div>
  );
};
export default Index;
