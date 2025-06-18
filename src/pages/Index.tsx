
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, Users, Package, AlertTriangle, LogOut, User, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
import HistoryPage from "./History";

const Index = () => {
  const { user, signOut } = useAuth();
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
    console.log('Logout button clicked');
    await signOut();
  };

  // Navigation handlers
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
      {/* Header with user info and logout */}
      <div className="bg-white/90 backdrop-blur border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-pink-700">Purity's Inventory</h1>
              <p className="text-sm text-pink-500">Welcome back, {user?.user_metadata?.full_name || user?.email}!</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-2">Dashboard</h2>
          <p className="text-pink-500">
            Track your sales, manage inventory, and stay organized 💖
          </p>
        </div>

        <DashboardStats 
          todaySales={todaySales} 
          creditOutstanding={creditOutstanding} 
          lowStockItems={lowStockItems} 
          loading={metricsLoading} 
        />

        {/* Quick Actions with 3D effects */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('sales')}>
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

          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('customers')}>
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

          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('inventory')}>
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

          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('expenses')}>
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

          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('reports')}>
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

          <Card className="card-3d card-interactive ripple bg-white" onClick={() => setCurrentView('history')}>
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

        <div className="card-3d bg-white">
          <RecentActivityCard activities={activities} loading={activitiesLoading} />
        </div>
      </div>

      {/* Enhanced floating notification button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-pink-500 animate-pulse-pink floating-btn rounded-full p-3 shadow-2xl text-white hover:bg-pink-600 transition-colors duration-300" title="Get push notifications (coming soon!)">
          <svg className="inline w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Index;
