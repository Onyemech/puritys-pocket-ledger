
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExpenseFormProps {
  onBack: () => void;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const ExpenseForm = ({ onBack }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: ''
  });

  // Mock expenses data
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2024-01-15',
      category: 'inventory',
      amount: 850.00,
      description: 'Coffee beans wholesale purchase'
    },
    {
      id: '2',
      date: '2024-01-14',
      category: 'utilities',
      amount: 125.50,
      description: 'Electricity bill'
    },
    {
      id: '3',
      date: '2024-01-12',
      category: 'supplies',
      amount: 75.00,
      description: 'Packaging materials'
    },
    {
      id: '4',
      date: '2024-01-10',
      category: 'marketing',
      amount: 200.00,
      description: 'Social media advertising'
    }
  ]);

  const categories = [
    { value: 'inventory', label: 'Inventory' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'transport', label: 'Transport' },
    { value: 'rent', label: 'Rent' },
    { value: 'other', label: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    });
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...formData
    };
    
    setExpenses([newExpense, ...expenses]);
    
    toast({
      title: "Expense Recorded! 📝",
      description: `Expense of $${formData.amount.toFixed(2)} has been recorded.`,
    });
    
    resetForm();
  };

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const getTotalExpenses = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      inventory: 'bg-blue-100 text-blue-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      supplies: 'bg-green-100 text-green-800',
      marketing: 'bg-purple-100 text-purple-800',
      transport: 'bg-orange-100 text-orange-800',
      rent: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj ? categoryObj.label : category;
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
          <Button onClick={() => setShowAddForm(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </div>

      {/* Summary Card */}
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
              <p className="text-2xl font-bold text-red-700">${getTotalExpenses().toFixed(2)}</p>
              <p className="text-sm text-red-600">Total Amount</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">
                ${filteredExpenses.length > 0 ? (getTotalExpenses() / filteredExpenses.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-red-600">Average</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter expense description"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                  Add Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Expense List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Expense History</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
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
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                    -${expense.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredExpenses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No expenses found for the selected filter.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseForm;
