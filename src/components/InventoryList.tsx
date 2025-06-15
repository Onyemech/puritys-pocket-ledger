import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InventoryItemForm from "./inventory/InventoryItemForm";
import InventoryItemCard from "./inventory/InventoryItemCard";
import { useInventory } from "@/hooks/useInventory";
import type { InventoryItem } from "./inventory/types";

interface InventoryListProps {
  onBack: () => void;
}

const InventoryList = ({ onBack }: InventoryListProps) => {
  const { toast } = useToast();
  const {
    inventory, setInventory,
    formData, setFormData,
    editingItem,
    showAddForm,
    setShowAddForm,
    resetForm,
    handleEdit,
    handleDelete,
    handleChange,
    addOrUpdateItem,
  } = useInventory();

  // === Low stock toast on page mount ===
  useEffect(() => {
    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.lowStockThreshold
    );
    if (lowStockItems.length > 0) {
      toast({
        title: "Low Stock Alert!",
        description: `The following items are low on stock: ${lowStockItems
          .map((item) => item.name)
          .join(', ')}`,
        variant: "destructive"
      });
    }
    // eslint-disable-next-line
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem = addOrUpdateItem();
    if (editingItem) {
      toast({
        title: "Item Updated! ✅",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Item Added! 🎉",
        description: `${formData.name} has been added to inventory.`,
      });
    }
    resetForm();
  };

  const onEdit = (item: InventoryItem) => {
    handleEdit(item);
  };

  const onDelete = (id: string) => {
    const item = inventory.find(i => i.id === id);
    handleDelete(id);
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
        <InventoryItemForm
          formData={formData}
          editingItem={editingItem}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            isLowStock={isLowStock(item)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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
