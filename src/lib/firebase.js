// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0ubjioSrbs5SAdAarh760K4eqSRHbpk4",
  authDomain: "hostel-room-allocation-s-9fa40.firebaseapp.com",
  projectId: "hostel-room-allocation-s-9fa40",
  storageBucket: "hostel-room-allocation-s-9fa40.firebasestorage.app",
  messagingSenderId: "211364371281",
  appId: "1:211364371281:web:73230268fd2044355ed170",
  measurementId: "G-K898ELTRLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
