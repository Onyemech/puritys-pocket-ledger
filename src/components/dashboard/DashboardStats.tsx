
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  todaySales: number;
  creditOutstanding: number;
  lowStockItems: number;
  loading: boolean;
}

const DashboardStats = ({
  todaySales,
  creditOutstanding,
  lowStockItems,
  loading,
}: DashboardStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "Loading..." : `₦${todaySales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
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
          {loading ? "Loading..." : `₦${creditOutstanding.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
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
          {loading ? "Loading..." : lowStockItems}
        </div>
        <p className="text-xs text-muted-foreground">Items running low</p>
      </CardContent>
    </Card>
  </div>
);

export default DashboardStats;
