
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Users, AlertTriangle, Plus, FileText, Bell, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SalesForm from '@/components/SalesForm';
import InventoryList from '@/components/InventoryList';
import CustomerAccounts from '@/components/CustomerAccounts';
import ExpenseForm from '@/components/ExpenseForm';
import Reports from '@/components/Reports';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { todaySales, creditOutstanding, lowStockItems, loading, error } = useDashboardMetrics();

  const renderContent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesForm onBack={() => setActiveTab('dashboard')} />;
      case 'inventory':
        return <InventoryList onBack={() => setActiveTab('dashboard')} />;
      case 'customers':
        return <CustomerAccounts onBack={() => setActiveTab('dashboard')} />;
      case 'expenses':
        return <ExpenseForm onBack={() => setActiveTab('dashboard')} />;
      case 'reports':
        return <Reports onBack={() => setActiveTab('dashboard')} />;
      default:
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">
                    Today's Sales
                  </CardTitle>
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800">
                    {loading ? 'Loading...' : error ? 'Error' : `$${todaySales.toFixed(2)}`}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {error ? error : 'Calculated from today\'s sales'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">
                    Credit Outstanding
                  </CardTitle>
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-amber-600 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4 text-amber-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-800">
                    {loading ? 'Loading...' : error ? 'Error' : `$${creditOutstanding.toFixed(2)}`}
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    {error ? error : 'From unpaid credit sales'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">
                    Low Stock Items
                  </CardTitle>
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-800">
                    {loading ? 'Loading...' : error ? 'Error' : lowStockItems}
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    {error ? error : 'Items below threshold'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    onClick={() => setActiveTab('sales')}
                    className="h-20 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-sm">Record Sale</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('inventory')}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
                  >
                    <Plus className="h-6 w-6 text-green-600" />
                    <span className="text-sm text-green-700">Add Inventory</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('customers')}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-purple-200 hover:bg-purple-50"
                  >
                    <Users className="h-6 w-6 text-purple-600" />
                    <span className="text-sm text-purple-700">Customers</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('reports')}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-orange-200 hover:bg-orange-50"
                  >
                    <FileText className="h-6 w-6 text-orange-600" />
                    <span className="text-sm text-orange-700">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Sale to John Smith</p>
                        <p className="text-sm text-gray-600">2 items • $125.50</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Cash</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Inventory Updated</p>
                        <p className="text-sm text-gray-600">Added 50 units of Product A</p>
                      </div>
                    </div>
                    <Badge variant="outline">Stock</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-gray-600">Mary Johnson • $200.00</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Credit</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {renderContent()}
      </div>

      {/* Floating Notification Button */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        size="icon"
      >
        <Bell className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
