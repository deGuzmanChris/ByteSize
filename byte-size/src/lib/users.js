import { db, auth } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const USERS_COLLECTION = "users";

import { initializeApp, deleteApp, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function generateTempPassword() {
  return Math.random().toString(36).slice(-10) + "A1!";
}

// Creates a Firebase Auth user + Firestore doc without disrupting the admin's session
export async function createUser({ name, email, role }) {
  const appName = `secondary-${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  try {
    const secondaryAuth = getAuth(secondaryApp);
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      generateTempPassword()
    );
    const uid = credential.user.uid;
    await sendPasswordResetEmail(auth, email);
    await createUserDoc(uid, { name, email, role, authProvider: "email" });
    return uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}

export async function getUsers() {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUserById(uid) {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function createUserDoc(uid, { name, email, role, authProvider = "email" }) {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    id: uid,
    name,
    email,
    role,
    authProvider,
    mustChangePassword: authProvider === "email",
    createdAt: new Date().toISOString(),
  });
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, USERS_COLLECTION, uid), data);
}

export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}

export async function setMustChangePassword(uid, value) {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { mustChangePassword: value });
}
