"use client";

import { useEffect, useState } from "react";

export default function PrepListPage({ user }) {
  const [loading, setLoading] = useState(true);

  // Minimal "gate" behavior:
  useEffect(() => {
    // If your app loads user async, allow a short loading state
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-gray-700">Loading…</div>;
  }

  // If no user, show a friendly message (or redirect later)
  if (!user) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Prep Lists</h1>
        <div className="bg-white rounded-xl shadow-md p-6 text-gray-700">
          You must be logged in to view Prep Lists.
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prep Lists</h1>

        {/* Placeholder - wire this to modal later */}
        <button
          className="px-4 py-2 bg-[#89986D] text-white rounded shadow hover:bg-[#7a926e] transition"
          onClick={() => alert("Placeholder for create prep list for now")}
        >
          Create Prep List
        </button>
      </div>

      <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">

        <div className="bg-white rounded-lg border p-4 text-gray-700">
          No prep lists yet.
        </div>
      </div>
    </section>
  );
}