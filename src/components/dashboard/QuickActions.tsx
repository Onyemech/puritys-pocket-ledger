
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";

interface QuickActionsProps {
  onSetView: (view: "sales" | "customers" | "inventory" | "expenses" | "reports") => void;
}
const QuickActions = ({ onSetView }: QuickActionsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSetView('sales')}>
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

    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSetView('customers')}>
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

    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSetView('inventory')}>
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

    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSetView('expenses')}>
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

    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSetView('reports')}>
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
);

export default QuickActions;
