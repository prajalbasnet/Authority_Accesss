import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyCGcjdBaaon2hQEEPEB0f2ffnF2XjrrDeU",
  authDomain: "hamro-gunaso-a87e0.firebaseapp.com",
  projectId: "hamro-gunaso-a87e0",
  storageBucket: "hamro-gunaso-a87e0.firebasestorage.app",
  messagingSenderId: "127911692672",
  appId: "1:127911692672:web:2ae92c8148a36b81df5965",
  measurementId: "G-M9217PJ4CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;