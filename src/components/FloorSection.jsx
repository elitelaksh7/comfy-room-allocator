
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomCard } from "./RoomCard";
import { Building2 } from "lucide-react";

export function FloorSection({ floorNumber, rooms, onRoomClick }) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <span>Floor {floorNumber}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <RoomCard 
              key={room.id} 
              {...room} 
              onClick={() => onRoomClick(room)} // Pass the onClick handler
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
