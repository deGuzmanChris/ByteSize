const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} = require("firebase/firestore");

// ──────────────────────────────────────────
// FIREBASE CONFIG
// Replace with your actual Firebase config
// ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ──────────────────────────────────────────
// ENUMS / CONSTANTS
// ──────────────────────────────────────────

const ROLES = {
  MANAGER: "manager",
  STAFF: "staff",
};

const CATEGORIES = {
  DESSERT: "dessert",
  CONDIMENT: "condiment",
  ENTREE: "entree",
  SIDE_DISH: "side_dish",
  APPETIZER: "appetizer",
  BAR: "bar",
  BEVERAGES: "beverages",
  DRY_GOODS_PANTRY: "dry_goods_pantry",
  KITCHEN_SUPPLIES: "kitchen_supplies",
  CLEANING_SUPPLIES: "cleaning_supplies",
  WASHROOM_ESSENTIALS: "washroom_essentials",
};

const UNITS_OF_MEASURE = {
  COUNT: "count",
  BOTTLES: "bottles",
  BAGS: "bags",
  CASES: "cases",
  LBS: "lbs",
  OZ: "oz",
  GALLONS: "gallons",
  BOXES: "boxes",
  SHEETS: "sheets",
};

// ──────────────────────────────────────────
// SCHEMA: USERS
// ──────────────────────────────────────────
// Collection: "users"
// Document ID: Firebase Auth UID
//
// Fields:
//   uid              (string)    – matches the Firebase Auth UID
//   email            (string)    – user's email address
//   name             (string)    – user's display name
//   password_hash    (string)    – bcrypt hashed password (set by backend)
//   role             (string)    – "manager" or "staff"
//   created_at       (Timestamp) – when the account was created
// ──────────────────────────────────────────

async function createUser(uid, email, name, passwordHash, role) {
  const userDoc = {
    uid: uid,
    email: email,
    name: name,
    password_hash: passwordHash,
    role: role, // ROLES.MANAGER or ROLES.STAFF
    created_at: Timestamp.now(),
  };

  await setDoc(doc(db, "users", uid), userDoc);
  console.log(`User created: ${name} (${role})`);
  return userDoc;
}

// ──────────────────────────────────────────
// SCHEMA: INVENTORY
// ──────────────────────────────────────────
// Collection: "inventory"
// Document ID: auto-generated
//
// Fields:
//   item_name           (string)    – name of the item
//   category            (string)    – one of the CATEGORIES values
//   unit_of_measure     (string)    – base unit (e.g. "bottles", "lbs")
//   container_unit      (string)    – container type (e.g. "case", "box")
//                                     set to null if sold/tracked individually
//   units_per_container (number)    – how many base units fit in one container
//                                     e.g. 12 bottles per case
//                                     set to null if no container unit
//   quantity_kitchen    (number)    – amount currently in the kitchen
//   quantity_fridge     (number)    – amount currently in the fridge
//   quantity_freezer    (number)    – amount currently in the freezer
//   created_at          (Timestamp) – when the item was first added
//   updated_at          (Timestamp) – last time any field was modified
// ──────────────────────────────────────────

async function createInventoryItem(
  itemName,
  category,
  unitOfMeasure,
  containerUnit,
  unitsPerContainer,
  quantityKitchen,
  quantityFridge,
  quantityFreezer
) {
  const inventoryDoc = {
    item_name: itemName,
    category: category, // one of CATEGORIES
    unit_of_measure: unitOfMeasure, // one of UNITS_OF_MEASURE
    container_unit: containerUnit, // e.g. "case" or null
    units_per_container: unitsPerContainer, // e.g. 12 or null
    quantity_kitchen: quantityKitchen,
    quantity_fridge: quantityFridge,
    quantity_freezer: quantityFreezer,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  };

  const inventoryRef = doc(collection(db, "inventory"));
  await setDoc(inventoryRef, inventoryDoc);
  console.log(`Inventory item created: ${itemName}`);
  return inventoryDoc;
}

// ──────────────────────────────────────────
// USAGE EXAMPLES
// ──────────────────────────────────────────
// These functions are exported and can be called
// from your application to create users and inventory items.
//
// Example - Creating a user:
// await createUser(
//   "uid_123",
//   "user@restaurant.com",
//   "John Doe",
//   "$2b$10$actualBcryptHashHere",
//   ROLES.MANAGER
// );
//
// Example - Creating an inventory item:
// await createInventoryItem(
//   "Olive Oil",
//   CATEGORIES.CONDIMENT,
//   UNITS_OF_MEASURE.BOTTLES,
//   "case",
//   12,
//   5,  // quantity_kitchen
//   0,  // quantity_fridge
//   0   // quantity_freezer
// );
// ──────────────────────────────────────────

module.exports = {
  createUser,
  createInventoryItem,
  ROLES,
  CATEGORIES,
  UNITS_OF_MEASURE,
};