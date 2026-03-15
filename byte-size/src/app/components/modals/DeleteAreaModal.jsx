import Modal from "../Modal";
import { getColorTokens } from "../colorTokens";
import { useDarkMode } from "../../../lib/DarkModeContext";

export default function DeleteAreaModal({ onClose, onDelete, text }) {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);
  return (
    <Modal onClose={onClose} title="Delete Area" darkMode={darkMode}>
      <div className={`mb-4 ${tokens.text}`}>{text || "Are you sure you want to delete this area?"}</div>
      <div className="flex justify-end gap-2">
        <button type="button" className={tokens.cancelBtn} onClick={onClose}>Cancel</button>
        <button
          type="button"
          className="px-4 py-2 bg-[#d9534f] text-white rounded hover:bg-[#c9302c] transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
