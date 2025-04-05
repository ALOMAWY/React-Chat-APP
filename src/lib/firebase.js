import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_KEY,
  authDomain: "react-chat-app-be71c.firebaseapp.com",
  projectId: "react-chat-app-be71c",
  storageBucket: "react-chat-app-be71c.firebasestorage.app",
  messagingSenderId: "502260995769",
  appId: "1:502260995769:web:ce9a242cecb04ad8d3ed68",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
