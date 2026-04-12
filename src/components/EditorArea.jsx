import Keyboard from "./Keyboard.jsx";
import ControlPanel from "./ControlPanel.jsx";
import ActionPanel from "./ActionPanel.jsx";

function EditorArea({
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
  onNew,
  onSave,
  onOpen
}) {
  // Combines the three main editor controls: the keyboard, the text styling panel, and the file/edit action panel.
  return (
    <section className="editor-area" aria-label="Virtual keyboard editor">
      <h2 className="editor-area__title">Editor Controls</h2>
      <div className="editor-area__controls">
        <div className="editor-area__left-panel">
          <ActionPanel
            onNew={onNew}
            onSave={onSave}
            onOpen={onOpen}
            onDeleteChar={onDeleteChar}
            onDeleteWord={onDeleteWord}
            onClearAll={onClearAll}
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