import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import useAuth from "./hooks/useAuth.js";
import useDocuments from "./hooks/useDocuments.js";
import useUndoHistory from "./hooks/useUndoHistory.js";
import useFindReplace from "./hooks/useFindReplace.js";
import useTextStyle from "./hooks/useTextStyle.js";
import useKeyboardTarget from "./hooks/useKeyboardTarget.js";
import useEditorActions from "./hooks/useEditorActions.js";

/** Root component: composes custom hooks and delegates UI to LoginPage / EditorPage */
function App() {
  // --- Auth ---
  const { currentUser, setCurrentUser, handleLogin } = useAuth();

  // --- Language (simple enough to stay inline) ---
  const [language, setLanguage] = useState("english");

  // --- Documents (tabs) ---
  const {
    docs,
    setDocs,
    activeId,
    setActiveId,
    activeDoc,
    createNewDoc,
    saveFile,
    openFile,
    closeDoc,
    resetDocs,
  } = useDocuments();

  // --- Undo ---
  const { canUndo, pushUndoSnapshot, popUndo, clearUndoForDoc, resetUndo } =
    useUndoHistory(activeId);

  // --- Find / Replace ---
  const {
    findQuery,
    setFindQuery,
    replaceQuery,
    setReplaceQuery,
    activeMatchCount,
    resetFindReplace,
  } = useFindReplace(activeDoc);

  // --- Text style ---
  const { currentStyle, setFontSize, setColor, setFontFamily } =
    useTextStyle();

  // --- Keyboard target ---
  const {
    keyboardTarget,
    setTargetDocument,
    setTargetFind,
    setTargetReplace,
    resetKeyboardTarget,
  } = useKeyboardTarget();

  // --- Editing actions (orchestrates the hooks above) ---
  const {
    appendCharacter,
    deleteCharacter,
    deleteWord,
    clearAllText,
    undo,
    replaceAllMatches,
  } = useEditorActions({
    keyboardTarget,
    docs,
    setDocs,
    activeId,
    currentStyle,
    pushUndoSnapshot,
    popUndo,
    setFindQuery,
    setReplaceQuery,
    findQuery,
    replaceQuery,
  });

  // --- Composite handlers that span multiple hooks ---

  const handleSave = () => saveFile(currentUser);

  const handleOpen = () => {
    openFile(currentUser);
    resetKeyboardTarget();
  };

  const handleNew = () => {
    createNewDoc();
    resetKeyboardTarget();
  };

  const handleCloseDoc = (id) => {
    closeDoc(id, () => saveFile(currentUser));
    clearUndoForDoc(id);
  };

  const handleLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to logout? (Unsaved work will be lost)"
      )
    ) {
      setCurrentUser(null);
      resetDocs();
      resetUndo();
      resetFindReplace();
      resetKeyboardTarget();
    }
  };

  // --- Render ---

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <EditorPage
      currentUser={currentUser}
      onLogout={handleLogout}
      docs={docs}
      activeId={activeId}
      onActivateDoc={setActiveId}
      onCloseDoc={handleCloseDoc}
      language={language}
      onLanguageChange={setLanguage}
      onKeyPress={appendCharacter}
      onDeleteChar={deleteCharacter}
      onDeleteWord={deleteWord}
      onClearAll={clearAllText}
      onUndo={undo}
      canUndo={canUndo}
      textStyle={currentStyle}
      onFontSizeChange={setFontSize}
      onColorChange={setColor}
      onFontFamilyChange={setFontFamily}
      onSave={handleSave}
      onOpen={handleOpen}
      onNew={handleNew}
      findQuery={findQuery}
      replaceQuery={replaceQuery}
      onFindChange={setFindQuery}
      onReplaceChange={setReplaceQuery}
      matchCount={activeMatchCount}
      onReplaceAll={replaceAllMatches}
      keyboardTarget={keyboardTarget}
      onKeyboardTargetDocument={setTargetDocument}
      onKeyboardTargetFind={setTargetFind}
      onKeyboardTargetReplace={setTargetReplace}
    />
  );
}

export default App;
