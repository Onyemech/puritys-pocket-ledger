
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
  timestamp: string;
}
interface RecentActivityCardProps {
  activities: Activity[];
  loading: boolean;
}
const RecentActivityCard = ({ activities, loading }: RecentActivityCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading recent activity...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div>
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={activity.badgeVariant}>{activity.badge}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity found.</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default RecentActivityCard;
