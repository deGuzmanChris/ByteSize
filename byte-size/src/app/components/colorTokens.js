// Returns color tokens for dark and light mode
export function getColorTokens(darkMode) {
  return {
    text: darkMode ? "text-[#f0f0f0]" : "text-black",
    cardBg: darkMode ? "bg-[#2d2d2d]" : "bg-white", // main card background
    secondaryBg: darkMode ? "bg-[#232323]" : "bg-[#F6F0D7]", // secondary elements
    cardHover: darkMode ? "hover:bg-[#383838]" : "hover:bg-[#e5dab6]",
    inputCls: darkMode
      ? "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#888] bg-[#383838] text-[#f0f0f0] border-[#444]"
      : "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481]",
    cancelBtn: darkMode
      ? "px-4 py-2 bg-[#444] text-[#f0f0f0] rounded hover:bg-[#555] transition-colors"
      : "px-4 py-2 bg-[#d1d5db] text-black rounded hover:bg-gray-400 transition-colors",
    sectionBg: darkMode ? "bg-[#232323]" : "bg-[#F6F0D7]",
    selectCls: darkMode
      ? "px-3 py-2 border rounded bg-[#2d2d2d] text-[#f0f0f0] border-[#444]"
      : "px-3 py-2 border rounded",
    userCardCls: darkMode
      ? "flex items-center justify-between border border-[#444] rounded p-3 bg-[#2d2d2d]"
      : "flex items-center justify-between border rounded p-3",
    roleBadgeCls: darkMode
      ? "text-xs px-2 py-0.5 rounded-full bg-[#383838] text-[#b0b0b0] capitalize"
      : "text-xs px-2 py-0.5 rounded-full bg-[#F6F0D7] text-[#5a6640] capitalize",
    editBtnCls: darkMode
      ? "px-3 py-1 text-sm bg-[#383838] text-[#b0b0b0] rounded hover:bg-[#232323] disabled:opacity-50"
      : "px-3 py-1 text-sm bg-white text-[#5a6640] rounded hover:bg-[#e8e2c5] disabled:opacity-50",
    sidebarBg: darkMode ? "bg-[#4a5c38]" : "bg-[#89986D]",
    sidebarActiveBg: darkMode ? "bg-[#3a4a2c]" : "bg-[#9CAB84]",
    sidebarHover: darkMode ? "hover:bg-[#3a4a2c]/70" : "hover:bg-[#9CAB84]/70",
    sidebarBorder: darkMode ? "border-[#3a4a2c]" : "border-[#9CAB84]",
    logoutBg: darkMode ? "bg-[#3a4a2c] hover:bg-[#2e3b22]" : "bg-[#7C8A5F] hover:bg-[#6E7B54]",
    bg: darkMode ? "bg-[#1e1e1e]" : "bg-[#F6F0D7]",
  };
}
