
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { EditRoomModal } from "@/components/EditRoomModal";

const initialRooms = [
    { id: "1-1", roomNumber: "ACR-1", floor: 1, totalBeds: 4, occupiedBeds: 4 },
    { id: "1-2", roomNumber: "ACR-2", floor: 1, totalBeds: 3, occupiedBeds: 2 },
    { id: "2-1", roomNumber: "ACR-3", floor: 2, totalBeds: 4, occupiedBeds: 3 },
    { id: "2-2", roomNumber: "ACR-4", floor: 2, totalBeds: 3, occupiedBeds: 3 },
    { id: "3-1", roomNumber: "CR-1", floor: 3, totalBeds: 2, occupiedBeds: 1 },
];

export default function Rooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedRoom) => {
    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rooms</CardTitle>
          <Button>Add Room</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Total Beds</TableHead>
                <TableHead>Occupied Beds</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.totalBeds}</TableCell>
                  <TableCell>{room.occupiedBeds}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(room)}>Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        room={selectedRoom}
        onSave={handleSave}
      />
    </>
  );
}
