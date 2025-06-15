
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Loader2 } from 'lucide-react';
import { fetchReportData, type ReportData } from '@/services/reportsService';

interface ReportsProps {
  onBack: () => void;
}

const Reports = ({ onBack }: ReportsProps) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<ReportData>({
    sales: 0,
    expenses: 0,
    profit: 0,
    transactions: 0,
    topItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const data = await fetchReportData(reportType);
        setReportData(data);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [reportType]);

  const profitMargin = reportData.sales > 0 ? ((reportData.profit / reportData.sales) * 100) : 0;

  const exportReport = () => {
    console.log(`Exporting ${reportType} report...`);
    
    const csvContent = `Report Type,${reportType.charAt(0).toUpperCase() + reportType.slice(1)}
Sales,₦${reportData.sales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
Expenses,₦${reportData.expenses.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
Profit,₦${reportData.profit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
Transactions,${reportData.transactions}
Profit Margin,${profitMargin.toFixed(2)}%

Top Items:
${reportData.topItems.map(item => `${item.name},${item.quantity},₦${item.revenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Business Reports</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={reportType} onValueChange={(value) => setReportType(value as 'daily' | 'weekly' | 'monthly')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading report data...</span>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Total Sales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">
                  ₦{reportData.sales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {reportData.transactions} transactions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">
                  ₦{reportData.expenses.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-red-600 mt-1">
                  Operating costs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Net Profit
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">
                  ₦{reportData.profit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {profitMargin.toFixed(1)}% margin
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  Avg. Sale Value
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800">
                  ₦{reportData.transactions > 0 ? (reportData.sales / reportData.transactions).toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Per transaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profit Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Revenue</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">
                    ₦{reportData.sales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-800">Expenses</span>
                  </div>
                  <span className="text-2xl font-bold text-red-700">
                    ₦{reportData.expenses.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-blue-800">Net Profit</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">
                    ₦{reportData.profit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.topItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No sales data available for this period
                </div>
              ) : (
                <div className="space-y-3">
                  {reportData.topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₦{item.revenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-600">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <Badge variant={profitMargin > 25 ? "default" : profitMargin > 15 ? "secondary" : "destructive"}>
                    {profitMargin.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {reportData.transactions}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Transaction</span>
                  <Badge className="bg-green-100 text-green-800">
                    ₦{reportData.transactions > 0 ? (reportData.sales / reportData.transactions).toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={exportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Detailed Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Trends Analysis
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Generate Invoice Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
