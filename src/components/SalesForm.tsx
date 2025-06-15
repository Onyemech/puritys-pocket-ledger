
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesFormProps {
  onBack: () => void;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const SalesForm = ({ onBack }: SalesFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    paymentType: '',
    dueDate: ''
  });
  
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.paymentType) {
      toast({
        title: "Missing Information",
        description: "Please select a payment type.",
        variant: "destructive"
      });
      return;
    }

    if (formData.paymentType === 'credit' && !formData.customerName.trim()) {
      toast({
        title: "Missing Customer Name",
        description: "Customer name is required for credit sales.",
        variant: "destructive"
      });
      return;
    }

    const total = calculateTotal();
    console.log('Recording sale:', { ...formData, items, total });
    
    toast({
      title: "Sale Recorded! 🎉",
      description: `Sale of $${total.toFixed(2)} has been recorded successfully.`,
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      paymentType: '',
      dueDate: ''
    });
    setItems([{ id: '1', name: '', quantity: 1, price: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">Record Sale</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select value={formData.paymentType} onValueChange={(value) => {
                  setFormData({...formData, paymentType: value});
                  if (value === 'cash') {
                    setFormData(prev => ({...prev, customerName: '', dueDate: ''}));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.paymentType === 'credit' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter customer name"
                    required={formData.paymentType === 'credit'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Payment Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    min={formData.date}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Items Sold</CardTitle>
            <Button type="button" onClick={addItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                  <Input
                    id={`item-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-6"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                
                <div className="md:col-span-4 text-right">
                  <span className="text-sm text-gray-600">
                    Subtotal: ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            Record Sale
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
