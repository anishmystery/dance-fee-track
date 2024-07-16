// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
