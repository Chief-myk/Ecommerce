// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginecommerce-825f3.firebaseapp.com",
  projectId: "loginecommerce-825f3",
  storageBucket: "loginecommerce-825f3.firebasestorage.app",
  messagingSenderId: "880555284521",
  appId: "1:880555284521:web:a719dd5413d19686e06438"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };