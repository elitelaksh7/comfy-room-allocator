
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRoomModal({ isOpen, onClose, onAdd }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [totalBeds, setTotalBeds] = useState("");

  const handleSubmit = () => {
    onAdd({ 
      roomNumber, 
      floor: parseInt(floor), 
      totalBeds: parseInt(totalBeds), 
      occupiedBeds: 0 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
            <Input id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor" className="text-right">Floor</Label>
            <Input id="floor" type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalBeds" className="text-right">Total Beds</Label>
            <Input id="totalBeds" type="number" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
