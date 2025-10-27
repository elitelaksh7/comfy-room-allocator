
import { useState, useEffect } from "react";
import { FloorSection } from "@/components/FloorSection";
import { NotificationPanel } from "@/components/NotificationPanel";
import { RoomDetailsModal } from "@/components/RoomDetailsModal";
import { Button } from "@/components/ui/button";
import { Building, TrendingUp, Loader2 } from "lucide-react";

// All fetch requests will now be relative and handled by the Vite proxy.
const API_BASE_URL = "/api";

export default function Dashboard() {
  const [floorsData, setFloorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overallOccupancy, setOverallOccupancy] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFloorsData(data);

        if (data && data.length > 0) {
          setSelectedFloor(data[0].floorNumber);
          let totalBeds = 0;
          let totalOccupied = 0;
          data.forEach(floor => {
            floor.rooms.forEach(room => {
              totalBeds += room.totalBeds;
              totalOccupied += room.occupiedBeds;
            });
          });
          const occupancy = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
          setOverallOccupancy(occupancy);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentFloorData = floorsData.find(f => f.floorNumber === selectedFloor);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading Hostel Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">Failed to Load Data</h3>
          <p className="text-muted-foreground">Could not connect to the server. Please check the proxy configuration and ensure the backend is running.</p>
          <p className="text-sm text-muted-foreground mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Comfy Room Allocator</h1>
            <p className="text-muted-foreground">Welcome back! Here's your hostel overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Overall Occupancy</p>
              <p className="text-lg font-bold text-primary">{overallOccupancy}%</p>
            </div>
          </div>
        </div>

        {floorsData.length === 0 ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
             <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
             <p className="text-muted-foreground">No floors or rooms were found in the database.</p>
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {currentFloorData && (
                  <FloorSection 
                    floorNumber={currentFloorData.floorNumber}
                    rooms={currentFloorData.rooms}
                    onRoomClick={handleRoomClick}
                  />
                )}
              </div>
              <div>
                <NotificationPanel />
              </div>
            </div>
          </>
        )}
      </div>

      <RoomDetailsModal 
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
