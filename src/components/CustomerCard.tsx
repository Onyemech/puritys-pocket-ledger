
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Package } from 'lucide-react';
import type { Customer } from '@/types/customer';

interface CustomerCardProps {
  customer: Customer;
  onRecordPayment: (customer: Customer) => void;
}

const CustomerCard = ({ customer, onRecordPayment }: CustomerCardProps) => {
  return (
    <Card className={customer.totalCredit > 0 ? 'border-amber-200' : 'border-green-200'}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Outstanding:</span>
          <Badge variant={customer.totalCredit > 0 ? "destructive" : "secondary"}>
            ₦{customer.totalCredit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Sale:</span>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {new Date(customer.lastPayment).toLocaleDateString()}
          </div>
        </div>
        
        {customer.phone && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Phone:</span>
            <span className="text-sm">{customer.phone}</span>
          </div>
        )}
        
        {customer.email && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm">{customer.email}</span>
          </div>
        )}

        {/* Purchased Items Section */}
        {customer.purchasedItems && customer.purchasedItems.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Items Purchased:</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {customer.purchasedItems.map((item, index) => (
                <div key={index} className="text-xs text-gray-500 flex justify-between">
                  <span>{item.item_name} x{item.quantity}</span>
                  <span>₦{item.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {customer.totalCredit > 0 && (
          <Button
            onClick={() => onRecordPayment(customer)}
            className="w-full mt-3"
            size="sm"
          >
            Record Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
