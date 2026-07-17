import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics is browser only, might need check if window defined

const firebaseConfig = {
  apiKey: "AIzaSyAV4CHTX5f1FqY2yN2j4397ICHdYz3XFw0",
  authDomain: "waitlistlakshyniti.firebaseapp.com",
  projectId: "waitlistlakshyniti",
  storageBucket: "waitlistlakshyniti.firebasestorage.app",
  messagingSenderId: "1064363762498",
  appId: "1:1064363762498:web:7de8c18d1bcb61d0011edb",
  measurementId: "G-HFE1EWEV9Q"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
