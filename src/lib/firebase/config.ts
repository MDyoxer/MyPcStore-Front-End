// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAMqeBEV2BtKaQq-zwe9hLP1_B3NGL-es",
  authDomain: "mypcstore-89f19.firebaseapp.com",
  projectId: "mypcstore-89f19",
  storageBucket: "mypcstore-89f19.firebasestorage.app",
  messagingSenderId: "291870015960",
  appId: "1:291870015960:web:31f241e273983161cc72ad",
  measurementId: "G-TXEXXLFHPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

