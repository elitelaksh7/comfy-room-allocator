
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationPanel({ floorsData = [] }) {
  const notifications = floorsData.map(floor => {
    const fullRooms = floor.rooms.filter(room => room.occupiedBeds === room.totalBeds);
    return {
      floor: floor.floor,
      fullRooms: fullRooms.map(room => room.roomNumber),
    };
  }).filter(floor => floor.fullRooms.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <ul className="space-y-3">
            {notifications.map(notification => (
              <li key={notification.floor} className="flex items-start text-sm">
                <span className="font-semibold text-foreground w-16 shrink-0">Floor {notification.floor}:</span>
                <span className="text-muted-foreground">
                  Rooms <strong className="font-bold text-destructive">{notification.fullRooms.join(', ')}</strong> are full.
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">All rooms have available beds.</p>
        )}
      </CardContent>
    </Card>
  );
}
