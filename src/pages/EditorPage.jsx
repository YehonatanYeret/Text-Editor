import DisplayArea from "../components/DisplayArea.jsx";
import EditorArea from "../components/EditorArea.jsx";
import segmentText from "../utils/segmentText.js";
const { highlightRangesForQuery, segmentsToString } = segmentText;

/** Layout only: state and handlers live in `App.jsx`. */
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
  onUndo,
  canUndo,
  textStyle,
  onFontSizeChange,
  onColorChange,
  onFontFamilyChange,
  onSave,
  onOpen,
  onNew,
  findQuery,
  replaceQuery,
  onFindChange,
  onReplaceChange,
  matchCount,
  onReplaceAll,
  keyboardTarget,
  onKeyboardTargetDocument,
  onKeyboardTargetFind,
  onKeyboardTargetReplace,
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
        
        {docs.map((doc) => {
          const text = segmentsToString(doc.content);
          const highlightRanges =
            doc.id === activeId
              ? highlightRangesForQuery(text, findQuery)
              : [];
        
          // creates a DisplayArea for each doc:
          return (
            <DisplayArea
              key={doc.id}
              content={doc.content}
              isActive={doc.id === activeId}
              showClose={docs.length > 1}
              onFocus={() => {
                onActivateDoc(doc.id);
                onKeyboardTargetDocument();
              }}
              onClose={() => onCloseDoc(doc.id)}
              highlightRanges={highlightRanges}
            />
          );
        })}
      </div>

      <EditorArea
        language={language}
        onLanguageChange={onLanguageChange}
        onKeyPress={onKeyPress}
        onDeleteChar={onDeleteChar}
        onDeleteWord={onDeleteWord}
        onClearAll={onClearAll}
        onUndo={onUndo}
        canUndo={canUndo}
        textStyle={textStyle}
        onFontSizeChange={onFontSizeChange}
        onColorChange={onColorChange}
        onFontFamilyChange={onFontFamilyChange}
        onSave={onSave}
        onOpen={onOpen}
        onNew={onNew}
        findQuery={findQuery}
        replaceQuery={replaceQuery}
        onFindChange={onFindChange}
        onReplaceChange={onReplaceChange}
        matchCount={matchCount}
        onReplaceAll={onReplaceAll}
        keyboardTarget={keyboardTarget}
        onKeyboardTargetFind={onKeyboardTargetFind}
        onKeyboardTargetReplace={onKeyboardTargetReplace}
      />
    </div>
  );
}

export default EditorPage;
