import Modal from "../Modal.jsx";
import { getColorTokens } from "../colorTokens.js";

export default function DeleteConfirmModal({ item, onCancel, onConfirm, darkMode }) {
  return (
    <Modal onClose={onCancel} title="Delete Item?" darkMode={darkMode}>
      <div className="mb-4 ">Are you sure you want to delete this item?</div>
      <div className="flex justify-end gap-4">
        <button
          className={getColorTokens(darkMode).cancelBtn}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-[#e57373] text-white hover:bg-[#c62828]"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
