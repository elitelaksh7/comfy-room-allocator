
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddStudentModal } from "@/components/AddStudentModal";
import { EditStudentModal } from "@/components/EditStudentModal";
import { Loader2, AlertCircle } from "lucide-react";

// The base URL for our API, handled by the Vite proxy
const API_BASE_URL = "/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch all students from the API when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
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
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const addedStudent = await response.json();
      setStudents([...students, addedStudent]); // Add the student returned from the API
      setIsAddModalOpen(false); // Close modal on success
    } catch (err) {
      console.error("Failed to add student:", err);
      // Here you could add state to show an error message in the modal
    }
  };
  
  const handleDeleteStudent = async (studentId) => {
    // Optimistic UI: remove student from list immediately
    const originalStudents = [...students];
    setStudents(students.filter(s => s.id !== studentId));

    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to delete student:", err);
      // If the API call fails, revert the change
      setStudents(originalStudents);
      setError("Failed to delete student. Please try again.");
    }
  };


  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedStudent) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Students</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Student</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-2 text-destructive">{error}</p>
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
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.room}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(student)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.id)}>Delete</Button>
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
