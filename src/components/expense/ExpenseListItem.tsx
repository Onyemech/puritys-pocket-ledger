
import { Badge } from "@/components/ui/badge";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
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

const ExpenseListItem = ({ expense }: { expense: Expense }) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      inventory: "bg-blue-100 text-blue-800",
      utilities: "bg-yellow-100 text-yellow-800",
      supplies: "bg-green-100 text-green-800",
      marketing: "bg-purple-100 text-purple-800",
      transport: "bg-orange-100 text-orange-800",
      rent: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find((c) => c.value === category);
    return categoryObj ? categoryObj.label : category;
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-medium">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex-1">
          <p className="font-medium">{expense.description}</p>
          <Badge className={`mt-1 ${getCategoryColor(expense.category)}`}>
            {getCategoryLabel(expense.category)}
          </Badge>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-red-600">
          -₦{expense.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ExpenseListItem;
