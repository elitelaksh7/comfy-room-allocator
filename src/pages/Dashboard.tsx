import { useState } from "react";
import { FloorSection } from "@/components/FloorSection";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Button } from "@/components/ui/button";
import { Building, TrendingUp } from "lucide-react";

const floorsData = [
  {
    floorNumber: 1,
    rooms: [
      { id: "1-1", roomNumber: "ACR-1", totalBeds: 4, occupiedBeds: 4 },
      { id: "1-2", roomNumber: "ACR-2", totalBeds: 3, occupiedBeds: 2 },
      { id: "1-3", roomNumber: "CR-1", totalBeds: 2, occupiedBeds: 0 },
      { id: "1-4", roomNumber: "CR-2", totalBeds: 4, occupiedBeds: 4 },
    ]
  },
  {
    floorNumber: 2,
    rooms: [
      { id: "2-1", roomNumber: "ACR-3", totalBeds: 4, occupiedBeds: 3 },
      { id: "2-2", roomNumber: "ACR-4", totalBeds: 3, occupiedBeds: 3 },
      { id: "2-3", roomNumber: "CR-3", totalBeds: 2, occupiedBeds: 1 },
      { id: "2-4", roomNumber: "CR-4", totalBeds: 4, occupiedBeds: 0 },
    ]
  },
  {
    floorNumber: 3,
    rooms: [
      { id: "3-1", roomNumber: "ACR-5", totalBeds: 4, occupiedBeds: 4 },
      { id: "3-2", roomNumber: "ACR-6", totalBeds: 3, occupiedBeds: 3 },
      { id: "3-3", roomNumber: "CR-5", totalBeds: 2, occupiedBeds: 2 },
      { id: "3-4", roomNumber: "CR-6", totalBeds: 4, occupiedBeds: 4 },
    ]
  }
];

export default function Dashboard() {
  const [selectedFloor, setSelectedFloor] = useState(1);

  const currentFloorData = floorsData.find(f => f.floorNumber === selectedFloor);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your hostel overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Overall Occupancy</p>
              <p className="text-lg font-bold text-primary">73%</p>
            </div>
          </div>
        </div>

        {/* Floor Selector */}
        <div className="flex gap-2 flex-wrap">
          {floorsData.map((floor) => (
            <Button
              key={floor.floorNumber}
              variant={selectedFloor === floor.floorNumber ? "default" : "outline"}
              onClick={() => setSelectedFloor(floor.floorNumber)}
              className="gap-2 transition-all duration-300"
            >
              <Building className="h-4 w-4" />
              Floor {floor.floorNumber}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Floor Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            {currentFloorData && (
              <FloorSection 
                floorNumber={currentFloorData.floorNumber}
                rooms={currentFloorData.rooms}
              />
            )}
          </div>

          {/* Notification Panel - Takes 1 column */}
          <div>
            <NotificationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
