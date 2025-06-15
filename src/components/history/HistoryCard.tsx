
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Users, Package } from "lucide-react";

// added loading and error props
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
  loading?: boolean;
  error?: string | null;
}

const HistoryCard = ({ recent, monthly, loading, error }: HistoryCardProps) => {
  return (
    <Card className="mt-8 bg-white/80 border-pink-200 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg text-pink-600">History</CardTitle>
        <p className="text-xs text-gray-500">Track all transactions</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="flex space-x-4 mb-4 bg-transparent p-0">
            <TabsTrigger value="recent" className="text-pink-700 hover:text-pink-900">Last 24 Hours</TabsTrigger>
            <TabsTrigger value="monthly" className="text-pink-700 hover:text-pink-900">Last 30 Days</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <TransactionList transactions={recent} emptyMsg="No recent transactions." loading={loading} error={error} />
          </TabsContent>
          <TabsContent value="monthly">
            <TransactionList transactions={monthly} emptyMsg="No transactions in last 30 days." loading={loading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

function TransactionList({
  transactions,
  emptyMsg,
  loading,
  error,
}: {
  transactions: Transaction[];
  emptyMsg: string;
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) return <div className="text-center py-6 text-pink-400 font-semibold animate-pulse">Loading...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;
  if (!transactions?.length)
    return <div className="text-center py-6 text-gray-400">{emptyMsg}</div>;
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
            <span className="font-bold text-pink-700">
              ₦{tx.amount?.toLocaleString?.("en-NG", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-gray-400 ml-4">
              {tx.date && !isNaN(Date.parse(tx.date))
                ? new Date(tx.date).toLocaleDateString()
                : "--"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default HistoryCard;

