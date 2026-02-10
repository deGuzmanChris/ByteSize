export const LS_ITEMS_KEY = "bytesize_items_v1";

export function loadItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveItems(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_ITEMS_KEY, JSON.stringify(items));
}

export function addItem(item) {
  const items = loadItems();
  items.push(item);
  saveItems(items);
  return items;
}
