import Modal from "../Modal";
import { getColorTokens } from "../colorTokens";
import { useDarkMode } from "../../../lib/DarkModeContext";

export default function CreateAreaModal({ onClose, onSubmit, value, onChange, creating, error }) {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);
  return (
    <Modal onClose={onClose} title="Create Area" darkMode={darkMode}>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          className={tokens.inputCls}
          type="text"
          placeholder="Enter area name"
          value={value}
          onChange={onChange}
          maxLength={20}
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}
        <div className="text-xs text-gray-500 mt-1 text-left">Max 20 characters</div>
        <div className="flex justify-end gap-2">
          <button type="button" className={tokens.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8fa481] text-black rounded hover:bg-[#7a926e] transition-colors"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
