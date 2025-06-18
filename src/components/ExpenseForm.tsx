
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ExpenseSummaryCard from "./expense/ExpenseSummaryCard";
import AddExpenseForm from "./expense/AddExpenseForm";
import ExpenseHistoryCard from "./expense/ExpenseHistoryCard";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  user_id?: string;
}

interface ExpenseFormProps {
  onBack: () => void;
}

const ExpenseForm = ({ onBack }: ExpenseFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: 0,
    description: "",
  });

  const categories = [
    { value: "inventory", label: "Inventory" },
    { value: "utilities", label: "Utilities" },
    { value: "supplies", label: "Supplies" },
    { value: "marketing", label: "Marketing" },
    { value: "transport", label: "Transport" },
    { value: "rent", label: "Rent" },
    { value: "other", label: "Other" },
  ];

  const fetchExpenses = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: 0,
      description: "",
    });
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add expenses.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('expenses')
      .insert({
        ...formData,
        user_id: user.id
      });

    if (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Expense Recorded! 📝",
        description: `Expense of ₦${formData.amount.toFixed(2)} has been recorded.`,
      });
      fetchExpenses();
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Expense Tracking</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      </div>
    );
  }

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
