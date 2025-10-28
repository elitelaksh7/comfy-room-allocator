
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { EditRoomModal } from "@/components/EditRoomModal";
import { FloorSection } from "@/components/FloorSection";

export default function Dashboard() {
  const [floorsData, setFloorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFloorsData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRoom(null);
  };

  const handleSaveRoom = async (updatedRoom) => {
    try {
      const response = await fetch(`/api/rooms/${updatedRoom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom),
      });
      if (!response.ok) throw new Error('Failed to save room');
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to save room:", error);
    } finally {
      handleCloseModal();
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-background text-destructive">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Hostel Dashboard</h1>
      {floorsData.map((floor) => (
        <FloorSection
          key={floor.floor}
          floor={floor.floor}
          rooms={floor.rooms}
          onEditRoom={handleEditRoom}
        />
      ))}
      {editingRoom && (
        <EditRoomModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          room={editingRoom}
          onSave={handleSaveRoom}
        />
      )}
    </div>
  );
}
