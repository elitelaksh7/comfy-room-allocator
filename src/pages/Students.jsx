
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddStudentModal } from "@/components/AddStudentModal";
import { EditStudentModal } from "@/components/EditStudentModal";
import { Loader2, AlertCircle } from "lucide-react";

const getBackendUrl = () => {
    const { protocol, hostname } = window.location;
    const backendPort = 5000;
    return `${protocol}//${hostname.replace(/\d+?-/, `${backendPort}-`)}`;
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();
      try {
        const response = await fetch(`${backendUrl}/api/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data.filter(student => student));
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load student data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async (newStudent) => {
    // TODO: Implement this after creating the backend endpoint
    console.log("Add student functionality not implemented yet.");
    setIsAddModalOpen(false);
  };
  
  const handleDeleteStudent = async (studentId) => {
    // TODO: Implement this after creating the backend endpoint
    console.log("Delete student functionality not implemented yet.");
  };

  const handleEdit = (student) => {
    // TODO: Implement this after creating the backend endpoint
    setSelectedStudent(student);
    setIsEditModalOpen(true);
    console.log("Edit student functionality not implemented yet.");
  };

  const handleSave = async (updatedStudent) => {
    // TODO: Implement this after creating the backend endpoint
    console.log("Save student functionality not implemented yet.");
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Students</CardTitle>
          <Button onClick={() => alert("Add student functionality will be implemented soon.")}>Add Student</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              <AlertCircle className="mx-auto h-8 w-8" />
              <p className="mt-2">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setError(null)}>Dismiss</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.roomNumber || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => alert("Edit student functionality will be implemented soon.")}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => alert("Delete student functionality will be implemented soon.")}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddStudentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleSave}
      />
    </>
  );
}
