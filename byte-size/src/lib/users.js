import { db, auth } from "./firebase";
import { encryptField, decryptField } from "./encryption";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const USERS_COLLECTION = "users";

import { initializeApp, deleteApp, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

// can import firebaseConfig from firebase.js
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
  const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  for (const user of users) {
    user.name = await decryptField(user.name);
  }
  return users;
}

export async function getUserById(uid) {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = { id: snapshot.id, ...snapshot.data() };
  data.name = await decryptField(data.name);
  return data;
}

export async function getUserByEmail(email) {
  const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = { id: d.id, ...d.data() };
  data.name = await decryptField(data.name);
  return data;
}

export async function createUserDoc(uid, { name, email, role, authProvider = "email" }) {
  const encryptedName = await encryptField(name);
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    id: uid,
    name: encryptedName,
    email,
    role,
    authProvider,
    mustChangePassword: authProvider === "email",
    createdAt: new Date().toISOString(),
  });
}

export async function updateUserDoc(uid, data) {
  const updatedData = { ...data };
  if (updatedData.name) {
    updatedData.name = await encryptField(updatedData.name);
  }
  await updateDoc(doc(db, USERS_COLLECTION, uid), updatedData);
}

export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}

export async function setMustChangePassword(uid, value) {
  await updateDoc(doc(db, USERS_COLLECTION, uid), { mustChangePassword: value });
}
