import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import { segmentsAfterDeletingLastWord } from "./utils/segmentText.js";

/**
 * Coordinates auth, multiple document buffers, and the virtual keyboard.
 * Typed output is stored as a list of segments so each character can keep its own style snapshot.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState("english");
  const [currentStyle, setCurrentStyle] = useState({
    fontSize: "26px",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif",
  });
  const [docs, setDocs] = useState([{ id: Date.now(), content: [] }]);
  const [activeId, setActiveId] = useState(docs[0].id);

  const activeDoc = docs.find((d) => d.id === activeId) || docs[0];

  const updateActiveDoc = (updateFn) => {
    setDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === activeId ? { ...doc, ...updateFn(doc) } : doc
      )
    );
  };

  const appendCharacter = (char) => {
    updateActiveDoc((doc) => ({
      content: [...doc.content, { char, style: { ...currentStyle } }],
    }));
  };

  const deleteCharacter = () => {
    updateActiveDoc((doc) => ({
      content: doc.content.slice(0, -1),
    }));
  };

  const deleteWord = () => {
    updateActiveDoc((doc) => ({
      content: segmentsAfterDeletingLastWord(doc.content),
    }));
  };

  const clearAllText = () => updateActiveDoc(() => ({ content: [] }));

  const changeFontSize = (fontSize) =>
    setCurrentStyle((prev) => ({ ...prev, fontSize }));
  const changeTextColor = (color) =>
    setCurrentStyle((prev) => ({ ...prev, color }));
  const changeFontFamily = (fontFamily) =>
    setCurrentStyle((prev) => ({ ...prev, fontFamily }));

  const createNewDoc = () => {
    const newDoc = { id: Date.now(), content: [] };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
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
  };

  const saveFile = () => {
    const userFiles = Object.keys(localStorage)
      .filter((key) => key.startsWith(`${currentUser}:`))
      .map((key) => key.split(":")[1]);

    let message;
    if (userFiles.length === 0) {
      message = `You don't have any saved files yet.\nEnter a name to save:`;
    } else {
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

  const handleLogout = () => {
    if (
      window.confirm("Are you sure you want to logout? (Unsaved work will be lost)")
    ) {
      setCurrentUser(null);
      setDocs([{ id: Date.now(), content: [] }]);
    }
  };

  const handleLogin = (username, password) => {
    const user = localStorage.getItem(`user:${username}`);
    if (!user) {
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
      onCloseDoc={closeDoc}
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
  );
}

export default App;
