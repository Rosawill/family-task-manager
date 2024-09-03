import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlYeri_fvHYDpL3ke8IvLzwGNCbEwJSrg",
  authDomain: "family-task-manager-7dbdf.firebaseapp.com",
  projectId: "family-task-manager-7dbdf",
  storageBucket: "family-task-manager-7dbdf.appspot.com",
  messagingSenderId: "109309193691",
  appId: "1:109309193691:web:dbe4959a56b7703f914bfe",
  measurementId: "G-6NLFRVGYQX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };