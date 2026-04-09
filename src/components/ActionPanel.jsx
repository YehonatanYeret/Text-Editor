import Key from "./Key.jsx";
import "./ActionPanel.css";

/**
 * Defines the editing actions shown on the left side of the control area.
 */
function getActionButtons() {
  return [
    { id: "delete-char", label: "Delete Char" },
    { id: "delete-word", label: "Delete Word" },
    { id: "clear-all", label: "Clear All" },
  ];
}

/**
 * Routes action button clicks to the matching text editing behavior.
 */
function handleActionPress(actionId, callbacks) {
  if (actionId === "delete-char") {
    callbacks.onDeleteChar();
    return;
  }

  if (actionId === "delete-word") {
    callbacks.onDeleteWord();
    return;
  }

  callbacks.onClearAll();
}

/**
 * Renders the left control column for delete and clear actions.
 */
function ActionPanel({ onDeleteChar, onDeleteWord, onClearAll }) {
  const actions = getActionButtons();

  return (
    <div className="action-panel">
      <p className="action-panel__label">Edit Actions</p>
      <div className="action-panel__buttons">
        {actions.map((action) => (
          <Key
            key={action.id}
            label={action.label}
            variant="action"
            onPress={() =>
              handleActionPress(action.id, { onDeleteChar, onDeleteWord, onClearAll })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ActionPanel;
