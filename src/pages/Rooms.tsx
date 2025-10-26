
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { AddRoomModal } from "@/components/AddRoomModal";
import { EditRoomModal } from "@/components/EditRoomModal";
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getRooms = httpsCallable(functions, 'getRooms');
const addRoom = httpsCallable(functions, 'addRoom');
const updateRoom = httpsCallable(functions, 'updateRoom');
const deleteRoom = httpsCallable(functions, 'deleteRoom');

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const result = await getRooms();
      setRooms(result.data as any[]);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (newRoom) => {
    try {
      await addRoom(newRoom);
      fetchRooms(); // Refetch rooms after adding
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedRoom) => {
    try {
      await updateRoom(updatedRoom);
      fetchRooms(); // Refetch rooms after updating
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoom({ id });
      fetchRooms(); // Refetch rooms after deleting
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rooms</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Room</Button>
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
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRoom}
      />
      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        room={selectedRoom}
        onSave={handleSave}
      />
    </>
  );
}
