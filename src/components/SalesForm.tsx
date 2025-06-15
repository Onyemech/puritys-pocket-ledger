
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();
  
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
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to record sales.",
        variant: "destructive"
      });
      return;
    }

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
      // Insert sale into database with user_id
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          date: formData.date,
          customer_name: formData.customerName || null,
          payment_type: formData.paymentType,
          total_amount: total,
          due_date: formData.paymentType === 'credit' ? formData.dueDate || null : null,
          paid: formData.paymentType === 'cash',
          user_id: user.id
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
        <h2 className="text-2xl font-bold text-pink-600 tracking-wide drop-shadow-pink">Record Sale</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="!border-pink-200 shadow-sm">
          <CardHeader className="bg-pink-50/80 rounded-t-md border-b border-pink-100 mb-2 px-6 py-4">
            <CardTitle className="text-pink-700 font-extrabold text-lg">Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-pink-600">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                />
              </div>
              
              <div>
                <Label htmlFor="paymentType" className="text-pink-600">Payment Type</Label>
                <Select value={formData.paymentType} onValueChange={(value) => {
                  setFormData({...formData, paymentType: value});
                  if (value === 'cash') {
                    setFormData(prev => ({...prev, customerName: '', dueDate: ''}));
                  }
                }}>
                  <SelectTrigger className="border-pink-200 focus:ring-2 focus:ring-pink-300">
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
                  <Label htmlFor="customerName" className="text-pink-600">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter customer name"
                    required={formData.paymentType === 'credit'}
                    className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dueDate" className="text-pink-600">Payment Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    min={formData.date}
                    className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="!border-pink-200 shadow-sm">
          <CardHeader className="bg-pink-50/80 rounded-t-md border-b border-pink-100 mb-2 flex flex-row items-center justify-between space-y-0 pb-2 px-6 py-4">
            <CardTitle className="text-rose-700 font-extrabold text-lg">Items Sold</CardTitle>
            <Button type="button" onClick={addItem} size="sm" variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100 hover:text-pink-900">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg border-pink-100 bg-pink-50/40">
                <div className="md:col-span-2">
                  <Label htmlFor={`item-name-${item.id}`} className="text-pink-600">Item Name</Label>
                  <Input
                    id={`item-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Enter item name"
                    required
                    className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`quantity-${item.id}`} className="text-pink-600">Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity === '0' ? '' : item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    placeholder="Amount"
                    required
                    className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`price-${item.id}`} className="text-pink-600">Price (₦)</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price === '0' ? '' : item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      placeholder="Amount"
                      required
                      className="border-pink-200 focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-6 border-pink-300 hover:bg-rose-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  )}
                </div>
                
                <div className="md:col-span-4 text-right">
                  <span className="text-sm text-rose-600 font-semibold">
                    Subtotal: ₦{((parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="!border-pink-200 shadow-sm">
          <CardContent className="pt-6 px-6 pb-6 flex items-center justify-between text-xl font-bold bg-pink-50/70 rounded-b-md">
            <span className="text-pink-700">Total Amount:</span>
            <span className="text-green-600 drop-shadow-sm border px-4 py-2 rounded-full bg-white border-green-200">{`₦${calculateTotal().toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}</span>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 border-pink-200 hover:bg-pink-50 hover:text-pink-700">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-600">
            Record Sale
          </Button>
        </div>
      </form>
      <style>
        {`
          .drop-shadow-pink {
            filter: drop-shadow(0 2px 5px rgba(236,72,153,0.11));
          }
        `}
      </style>
    </div>
  );
};

export default SalesForm;
