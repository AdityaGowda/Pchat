import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGsRDAzKQMhjcGWL-mo80TcABZ7LBywoc",
  authDomain: "pchat-747ef.firebaseapp.com",
  projectId: "pchat-747ef",
  storageBucket: "pchat-747ef.firebasestorage.app",
  messagingSenderId: "260968168718",
  appId: "1:260968168718:web:730f75745bfed9cbb3eb5f",
  databaseURL:
    "https://pchat-747ef-default-rtdb.asia-southeast1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
