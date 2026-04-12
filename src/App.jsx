import { useState } from "react";
import DisplayArea from "./components/DisplayArea.jsx";
import EditorArea from "./components/EditorArea.jsx";
import Login from "./components/Login.jsx";
import "./App.css";


/**
 * Coordinates auth, multiple document buffers, and the virtual keyboard.
 * Typed output is stored as a list of segments so each character can keep its own style snapshot.
 */
function App() {
  // Session identity; null means the editor UI is hidden until login succeeds.
  const [currentUser, setCurrentUser] = useState(null);

  // Drives which character set the Keyboard renders (English / Hebrew / emojis).
  const [language, setLanguage] = useState("english");

  // Style picked in the control panel; only affects characters typed after the change.
  const [currentStyle, setCurrentStyle] = useState({
    fontSize: "26px",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif",
  });

  // Each tab is { id, content } where content is an array of { char, style }.
  const [docs, setDocs] = useState([{ id: Date.now(), content: [] }]);

  // Which document receives keyboard input and file save/load targets.
  const [activeId, setActiveId] = useState(docs[0].id);

  // Keeps rendering stable if activeId ever drifts.
  const activeDoc = docs.find((d) => d.id === activeId) || docs[0];

  /**
   * Patches only the focused document by id so multi-tab edits do not clobber each other.
   */
  const updateActiveDoc = (updateFn) => {
    setDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === activeId ? { ...doc, ...updateFn(doc) } : doc
      )
    );
  };

  /**
   * Pushes one segment: the character plus a copy of currentStyle so later panel changes do not rewrite history.
   */
  const appendCharacter = (char) => {
    updateActiveDoc((doc) => ({
      content: [...doc.content, { char, style: { ...currentStyle } }],
    }));
  };

  /** Drops the last segment */
  const deleteCharacter = () => {
    updateActiveDoc((doc) => ({
      content: doc.content.slice(0, -1),
    }));
  };

  /** Deletes the last word in the active document while preserving per-character styles on what remains. */
  const deleteWord = () => {
    updateActiveDoc((doc) => ({
      content: segmentsAfterDeletingLastWord(doc.content),
    }));
  };

  /**
 * Removes the last “word” as a suffix of segments: skips trailing whitespace, then drops
 * the final run of non-whitespace characters (works for English, Hebrew, and emoji keys).
 */
function segmentsAfterDeletingLastWord(segments) {
  if (!segments.length) return segments;

  let end = segments.length - 1;
  while (end >= 0 && /\s/u.test(segments[end].char)) {
    end -= 1;
  }
  if (end < 0) return [];

  // Now end is on the last non-whitespace char; keep moving left until we find whitespace or the start.
  let start = end;
  while (start >= 0 && !/\s/u.test(segments[start].char)) {
    start -= 1;
  }
  return segments.slice(0, start + 1);
}

  /** Wipes the active document’s segments without touching other tabs. */
  const clearAllText = () => updateActiveDoc(() => ({ content: [] }));

  const changeFontSize = (fontSize) =>
    setCurrentStyle((prev) => ({ ...prev, fontSize }));
  const changeTextColor = (color) =>
    setCurrentStyle((prev) => ({ ...prev, color }));            
  const changeFontFamily = (fontFamily) =>
    setCurrentStyle((prev) => ({ ...prev, fontFamily }));

  /** Opens a fresh empty buffer and focuses it so typing does not append to an old tab. */
  const createNewDoc = () => {
    const newDoc = { id: Date.now(), content: [] };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
  };

  const closeDoc = (id) => {
    if (docs.length === 1) return;

    if (docs.find((doc) => doc.id === id).content.length > 0) { // ask only if there is content to lose in the closing tab
      if (window.confirm("You want to save before closing?")) {
        saveFile();
      }
    } 
    const newDocs = docs.filter((doc) => doc.id !== id);
    setDocs(newDocs);
    if (activeId === id) setActiveId(newDocs[0].id);
  };

  /**
   * Persists the active document’s segment list under a user-scoped key so accounts do not collide in localStorage.
   */
  const saveFile = () => {
    const userFiles = Object.keys(localStorage)
      .filter((key) => key.startsWith(`${currentUser}:`))
      .map((key) => key.split(":")[1]);
    
    console.log("User files:", userFiles);

    let message;
    if (userFiles.length === 0){
      message = `You don't have any saved files yet.\nEnter a name to save:`;
    }
    else{
      message = `Your files: ${userFiles.join(", ")}\nEnter a name to save:`;
    }

    const name = prompt(message);
    if (!name) return;
    if (userFiles.includes(name)) {
      if (!window.confirm("A file with that name already exists. Overwrite?")) {
        return;
      }
    }
    const storageKey = `${currentUser}:${name}`;
    localStorage.setItem(storageKey, JSON.stringify(activeDoc.content));
    alert(`File "${name}" saved to your account.`);
  };

  /**
   * Lists keys prefixed with the logged-in user, then hydrates a new tab from the chosen payload.
   */
  const openFile = () => {
    const userFiles = Object.keys(localStorage)
      .filter((key) => key.startsWith(`${currentUser}:`))
      .map((key) => key.split(":")[1]);

    if (userFiles.length === 0)
      return alert("You don't have any saved files yet.");

    const name = prompt(`Your files: ${userFiles.join(", ")}\nWhich one to open?`);
    const saved = localStorage.getItem(`${currentUser}:${name}`);

    if (!saved) return;

    const newDoc = { id: Date.now(), content: JSON.parse(saved) };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
  };

  /** Ends the session and resets to a single empty doc so the next login starts clean. */
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout? (Unsaved work will be lost)")) {
      setCurrentUser(null);
      setDocs([{ id: Date.now(), content: [] }]);
    }
  };

  const handleLogin = (username, password) => {
    const user = localStorage.getItem(`user:${username}`);
    if (!user) {
      // If the user doesn't exist, create a new account with the provided password
      localStorage.setItem(`user:${username}`, JSON.stringify({ password }));
      setCurrentUser(username);
    } else {
      if (JSON.parse(user).password === password) {
        setCurrentUser(username);
      } else {
        alert("Invalid username or password.");
      }
    }
  };

  // Entire editor tree is unreachable until a username is chosen (Login owns that flow).
  if (!currentUser) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="user-header">
        <div className="user-info">
          <span>
            Connected as: <strong>{currentUser}</strong>
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* One DisplayArea per doc; clicking a pane sets activeId so the keyboard targets that buffer. */}
      <div className="display-container">
        {docs.map((doc) => (
          <DisplayArea
            key={doc.id}
            content={doc.content}
            isActive={doc.id === activeId}
            showClose={docs.length > 1}
            onFocus={() => setActiveId(doc.id)}
            onClose={() => closeDoc(doc.id)}
          />
        ))}
      </div>

      <EditorArea
        language={language}
        onLanguageChange={setLanguage}
        onKeyPress={appendCharacter}
        onDeleteChar={deleteCharacter}
        onDeleteWord={deleteWord}
        onClearAll={clearAllText}
        textStyle={currentStyle}
        onFontSizeChange={changeFontSize}
        onColorChange={changeTextColor}
        onFontFamilyChange={changeFontFamily}
        onSave={saveFile}
        onOpen={openFile}
        onNew={createNewDoc}
      />
    </div>
  );
}

export default App;