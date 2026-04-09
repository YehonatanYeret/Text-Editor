import { useState } from "react";
import DisplayArea from "./components/DisplayArea.jsx";
import EditorArea from "./components/EditorArea.jsx";
import "./App.css";

/**
 * Manages all editor state and connects display output with editing controls.
 */
function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("english");
  const [textStyle, setTextStyle] = useState({
    fontSize: "26px",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif",
  });

  /**
   * Adds one character from the virtual keyboard into the displayed text.
   */
  function appendCharacter(char) {
    setText((prev) => prev + char);
  }

  /**
   * Removes the last character to mimic a backspace key.
   */
  function deleteCharacter() {
    setText((prev) => prev.slice(0, -1));
  }

  /**
   * Removes the last full word while handling trailing spaces gracefully.
   */
  function deleteWord() {
    setText((prev) => prev.trimEnd().replace(/\S+\s*$/, ""));
  }

  /**
   * Clears the entire text in one action.
   */
  function clearAllText() {
    setText("");
  }

  /**
   * Switches the active keyboard language for all displayed keys.
   */
  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
  }

  /**
   * Applies a new font size to all text in the display area.
   */
  function changeFontSize(fontSize) {
    setTextStyle((prev) => ({ ...prev, fontSize }));
  }

  /**
   * Applies a new text color to the full display content.
   */
  function changeTextColor(color) {
    setTextStyle((prev) => ({ ...prev, color }));
  }

  /**
   * Applies a new font family to all rendered text.
   */
  function changeFontFamily(fontFamily) {
    setTextStyle((prev) => ({ ...prev, fontFamily }));
  }

  /**
   * Part B:
   */
  function saveFile() {
  const name = prompt("insert file name to save:");
  if (!name) return; 

  const dataToSave = {
    text: text,
    textStyle: textStyle
  };

  localStorage.setItem(name, JSON.stringify(dataToSave));
  alert(`File "${name}" saved successfully!`);
 }

 function openFile() {
  const name = prompt("insert file name to open:");
  const savedData = localStorage.getItem(name);

  if (savedData) {
    const parsedData = JSON.parse(savedData);
    setText(parsedData.text);
    setTextStyle(parsedData.textStyle);
    alert(`File "${name}" loaded!`);
  } else {
    alert("File not found.");
  }
 }

  return (
    <div className="app">
      <DisplayArea text={text} textStyle={textStyle} />
      <EditorArea
        language={language}
        onLanguageChange={changeLanguage}
        onKeyPress={appendCharacter}
        onDeleteChar={deleteCharacter}
        onDeleteWord={deleteWord}
        onClearAll={clearAllText}
        textStyle={textStyle}
        onFontSizeChange={changeFontSize}
        onColorChange={changeTextColor}
        onFontFamilyChange={changeFontFamily}
        onSave={saveFile}
        onOpen={openFile}
      />
    </div>
  );
}

export default App;
