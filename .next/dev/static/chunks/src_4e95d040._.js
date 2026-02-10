(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/firebase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "provider",
    ()=>provider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Import the functions you need from the SDKs you need
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyD87rJE1Xqa1ytwXSzKF_k3Aa7EysP3I2c"),
    authDomain: ("TURBOPACK compile-time value", "byte-size-dd84f.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "byte-size-dd84f"),
    storageBucket: ("TURBOPACK compile-time value", "byte-size-dd84f.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "1021402167470"),
    appId: ("TURBOPACK compile-time value", "1:1021402167470:web:767af84cd59f6b409ad53f")
};
// Initialize Firebase
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
// Initialize Firebase Auth and Google Provider
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/inventory.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInventoryItem",
    ()=>createInventoryItem,
    "deleteInventoryItem",
    ()=>deleteInventoryItem,
    "getInventoryItem",
    ()=>getInventoryItem,
    "getInventoryItems",
    ()=>getInventoryItems,
    "getNextInventoryId",
    ()=>getNextInventoryId,
    "updateInventoryItem",
    ()=>updateInventoryItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
const INVENTORY_COLLECTION = "inventory";
async function getNextInventoryId() {
    const items = await getInventoryItems();
    const ids = items.map((item)=>item.id).filter((id)=>/^inv_\d+$/.test(id));
    const nums = ids.map((id)=>parseInt(id.replace('inv_', ''), 10));
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
    return `inv_${String(maxNum + 1).padStart(3, '0')}`;
}
async function createInventoryItem(itemData) {
    const nextId = await getNextInventoryId();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], INVENTORY_COLLECTION, nextId), {
        ...itemData,
        id: nextId
    });
    return {
        id: nextId,
        ...itemData
    };
}
async function getInventoryItems() {
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], INVENTORY_COLLECTION));
    return snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
}
async function updateInventoryItem(id, itemData) {
    const itemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], INVENTORY_COLLECTION, id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(itemRef, itemData);
}
async function deleteInventoryItem(id) {
    const itemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], INVENTORY_COLLECTION, id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(itemRef);
}
async function getInventoryItem(id) {
    const itemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], INVENTORY_COLLECTION, id);
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(itemRef);
    return snapshot.exists() ? {
        id: snapshot.id,
        ...snapshot.data()
    } : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/areas.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createArea",
    ()=>createArea,
    "deleteArea",
    ()=>deleteArea,
    "getAreas",
    ()=>getAreas,
    "getNextAreaId",
    ()=>getNextAreaId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
const AREAS_COLLECTION = "areas";
async function getNextAreaId() {
    const areas = await getAreas();
    const ids = areas.map((area)=>area.id).filter((id)=>/^area_\d+$/.test(id));
    const nums = ids.map((id)=>parseInt(id.replace('area_', ''), 10));
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
    return `area_${String(maxNum + 1).padStart(3, '0')}`;
}
async function createArea(areaName) {
    const nextId = await getNextAreaId();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], AREAS_COLLECTION, nextId), {
        name: areaName,
        created_at: new Date()
    });
    return nextId;
}
async function getAreas() {
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], AREAS_COLLECTION));
    return snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
}
async function deleteArea(areaId) {
    const areaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], AREAS_COLLECTION, areaId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(areaRef);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/inventory/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InventoryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/inventory.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/areas.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function InventoryPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "c673a79489a4ccde79850eda8d5c85ca18dac5675d2d79f49d71129a9c105888") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c673a79489a4ccde79850eda8d5c85ca18dac5675d2d79f49d71129a9c105888";
    }
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [areaToDelete, setAreaToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [areas, setAreas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [areaDocs, setAreaDocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [newAreaName, setNewAreaName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "InventoryPage[useEffect()]": ()=>{
                const fetchAreas = async function fetchAreas() {
                    setLoading(true);
                    const areaList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAreas"])();
                    setAreaDocs(areaList);
                    setAreas(areaList.map(_InventoryPageUseEffectFetchAreasAreaListMap));
                    setLoading(false);
                };
                fetchAreas();
            }
        })["InventoryPage[useEffect()]"];
        t3 = [];
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[5] !== newAreaName) {
        t4 = ({
            "InventoryPage[handleCreateArea]": async (e)=>{
                e.preventDefault();
                if (newAreaName.trim() === "") {
                    return;
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createArea"])(newAreaName.trim());
                setNewAreaName("");
                setShowCreateModal(false);
                const areaList_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAreas"])();
                setAreaDocs(areaList_0);
                setAreas(areaList_0.map(_InventoryPageHandleCreateAreaAreaList_0Map));
            }
        })["InventoryPage[handleCreateArea]"];
        $[5] = newAreaName;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const handleCreateArea = t4;
    let t5;
    if ($[7] !== areaDocs) {
        t5 = ({
            "InventoryPage[handleDeleteArea]": async (areaName)=>{
                setShowDeleteModal(false);
                setAreaToDelete(null);
                const areaDoc = areaDocs.find({
                    "InventoryPage[handleDeleteArea > areaDocs.find()]": (area_1)=>area_1.name === areaName
                }["InventoryPage[handleDeleteArea > areaDocs.find()]"]);
                if (areaDoc) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteArea"])(areaDoc.id);
                }
                const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInventoryItems"])();
                const itemsToDelete = items.filter({
                    "InventoryPage[handleDeleteArea > items.filter()]": (item)=>item.area === areaName
                }["InventoryPage[handleDeleteArea > items.filter()]"]);
                for (const item_0 of itemsToDelete){
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteInventoryItem"])(item_0.id);
                }
                const areaList_1 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$areas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAreas"])();
                setAreaDocs(areaList_1);
                setAreas(areaList_1.map(_InventoryPageHandleDeleteAreaAreaList_1Map));
            }
        })["InventoryPage[handleDeleteArea]"];
        $[7] = areaDocs;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    const handleDeleteArea = t5;
    let t6;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-2xl font-bold text-black",
            children: "Inventory"
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 114,
            columnNumber: 10
        }, this);
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-6",
            children: [
                t6,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "px-4 py-2 bg-[#8fa481] text-white rounded shadow hover:bg-[#7a926e] transition-colors",
                    onClick: {
                        "InventoryPage[<button>.onClick]": ()=>setShowCreateModal(true)
                    }["InventoryPage[<button>.onClick]"],
                    children: "Create Area"
                }, void 0, false, {
                    fileName: "[project]/src/app/inventory/page.js",
                    lineNumber: 121,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 121,
            columnNumber: 10
        }, this);
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== areas || $[12] !== loading) {
        t8 = loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4",
            children: "Loading areas..."
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 130,
            columnNumber: 20
        }, this) : areas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#F6F0D7] rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base text-gray-400",
                children: "No areas yet."
            }, void 0, false, {
                fileName: "[project]/src/app/inventory/page.js",
                lineNumber: 130,
                columnNumber: 110
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 130,
            columnNumber: 88
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: "space-y-4",
            children: areas.map({
                "InventoryPage[areas.map()]": (area_3, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#F6F0D7] rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer hover:bg-[#e5dab6] transition-colors",
                            onClick: {
                                "InventoryPage[areas.map() > <div>.onClick]": ()=>window.location.href = `/area-item-list?areaName=${encodeURIComponent(area_3)}`
                            }["InventoryPage[areas.map() > <div>.onClick]"],
                            title: `View items in ${area_3}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 font-semibold text-base",
                                    children: area_3
                                }, void 0, false, {
                                    fileName: "[project]/src/app/inventory/page.js",
                                    lineNumber: 133,
                                    columnNumber: 94
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "ml-4 p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition-colors flex items-center justify-center",
                                    onClick: {
                                        "InventoryPage[areas.map() > <button>.onClick]": (e_0)=>{
                                            e_0.stopPropagation();
                                            setAreaToDelete(idx);
                                            setShowDeleteModal(true);
                                        }
                                    }["InventoryPage[areas.map() > <button>.onClick]"],
                                    title: "Delete Area",
                                    "aria-label": "Delete Area",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrash"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/inventory/page.js",
                                        lineNumber: 139,
                                        columnNumber: 110
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/inventory/page.js",
                                    lineNumber: 133,
                                    columnNumber: 158
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/inventory/page.js",
                            lineNumber: 131,
                            columnNumber: 70
                        }, this)
                    }, idx, false, {
                        fileName: "[project]/src/app/inventory/page.js",
                        lineNumber: 131,
                        columnNumber: 56
                    }, this)
            }["InventoryPage[areas.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 130,
            columnNumber: 250
        }, this);
        $[11] = areas;
        $[12] = loading;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== handleCreateArea || $[15] !== newAreaName || $[16] !== showCreateModal) {
        t9 = showCreateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Modal, {
            onClose: {
                "InventoryPage[<Modal>.onClose]": ()=>setShowCreateModal(false)
            }["InventoryPage[<Modal>.onClose]"],
            title: "Create Area",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "flex flex-col gap-4",
                onSubmit: handleCreateArea,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481]",
                        type: "text",
                        placeholder: "Enter area name",
                        value: newAreaName,
                        onChange: {
                            "InventoryPage[<input>.onChange]": (e_1)=>setNewAreaName(e_1.target.value)
                        }["InventoryPage[<input>.onChange]"],
                        autoFocus: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/inventory/page.js",
                        lineNumber: 151,
                        columnNumber: 128
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "px-4 py-2 bg-[#d1d5db] text-black rounded hover:bg-gray-400 transition-colors",
                                onClick: {
                                    "InventoryPage[<button>.onClick]": ()=>setShowCreateModal(false)
                                }["InventoryPage[<button>.onClick]"],
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.js",
                                lineNumber: 153,
                                columnNumber: 106
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "px-4 py-2 bg-[#8fa481] text-white rounded hover:bg-[#7a926e] transition-colors",
                                children: "Create"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.js",
                                lineNumber: 155,
                                columnNumber: 64
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.js",
                        lineNumber: 153,
                        columnNumber: 66
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventory/page.js",
                lineNumber: 151,
                columnNumber: 62
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 149,
            columnNumber: 29
        }, this);
        $[14] = handleCreateArea;
        $[15] = newAreaName;
        $[16] = showCreateModal;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== areaToDelete || $[19] !== areas || $[20] !== handleDeleteArea || $[21] !== showDeleteModal) {
        t10 = showDeleteModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Modal, {
            onClose: {
                "InventoryPage[<Modal>.onClose]": ()=>{
                    setShowDeleteModal(false);
                    setAreaToDelete(null);
                }
            }["InventoryPage[<Modal>.onClose]"],
            title: "Delete Area",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: "Are you sure you want to delete this area?"
                }, void 0, false, {
                    fileName: "[project]/src/app/inventory/page.js",
                    lineNumber: 170,
                    columnNumber: 62
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors",
                            onClick: {
                                "InventoryPage[<button>.onClick]": ()=>{
                                    setShowDeleteModal(false);
                                    setAreaToDelete(null);
                                }
                            }["InventoryPage[<button>.onClick]"],
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/app/inventory/page.js",
                            lineNumber: 170,
                            columnNumber: 172
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "px-4 py-2 bg-[#d9534f] text-white rounded hover:bg-[#c9302c] transition-colors",
                            onClick: {
                                "InventoryPage[<button>.onClick]": ()=>{
                                    if (areaToDelete !== null) {
                                        handleDeleteArea(areas[areaToDelete]);
                                    }
                                    setShowDeleteModal(false);
                                    setAreaToDelete(null);
                                }
                            }["InventoryPage[<button>.onClick]"],
                            children: "Delete"
                        }, void 0, false, {
                            fileName: "[project]/src/app/inventory/page.js",
                            lineNumber: 175,
                            columnNumber: 62
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/inventory/page.js",
                    lineNumber: 170,
                    columnNumber: 132
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 165,
            columnNumber: 30
        }, this);
        $[18] = areaToDelete;
        $[19] = areas;
        $[20] = handleDeleteArea;
        $[21] = showDeleteModal;
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    let t11;
    if ($[23] !== t10 || $[24] !== t8 || $[25] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: [
                t7,
                t8,
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 194,
            columnNumber: 11
        }, this);
        $[23] = t10;
        $[24] = t8;
        $[25] = t9;
        $[26] = t11;
    } else {
        t11 = $[26];
    }
    return t11;
}
_s(InventoryPage, "nSxvvEu8dWKg7TUnRPCUgcmqcGQ=");
_c = InventoryPage;
function _InventoryPageHandleDeleteAreaAreaList_1Map(area_2) {
    return area_2.name;
}
function _InventoryPageHandleCreateAreaAreaList_0Map(area_0) {
    return area_0.name;
}
function _InventoryPageUseEffectFetchAreasAreaListMap(area) {
    return area.name;
}
function Modal(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "c673a79489a4ccde79850eda8d5c85ca18dac5675d2d79f49d71129a9c105888") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c673a79489a4ccde79850eda8d5c85ca18dac5675d2d79f49d71129a9c105888";
    }
    const { onClose, title, children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            background: "rgba(246, 240, 215, 0.7)"
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== onClose) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold",
            onClick: onClose,
            "aria-label": "Close",
            children: "×"
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 237,
            columnNumber: 10
        }, this);
        $[2] = onClose;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== title) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-lg font-bold mb-4",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 245,
            columnNumber: 10
        }, this);
        $[4] = title;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== children || $[7] !== t2 || $[8] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center",
            style: t1,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative",
                children: [
                    t2,
                    t3,
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventory/page.js",
                lineNumber: 253,
                columnNumber: 90
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/inventory/page.js",
            lineNumber: 253,
            columnNumber: 10
        }, this);
        $[6] = children;
        $[7] = t2;
        $[8] = t3;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    return t4;
}
_c1 = Modal;
var _c, _c1;
__turbopack_context__.k.register(_c, "InventoryPage");
__turbopack_context__.k.register(_c1, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/order/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/inventory.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function OrderPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(21);
    if ($[0] !== "761a40893f98c09b7e75f15b8d550fc0b19ba788d9c88597bb5a4faa3b4c61be") {
        for(let $i = 0; $i < 21; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "761a40893f98c09b7e75f15b8d550fc0b19ba788d9c88597bb5a4faa3b4c61be";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    let t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "OrderPage[useEffect()]": ()=>{
                const load = async function load() {
                    setLoading(true);
                    const all = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInventoryItems"])();
                    const mapped = all.map(_OrderPageUseEffectLoadAllMap);
                    setRows(mapped);
                    setLoading(false);
                };
                load();
            }
        })["OrderPage[useEffect()]"];
        t2 = [];
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = function updatePP(id, raw) {
            const pp_0 = cleanInt(raw);
            setRows({
                "OrderPage[updatePP > setRows()]": (prev)=>prev.map({
                        "OrderPage[updatePP > setRows() > prev.map()]": (r)=>r.id === id ? {
                                ...r,
                                pp: pp_0,
                                need: Math.max(pp_0 - r.ac, 0)
                            } : r
                    }["OrderPage[updatePP > setRows() > prev.map()]"])
            }["OrderPage[updatePP > setRows()]"]);
        };
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const updatePP = t3;
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = function updateAC(id_0, raw_0) {
            const ac_0 = cleanInt(raw_0);
            setRows({
                "OrderPage[updateAC > setRows()]": (prev_0)=>prev_0.map({
                        "OrderPage[updateAC > setRows() > prev_0.map()]": (r_0)=>r_0.id === id_0 ? {
                                ...r_0,
                                ac: ac_0,
                                need: Math.max(r_0.pp - ac_0, 0)
                            } : r_0
                    }["OrderPage[updateAC > setRows() > prev_0.map()]"])
            }["OrderPage[updateAC > setRows()]"]);
        };
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const updateAC = t4;
    let t5;
    if ($[6] !== rows) {
        t5 = function exportCsv() {
            const toExport = rows.filter(_OrderPageExportCsvRowsFilter);
            if (toExport.length === 0) {
                alert("Nothing to order...");
                return;
            }
            const headers = [
                "Name",
                "PP",
                "A/C",
                "Need",
                "Unit"
            ];
            const escapeCell = _OrderPageExportCsvEscapeCell;
            const lines = [
                headers.join(","),
                ...toExport.map({
                    "OrderPage[exportCsv > toExport.map()]": (r_2)=>[
                            escapeCell(r_2.name),
                            escapeCell(r_2.pp),
                            escapeCell(r_2.ac),
                            escapeCell(r_2.need),
                            escapeCell(r_2.unit)
                        ].join(",")
                }["OrderPage[exportCsv > toExport.map()]"])
            ];
            const csv = lines.join("\n");
            const blob = new Blob([
                csv
            ], {
                type: "text/csv;charset=utf-8;"
            });
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, "0");
            const d = String(today.getDate()).padStart(2, "0");
            const filename = `ordering_${y}-${m}-${d}.csv`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };
        $[6] = rows;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const exportCsv = t5;
    let t6;
    if ($[8] !== rows) {
        t6 = rows.reduce(_OrderPageRowsReduce, 0);
        $[8] = rows;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    const totalNeed = t6;
    let t7;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-black",
                children: "Ordering"
            }, void 0, false, {
                fileName: "[project]/src/app/order/page.js",
                lineNumber: 132,
                columnNumber: 15
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/order/page.js",
            lineNumber: 132,
            columnNumber: 10
        }, this);
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    const t8 = loading || rows.length === 0;
    let t9;
    if ($[11] !== exportCsv || $[12] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-6",
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: exportCsv,
                    disabled: t8,
                    className: "rounded-lg px-4 py-2 font-semibold bg-[#89986D] text-[#F6F0D7] hover:bg-[#7C8A5F] disabled:opacity-50 disabled:cursor-not-allowed",
                    children: "Export CSV"
                }, void 0, false, {
                    fileName: "[project]/src/app/order/page.js",
                    lineNumber: 140,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/order/page.js",
            lineNumber: 140,
            columnNumber: 10
        }, this);
        $[11] = exportCsv;
        $[12] = t8;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] !== loading || $[15] !== rows || $[16] !== totalNeed) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#F6F0D7] rounded-xl shadow-md p-6",
            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600",
                children: "Loading items…"
            }, void 0, false, {
                fileName: "[project]/src/app/order/page.js",
                lineNumber: 149,
                columnNumber: 77
            }, this) : rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-500",
                children: "No inventory items yet. Create items first."
            }, void 0, false, {
                fileName: "[project]/src/app/order/page.js",
                lineNumber: 149,
                columnNumber: 151
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-left py-2 w-24",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 149,
                                            columnNumber: 302
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-left py-2",
                                            children: "Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 149,
                                            columnNumber: 349
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right py-2 w-24",
                                            children: "Purchase Par"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 149,
                                            columnNumber: 389
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right py-2 w-32",
                                            children: "Actual/Count"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 149,
                                            columnNumber: 443
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right py-2 w-32",
                                            children: "Need to Order"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 149,
                                            columnNumber: 497
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.js",
                                    lineNumber: 149,
                                    columnNumber: 277
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/order/page.js",
                                lineNumber: 149,
                                columnNumber: 270
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: rows.map({
                                    "OrderPage[rows.map()]": (r_4)=>{
                                        const needsOrder = r_4.need > 0;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-block w-3 h-3 rounded-full ${needsOrder ? "bg-yellow-400" : "bg-green-500"}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.js",
                                                        lineNumber: 152,
                                                        columnNumber: 83
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.js",
                                                    lineNumber: 152,
                                                    columnNumber: 62
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-2 font-medium",
                                                    children: r_4.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.js",
                                                    lineNumber: 152,
                                                    columnNumber: 193
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-2 text-right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        inputMode: "numeric",
                                                        pattern: "[0-9]*",
                                                        value: String(r_4.pp),
                                                        onChange: {
                                                            "OrderPage[rows.map() > <input>.onChange]": (e)=>updatePP(r_4.id, e.target.value)
                                                        }["OrderPage[rows.map() > <input>.onChange]"],
                                                        className: "w-20 text-right rounded border px-2 py-1 bg-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.js",
                                                        lineNumber: 152,
                                                        columnNumber: 273
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.js",
                                                    lineNumber: 152,
                                                    columnNumber: 241
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-2 text-right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        inputMode: "numeric",
                                                        pattern: "[0-9]*",
                                                        value: String(r_4.ac),
                                                        onChange: {
                                                            "OrderPage[rows.map() > <input>.onChange]": (e_0)=>updateAC(r_4.id, e_0.target.value)
                                                        }["OrderPage[rows.map() > <input>.onChange]"],
                                                        className: "w-20 text-right rounded border px-2 py-1 bg-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.js",
                                                        lineNumber: 154,
                                                        columnNumber: 169
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.js",
                                                    lineNumber: 154,
                                                    columnNumber: 137
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-2 text-right font-semibold",
                                                    children: r_4.need
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.js",
                                                    lineNumber: 156,
                                                    columnNumber: 137
                                                }, this)
                                            ]
                                        }, r_4.id, true, {
                                            fileName: "[project]/src/app/order/page.js",
                                            lineNumber: 152,
                                            columnNumber: 24
                                        }, this);
                                    }
                                }["OrderPage[rows.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/src/app/order/page.js",
                                lineNumber: 149,
                                columnNumber: 565
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/order/page.js",
                        lineNumber: 149,
                        columnNumber: 236
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-right font-semibold",
                        children: [
                            "Total Need: ",
                            totalNeed
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/order/page.js",
                        lineNumber: 158,
                        columnNumber: 57
                    }, this)
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/src/app/order/page.js",
            lineNumber: 149,
            columnNumber: 11
        }, this);
        $[14] = loading;
        $[15] = rows;
        $[16] = totalNeed;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] !== t10 || $[19] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: [
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/order/page.js",
            lineNumber: 168,
            columnNumber: 11
        }, this);
        $[18] = t10;
        $[19] = t9;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    return t11;
}
_s(OrderPage, "9yErGN0oHccGMfVCTjvdxWJ9Ers=");
_c = OrderPage;
// Converts inputs or raw datas into safe integers for clean calculations and prevents NaN errors
function _OrderPageRowsReduce(sum, r_3) {
    return sum + r_3.need;
}
function _OrderPageExportCsvEscapeCell(value) {
    const s = String(value ?? "");
    if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, "\"\"")}"`;
    }
    return s;
}
function _OrderPageExportCsvRowsFilter(r_1) {
    return r_1.need > 0;
}
function _OrderPageUseEffectLoadAllMap(item) {
    const name = String(item.item_name ?? "");
    const pp = cleanInt(item.container_quantity);
    const ac = cleanInt(item.unit_quantity);
    const need = Math.max(pp - ac, 0);
    return {
        id: item.id,
        name,
        pp,
        ac,
        need,
        unit: item.unit_of_measure || ""
    };
}
function cleanInt(raw) {
    const s = String(raw ?? "").replace(/[^\d]/g, "");
    if (s === "") return 0;
    return Number(s.replace(/^0+(?=\d)/, ""));
}
var _c;
__turbopack_context__.k.register(_c, "OrderPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventory$2f$page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/inventory/page.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$order$2f$page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/order/page.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Home() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(31);
    if ($[0] !== "20d1b3bad6d5a3482013614133bfed4e2166684a11077c47ec42e6a6125c3731") {
        for(let $i = 0; $i < 31; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "20d1b3bad6d5a3482013614133bfed4e2166684a11077c47ec42e6a6125c3731";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("inventory");
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "Home[useEffect()]": ()=>{
                if ("TURBOPACK compile-time truthy", 1) {
                    const params = new URLSearchParams(window.location.search);
                    const tab = params.get("tab");
                    if (tab && [
                        "inventory",
                        "ordering",
                        "prep",
                        "settings"
                    ].includes(tab)) {
                        setActiveTab(tab);
                    }
                }
            }
        })["Home[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [
            {
                id: "inventory",
                label: "Inventory"
            },
            {
                id: "ordering",
                label: "Ordering"
            },
            {
                id: "prep",
                label: "Prep Lists"
            },
            {
                id: "settings",
                label: "Settings"
            }
        ];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const tabs = t2;
    let t3;
    if ($[4] !== router) {
        t3 = ({
            "Home[handleLogout]": ()=>{
                localStorage.removeItem("user");
                router.replace("/login");
            }
        })["Home[handleLogout]"];
        $[4] = router;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const handleLogout = t3;
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-center text-xl font-semibold py-5 border-b border-[#9CAB84]",
            children: "ByteSize"
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 76,
            columnNumber: 10
        }, this);
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== activeTab) {
        t5 = tabs.map({
            "Home[tabs.map()]": (tab_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "Home[tabs.map() > <button>.onClick]": ()=>setActiveTab(tab_0.id)
                    }["Home[tabs.map() > <button>.onClick]"],
                    className: `text-left px-5 py-4 transition-colors 
              ${activeTab === tab_0.id ? "bg-[#9CAB84]" : "hover:bg-[#9CAB84]/70"}`,
                    children: tab_0.label
                }, tab_0.id, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 84,
                    columnNumber: 36
                }, this)
        }["Home[tabs.map()]"]);
        $[7] = activeTab;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1"
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 96,
            columnNumber: 10
        }, this);
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== handleLogout) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleLogout,
            className: "px-5 py-4 text-left bg-[#7C8A5F] hover:bg-[#6E7B54] transition-colors",
            children: "Log out"
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 103,
            columnNumber: 10
        }, this);
        $[10] = handleLogout;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== t5 || $[13] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "w-60 bg-[#89986D] text-[#F6F0D7] flex flex-col",
            children: [
                t4,
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 111,
            columnNumber: 10
        }, this);
        $[12] = t5;
        $[13] = t7;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== activeTab) {
        t9 = activeTab === "inventory" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventory$2f$page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 120,
            columnNumber: 39
        }, this);
        $[15] = activeTab;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== activeTab) {
        t10 = activeTab === "ordering" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$order$2f$page$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 128,
            columnNumber: 39
        }, this);
        $[17] = activeTab;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== activeTab) {
        t11 = activeTab === "prep" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold mb-6 text-black",
                    children: "Prep Lists"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 136,
                    columnNumber: 44
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#F6F0D7] rounded-xl shadow-md p-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 136,
                    columnNumber: 110
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 136,
            columnNumber: 35
        }, this);
        $[19] = activeTab;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== activeTab) {
        t12 = activeTab === "settings" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold mb-6 text-black",
                    children: "Settings"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 144,
                    columnNumber: 48
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#F6F0D7] rounded-xl shadow-md p-6"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 144,
                    columnNumber: 112
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 144,
            columnNumber: 39
        }, this);
        $[21] = activeTab;
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== t10 || $[24] !== t11 || $[25] !== t12 || $[26] !== t9) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1 p-8 overflow-y-auto",
            children: [
                t9,
                t10,
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 152,
            columnNumber: 11
        }, this);
        $[23] = t10;
        $[24] = t11;
        $[25] = t12;
        $[26] = t9;
        $[27] = t13;
    } else {
        t13 = $[27];
    }
    let t14;
    if ($[28] !== t13 || $[29] !== t8) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen bg-[#F6F0D7] font-sans",
            children: [
                t8,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 163,
            columnNumber: 11
        }, this);
        $[28] = t13;
        $[29] = t8;
        $[30] = t14;
    } else {
        t14 = $[30];
    }
    return t14;
}
_s(Home, "sXPF8QS5T04Ti+y8Vij8HvOJmFY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_4e95d040._.js.map