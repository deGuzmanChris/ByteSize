// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1ST99wHU2_gsGG_x8CBbygFqo2iLGV4g",
  authDomain: "byte-size-dd84f.firebaseapp.com",
  projectId: "byte-size-dd84f",
  storageBucket: "byte-size-dd84f.firebasestorage.app",
  messagingSenderId: "1021402167470",
  appId: "1:1021402167470:web:767af84cd59f6b409ad53f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };