// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAOAZ6lBvySQf6bPZT2GaXHZBKUJ0YECU",
  authDomain: "babyak-75c28.firebaseapp.com",
  projectId: "babyak-75c28",
  storageBucket: "babyak-75c28.appspot.com",
  messagingSenderId: "455334005484",
  appId: "1:455334005484:web:1c7f75c356461b58a8f3c9",
  measurementId: "G-QGRDPXT25T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
