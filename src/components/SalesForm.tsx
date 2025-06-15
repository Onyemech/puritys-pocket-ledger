
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SalesFormProps {
  onBack: () => void;
  onSaleRecorded?: () => void;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
}

const SalesForm = ({ onBack, onSaleRecorded }: SalesFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    paymentType: '',
    dueDate: ''
  });
  
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', name: '', quantity: '', price: '' }
  ]);

  const addItem = () => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      price: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      // Insert sale into database
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          date: formData.date,
          customer_name: formData.customerName || null,
          payment_type: formData.paymentType,
          total_amount: total,
          due_date: formData.paymentType === 'credit' ? formData.dueDate || null : null,
          paid: formData.paymentType === 'cash'
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = items.map(item => ({
        sale_id: saleData.id,
        item_name: item.name,
        quantity: parseInt(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
        subtotal: (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0)
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      console.log('Sale recorded successfully:', { ...formData, items, total });
      
      toast({
        title: "Sale Recorded! 🎉",
        description: `Sale of ₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2 })} has been recorded successfully.`,
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        paymentType: '',
        dueDate: ''
      });
      setItems([{ id: '1', name: '', quantity: '', price: '' }]);

      // Call the callback to refresh dashboard metrics
      if (onSaleRecorded) {
        onSaleRecorded();
      }

    } catch (error) {
      console.error('Error recording sale:', error);
      toast({
        title: "Error",
        description: "Failed to record sale. Please try again.",
        variant: "destructive"
      });
    }
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
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`price-${item.id}`}>Price (₦)</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      placeholder="Enter price"
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
                    Subtotal: ₦{((parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
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
              <span className="text-green-600">₦{calculateTotal().toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
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
