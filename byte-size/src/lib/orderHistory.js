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
export async function logOrder(input) {
  // Support BOTH formats:
  // 1. logOrder(itemsArray)
  // 2. logOrder({ items, notes, createdAt })

  const items = Array.isArray(input) ? input : input.items || [];
  const notes = Array.isArray(input) ? "" : input.notes || "";
  const createdAt = Array.isArray(input)
    ? new Date()
    : input.createdAt || new Date();

  const record = {
    date: createdAt.toISOString(),
    notes,
    items: items.map(({ id, name, need, unit }) => ({
      id,
      name,
      need,
      unit,
    })),
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