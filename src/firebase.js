
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC8ozoHTKJH_OVY-YwlKq8_wO-evrjjA8s",
  authDomain: "smartadd-7efd9.firebaseapp.com",
  projectId: "smartadd-7efd9",
  storageBucket: "smartadd-7efd9.firebasestorage.app",
  messagingSenderId: "1042423008132",
  appId: "1:1042423008132:web:99abca2416071939abebd1",
  measurementId: "G-GNT6SG4JJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
