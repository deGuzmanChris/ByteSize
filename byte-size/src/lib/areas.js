import { db } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  deleteDoc
} from "firebase/firestore";

const AREAS_COLLECTION = "areas";

// Generate next sequential area ID
export async function getNextAreaId() {
  const areas = await getAreas();
  const ids = areas.map(area => area.id).filter(id => /^area_\d+$/.test(id));
  const nums = ids.map(id => parseInt(id.replace('area_', ''), 10));
  const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
  return `area_${String(maxNum + 1).padStart(3, '0')}`;
}

// Create a new area with sequential ID
export async function createArea(areaName) {
  const nextId = await getNextAreaId();
  await setDoc(doc(db, AREAS_COLLECTION, nextId), {
    name: areaName,
    created_at: new Date()
  });
  return nextId;
}

// Get all areas
export async function getAreas() {
  const snapshot = await getDocs(collection(db, AREAS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete an area
export async function deleteArea(areaId) {
  const areaRef = doc(db, AREAS_COLLECTION, areaId);
  await deleteDoc(areaRef);
}
