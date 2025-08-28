import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, DataSnapshot } from 'firebase/database';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { FirebaseData } from '../types';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyAkpxzYdPvk34pNoUOAiSSTor_Qcb1XOdU",
  authDomain: "monitoreo-ruido-ambiental.firebaseapp.com",
  databaseURL: "https://monitoreo-ruido-ambiental-default-rtdb.firebaseio.com",
  projectId: "monitoreo-ruido-ambiental",
  storageBucket: "monitoreo-ruido-ambiental.appspot.com",
  messagingSenderId: "305103444983",
  appId: "1:305103444983:web:7f8d6f123456789abcde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export auth functions
export const registerWithEmail = createUserWithEmailAndPassword;
export const signInWithEmail = signInWithEmailAndPassword;
export const logout = signOut;

/**
 * Listens for real-time updates from a specific sensor node in the Firebase Realtime Database.
 * @param nodeId - The ID of the sensor node to listen to (e.g., "Esclavo_01").
 * @param callback - The function to call with the new data.
 * @returns An unsubscribe function to clean up the listener.
 */
export const listenToRealtimeMeasurements = (nodeId: string, callback: (data: FirebaseData) => void): (() => void) => {
  // Reference to the specific sensor data path in the database
  const measurementsRef = ref(database, `mediciones/${nodeId}`);

  const listener = onValue(
    measurementsRef,
    (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      callback(data || {});
    },
    (error) => {
      console.error(`Firebase read failed for node ${nodeId}: `, error);
      callback({});
    }
  );

  // Return an unsubscribe function to be called on component unmount
  return () => {
    off(measurementsRef, 'value', listener);
  };
};