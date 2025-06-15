
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

export interface InventoryItemFormState {
  name: string;
  description: string;
  quantity: string;
  price: string;
  lowStockThreshold: string;
}

export interface InventoryItemFormProps {
  formData: InventoryItemFormState;
  editingItem: InventoryItem | null;
  onChange: (field: keyof InventoryItemFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}
