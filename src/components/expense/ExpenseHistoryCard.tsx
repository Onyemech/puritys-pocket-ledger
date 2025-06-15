
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import ExpenseListItem from "./ExpenseListItem";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface ExpenseHistoryCardProps {
  expenses: Expense[];
  filterCategory: string;
  onFilterChange: (category: string) => void;
}

const categories = [
  { value: "inventory", label: "Inventory" },
  { value: "utilities", label: "Utilities" },
  { value: "supplies", label: "Supplies" },
  { value: "marketing", label: "Marketing" },
  { value: "transport", label: "Transport" },
  { value: "rent", label: "Rent" },
  { value: "other", label: "Other" },
];

const ExpenseHistoryCard = ({
  expenses,
  filterCategory,
  onFilterChange,
}: ExpenseHistoryCardProps) => {
  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === filterCategory);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Expense History</CardTitle>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filterCategory} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No expenses found for the selected filter.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseHistoryCard;
