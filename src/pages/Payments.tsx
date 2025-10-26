
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Get a reference to the functions service
const functions = getFunctions();

// Get a reference to the 'markAsPaid' function
const markAsPaid = httpsCallable(functions, 'markAsPaid');

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const firestore = getFirestore();
    const paymentsCollection = collection(firestore, 'payments');

    const unsubscribe = onSnapshot(paymentsCollection, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handlePayment = async (id) => {
    try {
      await markAsPaid({ paymentId: id });
      console.log('Payment status updated for payment ID:', id);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.studentId}</TableCell>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>
                  {payment.status === 'Pending' && (
                    <Button onClick={() => handlePayment(payment.id)}>Mark as Paid</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
