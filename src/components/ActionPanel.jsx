import Key from "./Key.jsx";

function getFileButtons() {
  return [
    { id: "new-doc", label: "New" },
    { id: "save-file", label: "Save" },
    { id: "open-file", label: "Open" },
  ];
}

function getEditButtons() {
  return [
    { id: "delete-char", label: "Delete Char" },
    { id: "delete-word", label: "Delete Word" },
    { id: "clear-all", label: "Clear All" },
  ];
}

/**
 * Maps action ids to handlers so adding a file/edit action stays a single table row.
 */
function createActionHandlers(callbacks) {
  return {
    "new-doc": () => callbacks.onNew(),
    "save-file": () => callbacks.onSave(),
    "open-file": () => callbacks.onOpen(),
    "delete-char": () => callbacks.onDeleteChar(),
    "delete-word": () => callbacks.onDeleteWord?.(),
    "clear-all": () => callbacks.onClearAll(),
  };
}

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
  const handlers = createActionHandlers({
    onNew,
    onSave,
    onOpen,
    onDeleteChar,
    onDeleteWord,
    onClearAll,
  });

  return (
    <div className="action-panel">
      <p className="action-panel__label">Files</p>
      <div className="action-panel__buttons">
        {fileButtons.map((action) => (
          <Key
            key={action.id}
            label={action.label}
            variant="action"
            onPress={() => handlers[action.id]?.()}
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
            onPress={() => handlers[action.id]?.()}
          />
        ))}
      </div>
    </div>
  );
}

export default ActionPanel;
