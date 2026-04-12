import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import {
  MAX_UNDO,
  DEFAULT_TEXT_STYLE,
  createEmptyDocument,
} from "./constants/editor.js";
import { deleteLastWordInString } from "./utils/stringEdit.js";
import {
  attemptLogin,
  saveDocumentWithPrompt,
  openDocumentWithPrompt,
} from "./utils/userStorage.js";
import { runForKeyboardTarget } from "./utils/keyboardTarget.js";
import {
  segmentsAfterDeletingLastWord,
  cloneSegments,
  replaceAllInSegments,
  countOccurrencesInString,
  segmentsToString,
  segmentsEqual,
} from "./utils/segmentText.js";
import {
  findActiveDoc,
  mapActiveDocContent,
  appendCharToActiveDoc,
  removeLastCharFromActiveDoc,
} from "./utils/docList.js";
import {
  undoMapAfterPush,
  undoMapAfterPop,
  undoMapWithoutDoc,
} from "./utils/undoHelpers.js";

/** Root component: holds all state and handlers; UI is split into LoginPage / EditorPage */
function App() {
  // --- App-wide state ---
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState("english");
  const [currentStyle, setCurrentStyle] = useState(() => ({
    ...DEFAULT_TEXT_STYLE,
  }));
  /** Open tabs: { id, content } where content is an array of { char, style } segments */
  const [docs, setDocs] = useState(() => {
    const first = createEmptyDocument();
    return [first];
  });
  const [activeId, setActiveId] = useState(docs[0].id);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  /** Where virtual keyboard input goes: document | find | replace */
  const [keyboardTarget, setKeyboardTarget] = useState("document");
  /** Per document id: stack of content snapshots for undo */
  const [undoByDocId, setUndoByDocId] = useState({});

  // Derived values (not separate state)
  const activeDoc = docs.find((d) => d.id === activeId) || docs[0];
  const activeMatchCount = countOccurrencesInString(
    segmentsToString(activeDoc.content),
    findQuery
  );
  const canUndo = (undoByDocId[activeId] || []).length > 0;

  const pushUndoSnapshot = (docId, contentSnapshot) => {
    setUndoByDocId((u) =>
      undoMapAfterPush(u, docId, contentSnapshot, MAX_UNDO)
    );
  };

  // --- Keyboard routing (find / replace fields vs active document) ---
  const appendCharacter = (char) => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => q + char),
      onReplace: () => setReplaceQuery((q) => q + char),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (doc) pushUndoSnapshot(activeId, doc.content);
        setDocs((prev) =>
          appendCharToActiveDoc(prev, activeId, char, currentStyle)
        );
      },
    });
  };

  const deleteCharacter = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => q.slice(0, -1)),
      onReplace: () => setReplaceQuery((q) => q.slice(0, -1)),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc || doc.content.length === 0) return;
        pushUndoSnapshot(activeId, doc.content);
        setDocs((prev) => removeLastCharFromActiveDoc(prev, activeId));
      },
    });
  };

  const deleteWord = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => deleteLastWordInString(q)),
      onReplace: () => setReplaceQuery((q) => deleteLastWordInString(q)),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc) return;
        const next = segmentsAfterDeletingLastWord(doc.content);
        if (next.length === doc.content.length) return;
        pushUndoSnapshot(activeId, doc.content);
        setDocs((prev) => mapActiveDocContent(prev, activeId, next));
      },
    });
  };

  const clearAllText = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery(""),
      onReplace: () => setReplaceQuery(""),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc || doc.content.length === 0) return;
        pushUndoSnapshot(activeId, doc.content);
        setDocs((prev) => mapActiveDocContent(prev, activeId, []));
      },
    });
  };

  const undo = () => {
    const popped = undoMapAfterPop(undoByDocId, activeId);
    if (!popped) return;
    setUndoByDocId(popped.undoByDocId);
    setDocs((prev) =>
      mapActiveDocContent(
        prev,
        activeId,
        cloneSegments(popped.restored)
      )
    );
  };

  const replaceAllMatches = () => {
    if (!findQuery) return;
    const doc = findActiveDoc(docs, activeId);
    if (!doc) return;

    const next = replaceAllInSegments(
      doc.content,
      findQuery,
      replaceQuery,
      currentStyle
    );
    if (segmentsEqual(next, doc.content)) return;

    pushUndoSnapshot(activeId, doc.content);
    setDocs((prev) => mapActiveDocContent(prev, activeId, next));
  };

  // --- Files & tabs (localStorage keys scoped by username) ---
  const saveFile = () => {
    saveDocumentWithPrompt(currentUser, activeDoc.content);
  };

  const createNewDoc = () => {
    const newDoc = createEmptyDocument();
    setDocs((prev) => [...prev, newDoc]);
    setActiveId(newDoc.id);
    setKeyboardTarget("document");
  };

  const closeDoc = (id) => {
    if (docs.length === 1) return;

    const closing = docs.find((doc) => doc.id === id);
    if (closing?.content.length > 0) {
      if (window.confirm("You want to save before closing?")) {
        saveFile();
      }
    }
    const newDocs = docs.filter((doc) => doc.id !== id);
    setDocs(newDocs);
    if (activeId === id) setActiveId(newDocs[0].id);
    setUndoByDocId((u) => undoMapWithoutDoc(u, id));
  };

  const openFile = () => {
    const content = openDocumentWithPrompt(currentUser);
    if (!content) return;
    const newDoc = { id: Date.now(), content };
    setDocs((prev) => [...prev, newDoc]);
    setActiveId(newDoc.id);
    setKeyboardTarget("document");
  };

  const handleLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to logout? (Unsaved work will be lost)"
      )
    ) {
      const fresh = createEmptyDocument();
      setCurrentUser(null);
      setDocs([fresh]);
      setActiveId(fresh.id);
      setUndoByDocId({});
      setFindQuery("");
      setReplaceQuery("");
      setKeyboardTarget("document");
    }
  };

  // --- Auth ---
  const handleLogin = (username, password) => {
    const result = attemptLogin(username, password);
    if (result.ok) {
      setCurrentUser(username);
    } else {
      window.alert("Invalid username or password.");
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  /* EditorPage is presentational: editor logic stays here in App */
  return (
    <EditorPage
      currentUser={currentUser}
      onLogout={handleLogout}
      docs={docs}
      activeId={activeId}
      onActivateDoc={setActiveId}
      onCloseDoc={closeDoc}
      language={language}
      onLanguageChange={setLanguage}
      onKeyPress={appendCharacter}
      onDeleteChar={deleteCharacter}
      onDeleteWord={deleteWord}
      onClearAll={clearAllText}
      onUndo={undo}
      canUndo={canUndo}
      textStyle={currentStyle}
      onFontSizeChange={(fontSize) =>
        setCurrentStyle((prev) => ({ ...prev, fontSize }))
      }
      onColorChange={(color) =>
        setCurrentStyle((prev) => ({ ...prev, color }))
      }
      onFontFamilyChange={(fontFamily) =>
        setCurrentStyle((prev) => ({ ...prev, fontFamily }))
      }
      onSave={saveFile}
      onOpen={openFile}
      onNew={createNewDoc}
      findQuery={findQuery}
      replaceQuery={replaceQuery}
      onFindChange={setFindQuery}
      onReplaceChange={setReplaceQuery}
      matchCount={activeMatchCount}
      onReplaceAll={replaceAllMatches}
      keyboardTarget={keyboardTarget}
      onKeyboardTargetDocument={() => setKeyboardTarget("document")}
      onKeyboardTargetFind={() => setKeyboardTarget("find")}
      onKeyboardTargetReplace={() => setKeyboardTarget("replace")}
    />
  );
}

export default App;
