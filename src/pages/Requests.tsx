
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ViewRequestModal } from "@/components/ViewRequestModal";

const initialRequests = [
  { id: "1", studentName: "Alice Johnson", requestType: "Room Change", date: "2024-07-28", status: "Pending" },
  { id: "2", studentName: "Bob Williams", requestType: "Late Entry", date: "2024-07-27", status: "Approved" },
  { id: "3", studentName: "Charlie Brown", requestType: "Guest Stay", date: "2024-07-26", status: "Rejected" },
];

export default function Requests() {
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleReject = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Approved":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Requests and Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'Pending' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleApprove(request.id)}>Approve</Button>
                        <Button variant="outline" size="sm" className="ml-2" onClick={() => handleReject(request.id)}>Reject</Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => handleView(request)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ViewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} request={selectedRequest} />
    </>
  );
}
