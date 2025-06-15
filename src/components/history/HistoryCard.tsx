
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, Tab } from "@radix-ui/react-tabs";
import { Calendar, Users, Package } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  customer?: string;
  type: "sale" | "expense" | "payment";
  amount: number;
  items?: string;
  description?: string;
}

interface HistoryCardProps {
  recent: Transaction[];
  monthly: Transaction[];
}

const HistoryCard = ({ recent, monthly }: HistoryCardProps) => {
  return (
    <Card className="mt-8 bg-white/80 border-pink-200 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg text-pink-600">History</CardTitle>
        <p className="text-xs text-gray-500">Track all transactions</p>
      </CardHeader>
      <CardContent>
        <Tabs.Root defaultValue="recent">
          <Tabs.List className="flex space-x-4 mb-4">
            <Tabs.Trigger value="recent" className="text-pink-700 hover:text-pink-900">Last 24 Hours</Tabs.Trigger>
            <Tabs.Trigger value="monthly" className="text-pink-700 hover:text-pink-900">Last 30 Days</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="recent">
            <TransactionList transactions={recent} emptyMsg="No recent transactions." />
          </Tabs.Content>
          <Tabs.Content value="monthly">
            <TransactionList transactions={monthly} emptyMsg="No transactions in last 30 days." />
          </Tabs.Content>
        </Tabs.Root>
      </CardContent>
    </Card>
  );
};

function TransactionList({ transactions, emptyMsg }: { transactions: Transaction[]; emptyMsg: string }) {
  if (!transactions?.length) return <div className="text-center py-6 text-gray-400">{emptyMsg}</div>;
  return (
    <div className="divide-y divide-rose-100">
      {transactions.map(tx => (
        <div key={tx.id} className="flex flex-col md:flex-row md:items-center md:justify-between py-3 px-2">
          <div className="flex items-center gap-2">
            {tx.type === "sale" && <Package className="h-4 w-4 text-green-400" />}
            {tx.type === "expense" && <Users className="h-4 w-4 text-red-400" />}
            {tx.type === "payment" && <Calendar className="h-4 w-4 text-purple-400" />}
            <div>
              <div className="font-semibold text-gray-700">{tx.type.toUpperCase()}</div>
              <div className="text-xs text-gray-500">{tx.description || tx.items || "-"}</div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end">
            <span className="mr-3 text-xs text-gray-500">{tx.customer || "—"}</span>
            <span className="font-bold text-pink-700">₦{tx.amount?.toLocaleString?.("en-NG", { minimumFractionDigits: 2 })}</span>
            <span className="text-xs text-gray-400 ml-4">{new Date(tx.date).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default HistoryCard;
