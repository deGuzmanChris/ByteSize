export default function Modal({ onClose, title, children, darkMode }) {
  const backdropColor = darkMode ? "rgba(0,0,0,0.7)" : "rgba(246, 240, 215, 0.7)";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";
  const titleText = darkMode ? "text-[#f0f0f0]" : "text-black";
  const closeBtn = darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: backdropColor }}>
      <div className={`${cardBg} rounded-lg shadow-lg p-6 min-w-[320px] relative transition-colors duration-200`}>
        <button className={`absolute top-2 right-2 ${closeBtn} text-xl font-bold`} onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 className={`text-lg font-bold mb-4 ${titleText}`}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
