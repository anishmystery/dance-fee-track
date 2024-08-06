import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIxnUfOpMDdmcdIgs0PaDrzs3BXn4r0Eg",
  authDomain: "dance-fee-track.firebaseapp.com",
  projectId: "dance-fee-track",
  storageBucket: "dance-fee-track.appspot.com",
  messagingSenderId: "1000807421595",
  appId: "1:1000807421595:web:d0c473d3506b91e626983e",
  measurementId: "G-MPHEX8BT3E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
