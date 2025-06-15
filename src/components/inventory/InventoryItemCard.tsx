
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "./types";

interface Props {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  isLowStock: boolean;
}

const InventoryItemCard: React.FC<Props> = ({
  item,
  onEdit,
  onDelete,
  isLowStock
}) => (
  <Card className={isLowStock ? 'border-red-200 bg-red-50' : ''}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>
        {isLowStock && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Quantity:</span>
        <Badge variant={isLowStock ? "destructive" : "secondary"}>
          {item.quantity} units
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Price:</span>
        <span className="font-semibold">₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Low Stock Alert:</span>
        <span className="text-sm">{item.lowStockThreshold} units</span>
      </div>
      {isLowStock && (
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
          onClick={() => onEdit(item)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default InventoryItemCard;
