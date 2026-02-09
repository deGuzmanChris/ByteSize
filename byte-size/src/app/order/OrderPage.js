"use client";

import { useState } from "react";
import OrderFormView from "./OrderFormView";
import AreasView from "./AreasView";

export default function OrderPage() {
  const [view, setView] = useState("orderForm");

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("orderForm")}
          className={`px-3 py-2 rounded text-sm border ${
            view === "orderForm"
              ? "bg-[#6f7f4a] text-white"
              : "bg-white"
          }`}
        >
          Order Form
        </button>

        <button
          onClick={() => setView("areas")}
          className={`px-3 py-2 rounded text-sm border ${
            view === "areas"
              ? "bg-[#6f7f4a] text-white"
              : "bg-white"
          }`}
        >
          Areas
        </button>
      </div>

      {view === "orderForm" ? <OrderFormView /> : <AreasView />}
    </div>
  );
}
