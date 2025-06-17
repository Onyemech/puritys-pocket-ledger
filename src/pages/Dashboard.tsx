import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-pink-700">Welcome to Your Dashboard</h1>
          <Button 
            onClick={() => signOut()}
            variant="outline"
            className="border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          {user && (
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Name:</span> {user.user_metadata?.full_name || 'Not provided'}</p>
            </div>
          )}
        </div>
        
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
