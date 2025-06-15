
import { useState } from "react";
import type { InventoryItem, InventoryItemFormState } from "@/components/inventory/types";

const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    description: 'High-quality arabica coffee beans',
    quantity: 45,
    price: 5500,
    lowStockThreshold: 20
  },
  {
    id: '2',
    name: 'Organic Tea Bags',
    description: 'Assorted organic tea collection',
    quantity: 8,
    price: 4200,
    lowStockThreshold: 15
  },
  {
    id: '3',
    name: 'Ceramic Mugs',
    description: 'Handcrafted ceramic mugs',
    quantity: 25,
    price: 6500,
    lowStockThreshold: 10
  }
];

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [formData, setFormData] = useState<InventoryItemFormState>({
    name: '',
    description: '',
    quantity: '',
    price: '',
    lowStockThreshold: ''
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: '',
      lowStockThreshold: ''
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      lowStockThreshold: item.lowStockThreshold.toString()
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleChange = (field: keyof InventoryItemFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addOrUpdateItem = (): InventoryItem | null => {
    if (editingItem) {
      setInventory(inventory.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              description: formData.description,
              quantity: parseInt(formData.quantity) || 0,
              price: parseFloat(formData.price) || 0,
              lowStockThreshold: parseInt(formData.lowStockThreshold) || 5
            }
          : item
      ));
      return {
        ...editingItem,
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5
      };
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5
      };
      setInventory([...inventory, newItem]);
      return newItem;
    }
  };

  return {
    inventory,
    setInventory,
    formData,
    setFormData,
    editingItem,
    setEditingItem,
    showAddForm,
    setShowAddForm,
    resetForm,
    handleEdit,
    handleDelete,
    handleChange,
    addOrUpdateItem
  };
}
