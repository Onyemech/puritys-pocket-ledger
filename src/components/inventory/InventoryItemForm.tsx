
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { InventoryItem, InventoryItemFormProps } from "./types";

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  formData,
  editingItem,
  onChange,
  onSubmit,
  onCancel
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {editingItem ? 'Edit Item' : 'Add New Item'}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₦)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
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
              onChange={(e) => onChange("quantity", e.target.value)}
              placeholder="Enter quantity"
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
              onChange={(e) => onChange("lowStockThreshold", e.target.value)}
              placeholder="Enter threshold"
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            {editingItem ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default InventoryItemForm;
