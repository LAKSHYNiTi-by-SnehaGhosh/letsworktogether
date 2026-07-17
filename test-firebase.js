const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAV4CHTX5f1FqY2yN2j4397ICHdYz3XFw0",
  authDomain: "waitlistlakshyniti.firebaseapp.com",
  projectId: "waitlistlakshyniti",
  storageBucket: "waitlistlakshyniti.firebasestorage.app",
  messagingSenderId: "1064363762498",
  appId: "1:1064363762498:web:7de8c18d1bcb61d0011edb",
  measurementId: "G-HFE1EWEV9Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log("Attempting to write...");
    const docRef = await addDoc(collection(db, "waitlist"), {
      email: "test@example.com",
      createdAt: serverTimestamp()
    });
    console.log("Success! Document written with ID: ", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("Error writing document: ", e);
    process.exit(1);
  }
}

test();
