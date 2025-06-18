
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseSummaryCardProps {
  filteredExpenses: Array<{ amount: number }>;
}

const ExpenseSummaryCard = ({ filteredExpenses }: ExpenseSummaryCardProps) => {
  const getTotalExpenses = () =>
    filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800">Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">{filteredExpenses.length}</p>
            <p className="text-sm text-red-600">Total Expenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">₦{getTotalExpenses().toFixed(2)}</p>
            <p className="text-sm text-red-600">Total Amount</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">
              ₦{filteredExpenses.length > 0 ? (getTotalExpenses() / filteredExpenses.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-red-600">Average</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummaryCard;
