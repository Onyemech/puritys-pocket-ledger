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

const Index = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'sales' | 'customers' | 'reports' | 'expenses' | 'inventory'>('dashboard');
  
  const { 
    todaySales, 
    creditOutstanding, 
    lowStockItems, 
    loading: metricsLoading,
    refetch: refetchMetrics 
  } = useDashboardMetrics();
  
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useRecentActivity();

  const handleRefreshData = () => {
    refetchMetrics();
    refetchActivities();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (currentView === 'sales') {
    return (
      <SalesForm 
        onBack={() => setCurrentView('dashboard')} 
        onSaleRecorded={handleRefreshData}
      />
    );
  }

  if (currentView === 'customers') {
    return (
      <CustomerAccounts 
        onBack={() => setCurrentView('dashboard')}
        onPaymentRecorded={handleRefreshData}
      />
    );
  }

  if (currentView === 'reports') {
    return (
      <Reports onBack={() => setCurrentView('dashboard')} />
    );
  }

  if (currentView === 'expenses') {
    return (
      <ExpenseForm 
        onBack={() => setCurrentView('dashboard')}
        onExpenseRecorded={handleRefreshData}
      />
    );
  }

  if (currentView === 'inventory') {
    return (
      <InventoryList onBack={() => setCurrentView('dashboard')} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">ShopKeeper</h1>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="h-4 w-4 mr-2" />
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h2>
          <p className="text-gray-600">Track your sales, manage inventory, and grow your business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "Loading..." : `₦${todaySales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground">Revenue generated today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Outstanding</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "Loading..." : `₦${creditOutstanding.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground">Amount owed by customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "Loading..." : lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground">Items running low</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading recent activity...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={activity.badgeVariant}>{activity.badge}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
