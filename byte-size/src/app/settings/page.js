"use client";

import { useState, useEffect, useRef } from "react";
import { createUser, getUsers, updateUserDoc, deleteUserDoc } from "../../lib/users";
import { auth } from "../../lib/firebase";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import Modal from "../components/Modal";

const ASSIGNABLE_ROLES = {
  admin: ["staff", "admin"],
};

export default function SettingsPage({ currentRole }) {
  const { darkMode } = useDarkMode();
  const userFormSectionRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });

  const isAdmin = currentRole === "admin";
  const assignableRoles = ASSIGNABLE_ROLES[currentRole] ?? [];
  const canManage = (targetRole) => assignableRoles.includes(targetRole);
  const getRoleBadgeCls = (role) => {
    const roleKey = String(role || "").toLowerCase();

    if (roleKey === "admin") {
      return darkMode
        ? "text-xs px-2 py-0.5 rounded-full bg-[#1e3a5f] text-[#93c5fd] capitalize"
        : "text-xs px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8] capitalize";
    }

    if (roleKey === "staff") {
      return darkMode
        ? "text-xs px-2 py-0.5 rounded-full bg-[#1f4d2e] text-[#86efac] capitalize"
        : "text-xs px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] capitalize";
    }

    return darkMode
      ? "text-xs px-2 py-0.5 rounded-full bg-[#3a3a3a] text-[#d1d5db] capitalize"
      : "text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize";
  };
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

    requestAnimationFrame(() => {
      userFormSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

  async function handleDelete() {
    if (!userToDelete) return;
    setLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/admin/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: userToDelete.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Auth deletion failed");
      }
      await deleteUserDoc(userToDelete.id);
      showNotice(`${userToDelete.name} has been deleted.`);
      if (editingId === userToDelete.id) resetForm();
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      showNotice("Error deleting user: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${tokens.text} transition-colors duration-200`}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {isAdmin && (
        <div
          ref={userFormSectionRef}
          className={`${tokens.sectionBg} rounded-xl shadow p-6 mb-6 transition-colors duration-200`}
          style={{ scrollMarginTop: "5.5rem" }}
        >
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
      )}

      <div className={`${tokens.sectionBg} rounded-xl shadow p-6 transition-colors duration-200`}>
        <h2 className="text-lg font-semibold mb-4">Users</h2>

        {users.length === 0 ? (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`${tokens.userCardCls} flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between`}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} truncate`}>{user.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={getRoleBadgeCls(user.role)}>{user.role}</span>
                    {user.mustChangePassword && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Must set password
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-1 flex w-full gap-2 self-start border-t border-black/10 pt-2 dark:border-white/10 sm:mt-0 sm:w-auto sm:self-auto sm:border-0 sm:pt-0">
                    {canManage(user.role) && (
                      <button
                        onClick={() => handleEditInit(user)}
                        disabled={loading}
                        className={`${editBtnCls} min-h-7 px-1.5 py-0 text-xs sm:min-h-0`}
                      >
                        Edit
                      </button>
                    )}
                    {canManage(user.role) && (
                      <button
                        onClick={() => setUserToDelete(user)}
                        disabled={loading}
                        className="min-h-7 px-1.5 py-0 text-xs bg-[#d9534f] text-white rounded hover:bg-[#c9302c] disabled:opacity-50 sm:min-h-0"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {userToDelete && (
        <Modal
          darkMode={darkMode}
          title="Delete User"
          onClose={() => !loading && setUserToDelete(null)}
        >
          <p className={`mb-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Are you sure want to delete this user?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setUserToDelete(null)}
              disabled={loading}
              className={tokens.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#d9534f] text-white hover:bg-[#c9302c] disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
