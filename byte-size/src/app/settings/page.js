"use client";

import { useState, useEffect } from "react";
import { createUser, getUsers, updateUserDoc, deleteUserDoc } from "../../lib/users";
import { useDarkMode } from "../../lib/DarkModeContext";

export default function SettingsPage() {
  const { darkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(false);

  // Dark mode color tokens
  const text = darkMode ? "text-[#f0f0f0]" : "text-black";
  const sectionBg = darkMode ? "bg-[#2d2d2d]" : "bg-[#F6F0D7]";
  const inputCls = darkMode
    ? "flex-1 px-3 py-2 border rounded bg-[#3a3a3a] text-[#f0f0f0] border-[#555]"
    : "flex-1 px-3 py-2 border rounded";
  const selectCls = darkMode
    ? "px-3 py-2 border rounded bg-[#3a3a3a] text-[#f0f0f0] border-[#555]"
    : "px-3 py-2 border rounded";
  const cancelBtnCls = darkMode
    ? "px-3 py-2 border border-[#555] rounded text-sm text-[#f0f0f0]"
    : "px-3 py-2 border rounded text-sm";
  const userCardCls = darkMode
    ? "flex items-center justify-between border border-[#444] rounded p-3 bg-[#3a3a3a]"
    : "flex items-center justify-between border rounded p-3";
  const roleBadgeCls = darkMode
    ? "text-xs px-2 py-0.5 rounded-full bg-[#4a5c38] text-[#c5d4b0] capitalize"
    : "text-xs px-2 py-0.5 rounded-full bg-[#F6F0D7] text-[#5a6640] capitalize";
  const editBtnCls = darkMode
    ? "px-3 py-1 text-sm bg-[#4a5c38] text-[#c5d4b0] rounded hover:bg-[#3a4a2c] disabled:opacity-50"
    : "px-3 py-1 text-sm bg-white text-[#5a6640] rounded hover:bg-[#e8e2c5] disabled:opacity-50";

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      showNotice("Failed to load users: " + err.message, "error");
    }
  }

  function showNotice(text, type = "success") {
    setNotice({ text, type });
    setTimeout(() => setNotice({ text: "", type: "success" }), 5000);
  }

  function resetForm() {
    setForm({ name: "", email: "", role: "staff" });
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showNotice("Name and email are required.", "error");
      return;
    }
    setLoading(true);
    try {
      await createUser({ name: form.name.trim(), email: form.email.trim(), role: form.role });
      showNotice(`User created. A password-setup email has been sent to ${form.email}.`);
      resetForm();
      await fetchUsers();
    } catch (err) {
      showNotice("Error creating user: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEditInit(user) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
    setNotice({ text: "", type: "success" });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      showNotice("Name is required.", "error");
      return;
    }
    setLoading(true);
    try {
      await updateUserDoc(editingId, { name: form.name.trim(), role: form.role });
      showNotice("User updated.");
      resetForm();
      await fetchUsers();
    } catch (err) {
      showNotice("Error updating user: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Auth deletion failed");
      }
      await deleteUserDoc(user.id);
      showNotice(`${user.name} has been deleted.`);
      if (editingId === user.id) resetForm();
      await fetchUsers();
    } catch (err) {
      showNotice("Error deleting user: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${text} transition-colors duration-200`}>
      <div className={`${sectionBg} rounded-xl shadow p-6 mb-6 transition-colors duration-200`}>
        <h2 className="text-lg font-semibold mb-1">
          {editingId ? "Edit User" : "Create New User"}
        </h2>
        {!editingId && (
          <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            A password-setup email will be sent to the new user automatically.
          </p>
        )}

        <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls}
              disabled={loading}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className={inputCls}
              disabled={loading || !!editingId}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={selectCls}
              disabled={loading}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#89986D] text-white px-4 py-2 rounded hover:bg-[#7a8960] disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Save changes" : "Create user"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} disabled={loading} className={cancelBtnCls}>
                Cancel
              </button>
            )}
          </div>

          {notice.text && (
            <div
              className={`text-sm px-3 py-2 rounded ${
                notice.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {notice.text}
            </div>
          )}
        </form>
      </div>

      <div className={`${sectionBg} rounded-xl shadow p-6 transition-colors duration-200`}>
        <h2 className="text-lg font-semibold mb-4">Users</h2>

        {users.length === 0 ? (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className={userCardCls}>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={roleBadgeCls}>{user.role}</span>
                    {user.mustChangePassword && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Awaiting password setup
                      </span>
                    )}
                    {user.authProvider === "google" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        Google
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditInit(user)} disabled={loading} className={editBtnCls}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
