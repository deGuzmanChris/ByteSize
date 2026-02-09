import { db } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";

const INVENTORY_COLLECTION = "inventory";

// Generate next sequential inventory ID
export async function getNextInventoryId() {
  const items = await getInventoryItems();
  const ids = items.map(item => item.id).filter(id => /^inv_\d+$/.test(id));
  const nums = ids.map(id => parseInt(id.replace('inv_', ''), 10));
  const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
  return `inv_${String(maxNum + 1).padStart(3, '0')}`;
}

// Create a new inventory item with sequential ID
export async function createInventoryItem(itemData) {
  const nextId = await getNextInventoryId();
  await setDoc(doc(db, INVENTORY_COLLECTION, nextId), {
    ...itemData,
    id: nextId
  });
  return { id: nextId, ...itemData };
}

// Get all inventory items
export async function getInventoryItems() {
  const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update an inventory item
export async function updateInventoryItem(id, itemData) {
  const itemRef = doc(db, INVENTORY_COLLECTION, id);
  await updateDoc(itemRef, itemData);
}

// Delete an inventory item
export async function deleteInventoryItem(id) {
  const itemRef = doc(db, INVENTORY_COLLECTION, id);
  await deleteDoc(itemRef);
}

// Get a single inventory item
export async function getInventoryItem(id) {
  const itemRef = doc(db, INVENTORY_COLLECTION, id);
  const snapshot = await getDoc(itemRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
