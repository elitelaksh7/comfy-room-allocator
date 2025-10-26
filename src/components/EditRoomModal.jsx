
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export function EditRoomModal({ isOpen, onClose, room, onSave }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [occupiedBeds, setOccupiedBeds] = useState("");

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
      setFloor(room.floor);
      setTotalBeds(room.totalBeds);
      setOccupiedBeds(room.occupiedBeds);
    }
  }, [room]);

  const handleSave = () => {
    onSave({ ...room, roomNumber, floor, totalBeds, occupiedBeds });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
            <Input id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor" className="text-right">Floor</Label>
            <Input id="floor" value={floor} onChange={(e) => setFloor(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalBeds" className="text-right">Total Beds</Label>
            <Input id="totalBeds" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="occupiedBeds" className="text-right">Occupied Beds</Label>
            <Input id="occupiedBeds" value={occupiedBeds} onChange={(e) => setOccupiedBeds(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
