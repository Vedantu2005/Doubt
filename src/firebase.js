// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAl1CSHPajLDtZ1_I7MUDHs-WEerCK5FuI",
  authDomain: "dount-5dc8d.firebaseapp.com",
  projectId: "dount-5dc8d",
  storageBucket: "dount-5dc8d.firebasestorage.app",
  messagingSenderId: "526316059103",
  appId: "1:526316059103:web:1ce78d80c1feb599566c6a",
  measurementId: "G-BQQHBLSKFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // <--- The app instance we need to export

// Services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app); 

// ✅ FIX: Export the 'app' instance along with the services
export { db, storage, auth, functions, app };