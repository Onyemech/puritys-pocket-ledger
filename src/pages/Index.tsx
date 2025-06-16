
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, Users, Package, AlertTriangle, LogOut, User, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SalesForm from "@/components/SalesForm";
import CustomerAccounts from "@/components/CustomerAccounts";
import Reports from "@/components/Reports";
import ExpenseForm from "@/components/ExpenseForm";
import InventoryList from "@/components/InventoryList";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import HistoryPage from "./History"; // <-- New import

const Index = () => {
  const {
    user,
    signOut
  } = useAuth();
  const [currentView, setCurrentView] = useState<
    "dashboard" | "sales" | "customers" | "reports" | "expenses" | "inventory" | "history"
  >("dashboard");

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
  const {
    recent,
    monthly,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory
  } = useTransactionHistory();

  const handleRefreshData = () => {
    refetchMetrics();
    refetchActivities();
    refetchHistory();
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
  if (currentView === "history") {
    return (
      <HistoryPage
        recent={recent}
        monthly={monthly}
        loading={historyLoading}
        error={historyError}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

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
        {/* QuickActions replaced with custom actions below */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('sales')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Record Sale
                <ArrowRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Add new sales transactions and manage payments</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('customers')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Customer Accounts
                <ArrowRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage credit sales and customer payments</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('inventory')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Inventory
                <ArrowRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track stock levels and manage products</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('expenses')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Record Expense
                <ArrowRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track business expenses and costs</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('reports')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Reports
                <TrendingUp className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View sales reports and business analytics</p>
            </CardContent>
          </Card>
          {/* NEW HISTORY CARD */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('history')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                History
                <Clock className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View transaction history for last 24h or 30 days</p>
            </CardContent>
          </Card>
        </div>
        <RecentActivityCard activities={activities} loading={activitiesLoading} />
        {/* HistoryCard removed from here */}
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
