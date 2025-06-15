
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryListProps {
  onBack: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

const InventoryList = ({ onBack }: InventoryListProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // Mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Premium Coffee Beans',
      description: 'High-quality arabica coffee beans',
      quantity: 45,
      price: 15.99,
      lowStockThreshold: 20
    },
    {
      id: '2',
      name: 'Organic Tea Bags',
      description: 'Assorted organic tea collection',
      quantity: 8,
      price: 12.50,
      lowStockThreshold: 15
    },
    {
      id: '3',
      name: 'Ceramic Mugs',
      description: 'Handcrafted ceramic mugs',
      quantity: 25,
      price: 18.00,
      lowStockThreshold: 10
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    lowStockThreshold: 5
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      lowStockThreshold: 5
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      toast({
        title: "Item Updated! ✅",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData
      };
      setInventory([...inventory, newItem]);
      toast({
        title: "Item Added! 🎉",
        description: `${formData.name} has been added to inventory.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      lowStockThreshold: item.lowStockThreshold
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(inventory.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from inventory.`,
      variant: "destructive"
    });
  };

  const isLowStock = (item: InventoryItem) => item.quantity <= item.lowStockThreshold;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
        </div>
        
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter item description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="1"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value) || 5})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <Card key={item.id} className={`${isLowStock(item) ? 'border-red-200 bg-red-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                {isLowStock(item) && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quantity:</span>
                <Badge variant={isLowStock(item) ? "destructive" : "secondary"}>
                  {item.quantity} units
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock Alert:</span>
                <span className="text-sm">{item.lowStockThreshold} units</span>
              </div>
              
              {isLowStock(item) && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-2">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Low stock alert!
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {inventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No inventory items found.</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="mt-4"
            >
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryList;
