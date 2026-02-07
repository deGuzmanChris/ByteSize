"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../_firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    { id: "settings", label: "Settings" },
  ];

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch inventory data from Firestore
  useEffect(() => {
    async function fetchInventory() {
      if (!user) return; // Don't fetch if not logged in
      
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (activeTab === "inventory" && user) {
      fetchInventory();
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Don't render dashboard if not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F6F0D7] font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-[#89986D] text-[#F6F0D7] flex flex-col">
        <h2 className="text-center text-xl font-semibold py-5 border-b border-[#9CAB84]">
          ByteSize
        </h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-5 py-4 transition-colors 
              ${activeTab === tab.id ? "bg-[#9CAB84]" : "hover:bg-[#9CAB84]/70"}`}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto px-5 py-4 hover:bg-[#9CAB84]/70 transition-colors text-left border-t border-[#9CAB84]"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Inventory</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Area</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : inventory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No inventory items found
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 text-gray-700">
                        <td className="py-3 px-4">{item.item_name}</td>
                        <td className="py-3 px-4 capitalize">{item.category?.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4 capitalize">{item.area}</td>
                        <td className="py-3 px-4">
                          {item.unit_quantity} {item.unit_of_measure} ({item.container_quantity} {item.container_unit})
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Other tabs remain the same */}
      </main>
    </div>
  );
}