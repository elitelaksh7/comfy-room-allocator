
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

export default function Vacancy() {
  const vacantRooms = floorsData.flatMap(floor => 
    floor.rooms.filter(room => room.occupiedBeds < room.totalBeds)
  );

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Room Number', 'Floor', 'Available Beds']],
      body: vacantRooms.map(room => [
        room.roomNumber,
        floorsData.find(f => f.rooms.some(r => r.id === room.id))?.floorNumber,
        room.totalBeds - room.occupiedBeds
      ]),
    });
    doc.save('vacancy-report.pdf');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vacancy Report</CardTitle>
        <Button onClick={downloadPdf}>Download in PDF</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Available Beds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacantRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{floorsData.find(f => f.rooms.some(r => r.id === room.id))?.floorNumber}</TableCell>
                <TableCell>{room.totalBeds - room.occupiedBeds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
