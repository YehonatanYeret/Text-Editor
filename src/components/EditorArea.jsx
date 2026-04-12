import Keyboard from "./Keyboard.jsx";
import ControlPanel from "./ControlPanel.jsx";
import ActionPanel from "./ActionPanel.jsx";
import FindReplacePanel from "./FindReplacePanel.jsx";

function EditorArea({
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
  onNew,
  onSave,
  onOpen,
  findQuery,
  replaceQuery,
  onFindChange,
  onReplaceChange,
  matchCount,
  onReplaceAll,
  keyboardTarget,
  onKeyboardTargetFind,
  onKeyboardTargetReplace,
}) {
  return (
    <section className="editor-area" aria-label="Virtual keyboard editor">
      <h2 className="editor-area__title">Editor Controls</h2>

      <FindReplacePanel
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

      <div className="editor-area__controls">
        <div className="editor-area__left-panel">
          <ActionPanel
            onNew={onNew}
            onSave={onSave}
            onOpen={onOpen}
            onDeleteChar={onDeleteChar}
            onDeleteWord={onDeleteWord}
            onClearAll={onClearAll}
            onUndo={onUndo}
            canUndo={canUndo}
          />
        </div>
        <div className="editor-area__keyboard-panel">
          <Keyboard language={language} onKeyPress={onKeyPress} />
        </div>
        <div className="editor-area__right-panel">
          <ControlPanel
            language={language}
            onLanguageChange={onLanguageChange}
            textStyle={textStyle}
            onFontSizeChange={onFontSizeChange}
            onColorChange={onColorChange}
            onFontFamilyChange={onFontFamilyChange}
          />
        </div>
      </div>
    </section>
  );
}

export default EditorArea;
