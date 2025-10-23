
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ViewRequestModal({ request, isOpen, onClose }) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <div>
          <p><strong>Student Name:</strong> {request.studentName}</p>
          <p><strong>Request Type:</strong> {request.requestType}</p>
          <p><strong>Date:</strong> {request.date}</p>
          <p><strong>Status:</strong> {request.status}</p>
        </div>
        <div className="text-right mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
