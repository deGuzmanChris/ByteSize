// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { db, auth } from "../../_firebase/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { signOut } from "firebase/auth";

// export default function Dashboard() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("inventory");
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   const tabs = [
//     { id: "inventory", label: "Inventory" },
//     { id: "ordering", label: "Ordering" },
//     { id: "prep", label: "Prep Lists" },
//     { id: "settings", label: "Settings" },
//   ];

//   // Check authentication
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       if (!currentUser) {
//         router.push("/login");
//       } else {
//         setUser(currentUser);
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   // Fetch inventory data from Firestore
//   useEffect(() => {
//     async function fetchInventory() {
//       if (!user) return; // Don't fetch if not logged in
      
//       try {
//         setLoading(true);
//         const querySnapshot = await getDocs(collection(db, "inventory"));
//         const items = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setInventory(items);
//       } catch (error) {
//         console.error("Error fetching inventory:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     if (activeTab === "inventory" && user) {
//       fetchInventory();
//     }
//   }, [activeTab, user]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   // Don't render dashboard if not logged in
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-[#F6F0D7] font-sans">
//       {/* Sidebar */}
//       <aside className="w-60 bg-[#89986D] text-[#F6F0D7] flex flex-col">
//         <h2 className="text-center text-xl font-semibold py-5 border-b border-[#9CAB84]">
//           ByteSize
//         </h2>
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`text-left px-5 py-4 transition-colors 
//               ${activeTab === tab.id ? "bg-[#9CAB84]" : "hover:bg-[#9CAB84]/70"}`}
//           >
//             {tab.label}
//           </button>
//         ))}
        
//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="mt-auto px-5 py-4 hover:bg-[#9CAB84]/70 transition-colors text-left border-t border-[#9CAB84]"
//         >
//           Logout
//         </button>
//       </aside>

//       <main className="flex-1 p-8 overflow-y-auto">
//         {activeTab === "inventory" && (
//           <section>
//             <h1 className="text-2xl font-bold mb-6 text-black">Inventory</h1>
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Area</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="4" className="text-center py-4 text-gray-500">
//                         Loading inventory...
//                       </td>
//                     </tr>
//                   ) : inventory.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="text-center py-4 text-gray-500">
//                         No inventory items found
//                       </td>
//                     </tr>
//                   ) : (
//                     inventory.map((item) => (
//                       <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 text-gray-700">
//                         <td className="py-3 px-4">{item.item_name}</td>
//                         <td className="py-3 px-4 capitalize">{item.category?.replace(/_/g, ' ')}</td>
//                         <td className="py-3 px-4 capitalize">{item.area}</td>
//                         <td className="py-3 px-4">
//                           {item.unit_quantity} {item.unit_of_measure} ({item.container_quantity} {item.container_unit})
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}

//         {/* Other tabs remain the same */}
//       </main>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../_firebase/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", name: "", role: "staff" });

  // Check authentication and get user role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        
        // Get user role from Firestore using email as document ID
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.email));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error getting user role:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Dynamically set tabs based on user role
  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    ...(userRole === "manager" ? [{ id: "users", label: "Users" }] : []),
    { id: "settings", label: "Settings" },
  ];

  // Fetch inventory
  useEffect(() => {
    async function fetchInventory() {
      if (!user) return;
      
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

  // Fetch users (managers only)
  useEffect(() => {
    async function fetchUsers() {
      if (!user || userRole !== "manager") return;
      
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (activeTab === "users" && userRole === "manager") {
      fetchUsers();
    }
  }, [activeTab, user, userRole]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // User CRUD operations
  const openAddUserModal = () => {
    setEditingUser(null);
    setFormData({ email: "", name: "", role: "staff" });
    setShowUserModal(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name, role: user.role });
    setShowUserModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user
        await updateDoc(doc(db, "users", editingUser.id), {
          name: formData.name,
          role: formData.role,
        });
        alert("User updated successfully!");
      } else {
        // Add new user - use email as document ID
        await setDoc(doc(db, "users", formData.email), {
          id: formData.email,
          email: formData.email,
          name: formData.name,
          role: formData.role,
        });
        alert("User added successfully! They can now sign in with their Google account.");
      }
      
      setShowUserModal(false);
      // Refresh users list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User deleted successfully!");
      
      // Refresh users list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Don't render if not logged in
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
        
        <div className="mt-auto border-t border-[#9CAB84]">
          <div className="px-5 py-3 text-sm">
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-xs opacity-75 capitalize">{userRole || "Loading..."}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-5 py-4 hover:bg-[#9CAB84]/70 transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Inventory Tab */}
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
                      <td colSpan="4" className="text-center py-4 text-gray-500">Loading inventory...</td>
                    </tr>
                  ) : inventory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No inventory items found</td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
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

        {/* Users Tab (Managers Only) */}
        {activeTab === "users" && userRole === "manager" && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-black">User Management</h1>
              <button 
                onClick={openAddUserModal}
                className="bg-[#89986D] text-white px-4 py-2 rounded-lg hover:bg-[#9CAB84] transition-colors"
              >
                + Add User
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">Loading users...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            u.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => openEditUserModal(u)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Other tabs */}
        {activeTab === "ordering" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Ordering</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </section>
        )}

        {activeTab === "prep" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Prep Lists</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Settings</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </section>
        )}
      </main>

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmitUser}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89986D]"
                  placeholder="user@example.com"
                />
                {!editingUser && (
                  <p className="text-xs text-gray-500 mt-1">User must sign in with this Google account</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89986D]"
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89986D]"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#89986D] text-white rounded-lg hover:bg-[#9CAB84] transition-colors"
                >
                  {editingUser ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}