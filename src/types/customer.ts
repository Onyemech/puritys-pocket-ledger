
export interface Customer {
  id: string;
  name: string;
  totalCredit: number;
  lastPayment: string;
  phone?: string;
  email?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: string;
}
