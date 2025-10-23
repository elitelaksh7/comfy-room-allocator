
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from './firebase';

// Sign Up
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const doSignOut = () => {
  return signOut(auth);
};

// Password Reset
export const passwordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};
