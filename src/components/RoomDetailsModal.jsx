
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bed } from "lucide-react";

// Placeholder data for student names - we'll replace this with real data later
const studentNames = ["Alice", "Bob", "Charlie", "David", "Eve"];

export function RoomDetailsModal({ room, isOpen, onClose }) {
  if (!room) return null;

  // Create an array of beds with student names
  const beds = Array.from({ length: room.totalBeds }).map((_, i) => ({
    occupied: i < room.occupiedBeds,
    studentName: i < room.occupiedBeds ? studentNames[i % studentNames.length] : null,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room.roomNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {beds.map((bed, index) => (
            <div key={index} className={`flex items-center gap-2 p-3 rounded-lg ${bed.occupied ? 'bg-red-100' : 'bg-green-100'}`}>
              <Bed className={`h-6 w-6 ${bed.occupied ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="font-semibold">Bed {index + 1}</p>
                <p className="text-sm text-muted-foreground">{bed.occupied ? bed.studentName : "Available"}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
