import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, DataSnapshot, get } from 'firebase/database'; // Importar 'get'
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
* Listens for real-time updates from a specific sensor node in the Firebase Realtime
Database.
*
* @param nodeId - The ID of the sensor node to listen to (e.g., "Esclavo_01").
* @param callback - The function to call with the new data.
* @returns An unsubscribe function to clean up the listener.
*/
export const listenToRealtimeMeasurements = (nodeId: string, callback: (data: FirebaseData) => void): (() => void) => {
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
    return () => {
        off(measurementsRef, 'value', listener);
    };
};

/**
* --- ¡FUNCIÓN AÑADIDA! ---
* Fetches the names of all sensor nodes (e.g., "Esclavo_01", "Esclavo_02")
* from the '/mediciones' path in Firebase.
* @param callback - The function to call with the array of node names.
*/
export const getSensorNodes = (callback: (nodes: string[]) => void): void => {
    const medicionesRef = ref(database, 'mediciones');
    get(medicionesRef).then((snapshot) => {
        if (snapshot.exists()) {
            // Object.keys() will return an array of the node names
            const nodeNames = Object.keys(snapshot.val());
            callback(nodeNames);
        } else {
            console.log("No sensor nodes found at /mediciones");
            callback([]);
        }
    }).catch((error) => {
        console.error("Error fetching sensor nodes:", error);
        callback([]);
    });
};