
export interface SaleItem {
  item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  totalCredit: number;
  lastPayment: string;
  phone?: string;
  email?: string;
  purchasedItems?: SaleItem[];
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: string;
}
