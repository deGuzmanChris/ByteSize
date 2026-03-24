"use client";

import { useState, useEffect } from "react";
import { createUser, getUsers, updateUserDoc, deleteUserDoc } from "../../lib/users";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";

const ASSIGNABLE_ROLES = {
  admin: ["staff", "manager", "admin"],
  manager: ["staff"],
};

export default function SettingsPage({ currentRole }) {
  const { darkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });

  const assignableRoles = ASSIGNABLE_ROLES[currentRole] ?? [];
  const canManage = (targetRole) => assignableRoles.includes(targetRole);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(false);

  // Use shared color tokens
  const tokens = getColorTokens(darkMode);
  const editBtnCls = tokens.editBtnCls;

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
    <div className={`${tokens.text} transition-colors duration-200`}>
      <div className={`${tokens.sectionBg} rounded-xl shadow p-6 mb-6 transition-colors duration-200`}>
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
              className={tokens.inputCls}
              disabled={loading}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className={tokens.inputCls}
              disabled={loading || !!editingId}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={tokens.selectCls}
              disabled={loading}
            >
              {assignableRoles.map((r) => (
                <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
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
              <button type="button" onClick={resetForm} disabled={loading} className={tokens.cancelBtn}>
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

      <div className={`${tokens.sectionBg} rounded-xl shadow p-6 transition-colors duration-200`}>
        <h2 className="text-lg font-semibold mb-4">Users</h2>

        {users.length === 0 ? (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className={tokens.userCardCls}>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={tokens.roleBadgeCls}>{user.role}</span>
                    {user.mustChangePassword && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Must set password
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {canManage(user.role) && (
                    <button onClick={() => handleEditInit(user)} disabled={loading} className={editBtnCls}>
                      Edit
                    </button>
                  )}
                  {canManage(user.role) && (
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
