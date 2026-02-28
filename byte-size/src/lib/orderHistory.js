import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const ORDER_HISTORY_COLLECTION = "orderHistory";

// Log a completed order export to Firestore
export async function logOrder(items) {
  const record = {
    date: new Date().toISOString(),
    items: items.map(({ id, name, need, unit }) => ({ id, name, need, unit })),
    totalQuantity: items.reduce((sum, r) => sum + r.need, 0),
  };
  await addDoc(collection(db, ORDER_HISTORY_COLLECTION), record);
}

// Fetch all order history records on or after `sinceDate` (ISO string)
export async function getOrderHistory(sinceDate) {
  const q = query(
    collection(db, ORDER_HISTORY_COLLECTION),
    where("date", ">=", sinceDate),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
