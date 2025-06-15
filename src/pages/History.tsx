
import { Card } from "@/components/ui/card";
import HistoryCard from "@/components/history/HistoryCard";
import { ArrowRight } from "lucide-react";

interface HistoryPageProps {
  recent: any[];
  monthly: any[];
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
}

const HistoryPage = ({ recent, monthly, loading, error, onBack }: HistoryPageProps) => (
  <div className="animated-pink-bg min-h-screen">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        className="mb-6 flex items-center text-pink-600 hover:underline hover:text-pink-800 text-sm"
        onClick={onBack}
      >
        <ArrowRight className="rotate-180 mr-1 h-4 w-4" />
        Back to Dashboard
      </button>
      <HistoryCard recent={recent} monthly={monthly} loading={loading} error={error} />
    </div>
  </div>
);

export default HistoryPage;
