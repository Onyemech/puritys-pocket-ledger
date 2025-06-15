
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExpenseSummaryCard from "./expense/ExpenseSummaryCard";
import AddExpenseForm from "./expense/AddExpenseForm";
import ExpenseHistoryCard from "./expense/ExpenseHistoryCard";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface ExpenseFormProps {
  onBack: () => void;
}

const ExpenseForm = ({ onBack }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: 0, // For first render, amount is 0, but will be handled as '' in input
    description: "",
  });

  // Mock expenses data
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      date: "2024-01-15",
      category: "inventory",
      amount: 850.0,
      description: "Coffee beans wholesale purchase",
    },
    {
      id: "2",
      date: "2024-01-14",
      category: "utilities",
      amount: 125.5,
      description: "Electricity bill",
    },
    {
      id: "3",
      date: "2024-01-12",
      category: "supplies",
      amount: 75.0,
      description: "Packaging materials",
    },
    {
      id: "4",
      date: "2024-01-10",
      category: "marketing",
      amount: 200.0,
      description: "Social media advertising",
    },
  ]);

  const categories = [
    { value: "inventory", label: "Inventory" },
    { value: "utilities", label: "Utilities" },
    { value: "supplies", label: "Supplies" },
    { value: "marketing", label: "Marketing" },
    { value: "transport", label: "Transport" },
    { value: "rent", label: "Rent" },
    { value: "other", label: "Other" },
  ];

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: 0,
      description: "",
    });
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: Date.now().toString(),
      ...formData,
    };

    setExpenses([newExpense, ...expenses]);

    toast({
      title: "Expense Recorded! 📝",
      description: `Expense of $${formData.amount.toFixed(2)} has been recorded.`,
    });

    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Expense Tracking</h2>
        </div>

        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </div>

      {/* Summary Card */}
      <ExpenseSummaryCard filteredExpenses={
        filterCategory === "all"
          ? expenses
          : expenses.filter(exp => exp.category === filterCategory)
      } />

      {/* Add Expense Form */}
      {showAddForm && (
        <AddExpenseForm
          categories={categories}
          formData={formData}
          setFormData={setFormData}
          onCancel={resetForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* Expense List & Filter */}
      <ExpenseHistoryCard
        expenses={expenses}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />
    </div>
  );
};

export default ExpenseForm;
