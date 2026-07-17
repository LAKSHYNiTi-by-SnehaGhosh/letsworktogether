import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics is browser only, might need check if window defined

const firebaseConfig = {
  apiKey: "AIzaSyBMheEPPdp3gZ-Qfr1fgnGbLph9omfpN64",
  authDomain: "lwtwaitinglakshyniti.firebaseapp.com",
  projectId: "lwtwaitinglakshyniti",
  storageBucket: "lwtwaitinglakshyniti.firebasestorage.app",
  messagingSenderId: "294410180572",
  appId: "1:294410180572:web:5f600aeabf7d8ea94ca119",
  measurementId: "G-FPHF69KME7"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
