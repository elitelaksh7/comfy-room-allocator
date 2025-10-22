import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  time: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    message: "Room ACR-4 has been successfully allocated to John Doe",
    time: "2 mins ago"
  },
  {
    id: "2",
    type: "warning",
    message: "Room CR-7 on Floor 2 needs maintenance check",
    time: "15 mins ago"
  },
  {
    id: "3",
    type: "info",
    message: "New room change request from Sarah Smith",
    time: "1 hour ago"
  },
  {
    id: "4",
    type: "error",
    message: "Payment pending for Room ACR-2 - Due in 2 days",
    time: "2 hours ago"
  },
  {
    id: "5",
    type: "success",
    message: "Floor 3 occupancy at 85% - Almost full!",
    time: "3 hours ago"
  }
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-status-available" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 text-status-half" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-status-full" />;
    default:
      return <Info className="h-5 w-5 text-accent" />;
  }
};

const getBgColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "bg-status-available/10";
    case "warning":
      return "bg-status-half/10";
    case "error":
      return "bg-status-full/10";
    default:
      return "bg-accent/10";
  }
};

export function NotificationPanel() {
  return (
    <Card className="border-border shadow-md h-fit sticky top-4">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10 border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/20">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <span>Notifications</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">Real-time</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg ${getBgColor(notification.type)} border border-border/50 hover:shadow-md transition-all duration-300 cursor-pointer`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground mb-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
