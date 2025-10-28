
import { Bed, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RoomCard({ roomNumber, totalBeds, occupiedBeds, onClick }) {
  const occupancyRate = (occupiedBeds / totalBeds) * 100;

  const getStatusConfig = () => {
    if (occupiedBeds === totalBeds) {
      return {
        color: "bg-status-full/10 text-status-full",
        text: "Full"
      };
    }
    if (occupiedBeds > 0) {
      return {
        color: "bg-status-half/10 text-status-half",
        text: "Half-filled"
      };
    }
    return {
      color: "bg-status-available/10 text-status-available",
      text: "Available"
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bed className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{roomNumber}</h3>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color}`}>
            {statusConfig.text}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex h-2 w-full overflow-hidden rounded-full">
            <div style={{ width: `${occupancyRate}%` }} className="bg-status-full"></div>
            <div style={{ width: `${100 - occupancyRate}%` }} className="bg-status-available"></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{occupiedBeds}/{totalBeds} occupied</span>
            </div>
            <span className="font-medium text-foreground">{Math.round(occupancyRate)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
