import { useState } from "react";
import DisplayArea from "./components/DisplayArea.jsx";
import EditorArea from "./components/EditorArea.jsx";
import "./App.css";

function App() {
  const [currentStyle, setCurrentStyle] = useState({
    fontSize: "26px",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif"
  });

  const [docs, setDocs] = useState([
    { id: Date.now(), content: [] } 
  ]);
  
  const [activeId, setActiveId] = useState(docs[0].id);
  const [language, setLanguage] = useState("english");

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
    if (window.confirm("Are you sure you want to close this document?")) {
      const newDocs = docs.filter(doc => doc.id !== id);
      setDocs(newDocs);
      if (activeId === id) setActiveId(newDocs[0].id);
    }
  };

  const saveFile = () => {
    const name = prompt("Name for saving:");
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(activeDoc.content));
    alert("Saved successfully!");
  };

  const openFile = () => {
    const name = prompt("Name of file to open:");
    const saved = localStorage.getItem(name);
    if (!saved) return alert("File not found");
    const newDoc = { id: Date.now(), content: JSON.parse(saved) };
    setDocs([...docs, newDoc]);
    setActiveId(newDoc.id);
  };

  return (
    <div className="app">
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