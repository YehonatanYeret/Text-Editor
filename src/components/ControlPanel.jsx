import "./ControlPanel.css";

function getLanguageOptions() {
  return [
    { id: "english", label: "English" },
    { id: "hebrew", label: "עברית" },
    { id: "emojis", label: "Emojis" },
  ];
}

function getFontSizeOptions() {
  return [
    { id: "fs-small", label: "Small", value: "18px" },
    { id: "fs-medium", label: "Medium", value: "26px" },
    { id: "fs-large", label: "Large", value: "36px" },
  ];
}

function getColorOptions() {
  return [
    { id: "c-white", label: "White", value: "#e0e0e0" },
    { id: "c-blue", label: "Blue", value: "#7aa2f7" },
    { id: "c-pink", label: "Pink", value: "#f5c2e7" },
    { id: "c-green", label: "Green", value: "#9ece6a" },
  ];
}

function getFontFamilyOptions() {
  return [
    { id: "ff-sans", label: "Sans", value: "Arial, sans-serif" },
    { id: "ff-serif", label: "Serif", value: "Georgia, serif" },
    { id: "ff-mono", label: "Mono", value: "Courier New, monospace" },
  ];
}

function ControlPanel({
  language,
  onLanguageChange,
  textStyle,
  onFontSizeChange,
  onColorChange,
  onFontFamilyChange,
}) {
  const languageOptions = getLanguageOptions();
  const fontSizeOptions = getFontSizeOptions();
  const colorOptions = getColorOptions();
  const fontFamilyOptions = getFontFamilyOptions();

  return (
    <div className="control-panel">
      <p className="control-panel__title">Settings</p>
      
      <div className="control-panel__group">
        <p className="control-panel__label">Language</p>
        <div className="control-panel__buttons">
          {languageOptions.map(opt => (
            <button key={opt.id} type="button" 
              className={language === opt.id ? "control-panel__button control-panel__button--active" : "control-panel__button"}
              onClick={() => onLanguageChange(opt.id)}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Font Size</p>
        <div className="control-panel__buttons">
          {fontSizeOptions.map(opt => (
            <button key={opt.id} type="button"
              className={textStyle.fontSize === opt.value ? "control-panel__button control-panel__button--active" : "control-panel__button"}
              onClick={() => onFontSizeChange(opt.value)}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Color</p>
        <div className="control-panel__buttons">
          {colorOptions.map(opt => (
            <button key={opt.id} type="button"
              className={textStyle.color === opt.value ? "control-panel__button control-panel__button--active" : "control-panel__button"}
              onClick={() => onColorChange(opt.value)}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Font Family</p>
        <div className="control-panel__buttons">
          {fontFamilyOptions.map(opt => (
            <button key={opt.id} type="button"
              className={textStyle.fontFamily === opt.value ? "control-panel__button control-panel__button--active" : "control-panel__button"}
              onClick={() => onFontFamilyChange(opt.value)}>{opt.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;