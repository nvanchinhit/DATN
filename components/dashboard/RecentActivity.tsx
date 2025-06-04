import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  time: string;
}

const activityItems: ActivityItem[] = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "JD",
    },
    action: "Created a new project",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "JS",
    },
    action: "Updated user settings",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Alex Johnson",
      avatar: "AJ",
    },
    action: "Completed task #1234",
    time: "1 day ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Miller",
      avatar: "SM",
    },
    action: "Added new team member",
    time: "2 days ago",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{item.user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {item.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.action}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}