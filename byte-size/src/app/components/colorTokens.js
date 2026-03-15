// Returns color tokens for dark and light mode
export function getColorTokens(darkMode) {
  return {
    text: darkMode ? "text-[#f0f0f0]" : "text-black",
    cardBg: darkMode ? "bg-[#3a3a3a]" : "bg-[#F6F0D7]",
    cardHover: darkMode ? "hover:bg-[#4a4a4a]" : "hover:bg-[#e5dab6]",
    inputCls: darkMode
      ? "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481] bg-[#4a4a4a] text-[#f0f0f0] border-[#555]"
      : "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481]",
    cancelBtn: darkMode
      ? "px-4 py-2 bg-[#555] text-[#f0f0f0] rounded hover:bg-[#666] transition-colors"
      : "px-4 py-2 bg-[#d1d5db] text-black rounded hover:bg-gray-400 transition-colors",
    sectionBg: darkMode ? "bg-[#2d2d2d]" : "bg-[#F6F0D7]",
    selectCls: darkMode
      ? "px-3 py-2 border rounded bg-[#3a3a3a] text-[#f0f0f0] border-[#555]"
      : "px-3 py-2 border rounded",
    userCardCls: darkMode
      ? "flex items-center justify-between border border-[#444] rounded p-3 bg-[#3a3a3a]"
      : "flex items-center justify-between border rounded p-3",
    roleBadgeCls: darkMode
      ? "text-xs px-2 py-0.5 rounded-full bg-[#4a5c38] text-[#c5d4b0] capitalize"
      : "text-xs px-2 py-0.5 rounded-full bg-[#F6F0D7] text-[#5a6640] capitalize",
    editBtnCls: darkMode
      ? "px-3 py-1 text-sm bg-[#4a5c38] text-[#c5d4b0] rounded hover:bg-[#3a4a2c] disabled:opacity-50"
      : "px-3 py-1 text-sm bg-white text-[#5a6640] rounded hover:bg-[#e8e2c5] disabled:opacity-50",
    sidebarBg: darkMode ? "bg-[#4a5c38]" : "bg-[#89986D]",
    sidebarActiveBg: darkMode ? "bg-[#3a4a2c]" : "bg-[#9CAB84]",
    sidebarHover: darkMode ? "hover:bg-[#3a4a2c]/70" : "hover:bg-[#9CAB84]/70",
    sidebarBorder: darkMode ? "border-[#3a4a2c]" : "border-[#9CAB84]",
    logoutBg: darkMode ? "bg-[#3a4a2c] hover:bg-[#2e3b22]" : "bg-[#7C8A5F] hover:bg-[#6E7B54]",
    bg: darkMode ? "bg-[#1e1e1e]" : "bg-[#F6F0D7]",
  };
}
