import DisplayArea from "../components/DisplayArea.jsx";
import EditorArea from "../components/EditorArea.jsx";

/**
 * Post-auth shell: user bar, document panes, and the keyboard region.
 */
function EditorPage({
  currentUser,
  onLogout,
  docs,
  activeId,
  onActivateDoc,
  onCloseDoc,
  language,
  onLanguageChange,
  onKeyPress,
  onDeleteChar,
  onDeleteWord,
  onClearAll,
  textStyle,
  onFontSizeChange,
  onColorChange,
  onFontFamilyChange,
  onSave,
  onOpen,
  onNew,
}) {
  return (
    <div className="app">
      <header className="user-header">
        <div className="user-info">
          <span>
            Connected as: <strong>{currentUser}</strong>
          </span>
        </div>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="display-container">
        {docs.map((doc) => (
          <DisplayArea
            key={doc.id}
            content={doc.content}
            isActive={doc.id === activeId}
            showClose={docs.length > 1}
            onFocus={() => onActivateDoc(doc.id)}
            onClose={() => onCloseDoc(doc.id)}
          />
        ))}
      </div>

      <EditorArea
        language={language}
        onLanguageChange={onLanguageChange}
        onKeyPress={onKeyPress}
        onDeleteChar={onDeleteChar}
        onDeleteWord={onDeleteWord}
        onClearAll={onClearAll}
        textStyle={textStyle}
        onFontSizeChange={onFontSizeChange}
        onColorChange={onColorChange}
        onFontFamilyChange={onFontFamilyChange}
        onSave={onSave}
        onOpen={onOpen}
        onNew={onNew}
      />
    </div>
  );
}

export default EditorPage;
