
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function RoomCard({ room, onEditRoom }) {
  const occupancyRate = room.totalBeds > 0 ? (room.occupiedBeds / room.totalBeds) * 100 : 0;
  
  let statusColorClass = 'bg-status-available'; 
  if (occupancyRate === 100) {
    statusColorClass = 'bg-status-full';
  } else if (occupancyRate > 0) {
    statusColorClass = 'bg-status-half';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background shadow-md border border-border transition-all hover:shadow-lg hover:-translate-y-1">
      <div className={`w-full h-3 rounded-t-md ${statusColorClass}`}></div>
      <div className="p-3 text-center">
        <p className="font-bold text-lg text-foreground">{room.roomNumber}</p>
        <p className="text-sm text-muted-foreground">{room.occupiedBeds} / {room.totalBeds} beds</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => onEditRoom(room)} className="mt-2">
        Edit
      </Button>
    </div>
  );
}

export function FloorSection({ floor, rooms, onEditRoom }) {
  const sortedRooms = rooms.sort((a, b) => {
    if (a.roomNumber && b.roomNumber) {
      return a.roomNumber.localeCompare(b.roomNumber);
    }
    return 0;
  });

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Floor {floor}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sortedRooms.map(room => (
          <RoomCard 
            key={room._id || room.roomNumber}
            room={room}
            onEditRoom={onEditRoom} // Pass the handler down
          />
        ))}
      </div>
    </section>
  );
}
