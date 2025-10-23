
import { Bed, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RoomCardProps {
  roomNumber: string;
  totalBeds: number;
  occupiedBeds: number;
  onClick: () => void;
}

export function RoomCard({ roomNumber, totalBeds, occupiedBeds, onClick }: RoomCardProps) {
  const occupancyRate = (occupiedBeds / totalBeds) * 100;
  
  const getStatusConfig = () => {
    if (occupiedBeds === totalBeds) {
      return {
        color: "bg-status-full/10 text-status-full",
        indicatorColor: "bg-status-full",
        text: "Full"
      };
    }
    if (occupiedBeds > 0) {
      return {
        color: "bg-status-half/10 text-status-half",
        indicatorColor: "bg-status-half",
        text: "Half-filled"
      };
    }
    return {
      color: "bg-status-available/10 text-status-available",
      indicatorColor: "bg-status-available",
      text: "Available"
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border cursor-pointer"
      onClick={onClick} // Add the onClick handler
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
          <Progress 
            value={occupancyRate} 
            className="h-2"
            indicatorClassName={statusConfig.indicatorColor}
          />
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
