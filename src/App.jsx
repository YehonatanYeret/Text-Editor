import { useState } from "react";
import DisplayArea from "./components/DisplayArea.jsx";
import EditorArea from "./components/EditorArea.jsx";
import Login from "./components/Login.jsx"; 
import "./App.css";

function App() {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState("english");
  const [currentStyle, setCurrentStyle] = useState({
    fontSize: "26px",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif"
  });
  const [docs, setDocs] = useState([
    { id: Date.now(), content: [] } 
  ]);
  const [activeId, setActiveId] = useState(docs[0].id);

  const activeDoc = docs.find(d => d.id === activeId) || docs[0];

  const updateActiveDoc = (updateFn) => {
    setDocs(prevDocs => prevDocs.map(doc => 
      doc.id === activeId ? { ...doc, ...updateFn(doc) } : doc
    ));
  };

  const appendCharacter = (char) => {
    updateActiveDoc(doc => ({
      content: [...doc.content, { char, style: { ...currentStyle } }]
    }));
  };

  const deleteCharacter = () => {
    updateActiveDoc(doc => ({
      content: doc.content.slice(0, -1)
    }));
  };

  const clearAllText = () => updateActiveDoc(() => ({ content: [] }));

  const changeFontSize = (fontSize) => setCurrentStyle(prev => ({ ...prev, fontSize }));
  const changeTextColor = (color) => setCurrentStyle(prev => ({ ...prev, color }));
  const changeFontFamily = (fontFamily) => setCurrentStyle(prev => ({ ...prev, fontFamily }));

  const createNewDoc = () => {
    const newDoc = { id: Date.now(), content: [] };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
  };

  const closeDoc = (id) => {
    if (docs.length === 1) return; 
    if (window.confirm("Close this document?")) {
      const newDocs = docs.filter(doc => doc.id !== id);
      setDocs(newDocs);
      if (activeId === id) setActiveId(newDocs[0].id);
    }
  };

  const saveFile = () => {
    const name = prompt("Enter filename to save:");
    if (!name) return;
    const storageKey = `${currentUser}:${name}`;
    localStorage.setItem(storageKey, JSON.stringify(activeDoc.content));
    alert(`File "${name}" saved to your account.`);
  };

  const openFile = () => {
    const userFiles = Object.keys(localStorage)
      .filter(key => key.startsWith(`${currentUser}:`))
      .map(key => key.split(":")[1]);

    if (userFiles.length === 0) return alert("You don't have any saved files yet.");

    const name = prompt(`Your files: ${userFiles.join(", ")}\nWhich one to open?`);
    const saved = localStorage.getItem(`${currentUser}:${name}`);
    
    if (!saved) return alert("File not found.");

    const newDoc = { id: Date.now(), content: JSON.parse(saved) };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setCurrentUser(null);
      setDocs([{ id: Date.now(), content: [] }]);
    }
  };

  
  if (!currentUser) {
    return (
      <div className="app">
        <Login onLogin={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="user-header">
        <div className="user-info">
          <span>Connected as: <strong>{currentUser}</strong></span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="display-container">
        {docs.map(doc => (
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