import Key from "./Key.jsx";
import "./ActionPanel.css";

/**
 * File shortcuts live here so they sit beside edit actions, away from typography settings.
 */
function getFileButtons() {
  return [
    { id: "new-doc", label: "New" },
    { id: "save-file", label: "Save" },
    { id: "open-file", label: "Open" },
  ];
}

/**
 * Text-editing keys; delete-word is optional if the parent does not implement word removal.
 */
function getEditButtons() {
  return [
    { id: "delete-char", label: "Delete Char" },
    { id: "delete-word", label: "Delete Word" },
    { id: "clear-all", label: "Clear All" },
  ];
}

/**
 * Dispatches a panel action to the callback bundle supplied by App.
 */
function handleActionPress(actionId, callbacks) {
  if (actionId === "new-doc") {
    callbacks.onNew();
    return;
  }
  if (actionId === "save-file") {
    callbacks.onSave();
    return;
  }
  if (actionId === "open-file") {
    callbacks.onOpen();
    return;
  }
  if (actionId === "delete-char") {
    callbacks.onDeleteChar();
    return;
  }
  if (actionId === "delete-word") {
    if (callbacks.onDeleteWord) callbacks.onDeleteWord();
    return;
  }
  callbacks.onClearAll();
}

/**
 * Left column: persistence and buffer actions, then destructive text edits.
 */
function ActionPanel({
  onNew,
  onSave,
  onOpen,
  onDeleteChar,
  onDeleteWord,
  onClearAll,
}) {
  const fileButtons = getFileButtons();
  const editButtons = getEditButtons();
  const callbacks = {
    onNew,
    onSave,
    onOpen,
    onDeleteChar,
    onDeleteWord,
    onClearAll,
  };

  return (
    <div className="action-panel">
      <p className="action-panel__label">Files</p>
      <div className="action-panel__buttons">
        {fileButtons.map((action) => (
          <Key
            key={action.id}
            label={action.label}
            variant="action"
            onPress={() => handleActionPress(action.id, callbacks)}
          />
        ))}
      </div>

      <p className="action-panel__label action-panel__label--secondary">
        Edit
      </p>
      <div className="action-panel__buttons">
        {editButtons.map((action) => (
          <Key
            key={action.id}
            label={action.label}
            variant="action"
            onPress={() => handleActionPress(action.id, callbacks)}
          />
        ))}
      </div>
    </div>
  );
}

export default ActionPanel;
