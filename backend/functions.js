
import { httpsCallable } from "firebase/functions";
import { functions } from './firebase';

// Assign a room to a student
export const assignRoom = httpsCallable(functions, 'assignRoom');

// Export data to CSV
export const exportData = httpsCallable(functions, 'exportData');
