import "./ControlPanel.css";

/**
 * Defines the language-switch buttons for changing keyboard layout.
 */
function getLanguageOptions() {
  return [
    { id: "english", label: "English" },
    { id: "hebrew", label: "Hebrew" },
    { id: "emojis", label: "Emojis" },
  ];
}

/**
 * Defines font-size presets for the displayed text.
 */
function getFontSizeOptions() {
  return [
    { id: "small", label: "Small", value: "20px" },
    { id: "medium", label: "Medium", value: "26px" },
    { id: "large", label: "Large", value: "34px" },
  ];
}

/**
 * Defines color presets for the displayed text.
 */
function getColorOptions() {
  return [
    { id: "light", label: "Light", value: "#e0e0e0" },
    { id: "cyan", label: "Cyan", value: "#7dcfff" },
    { id: "pink", label: "Pink", value: "#f5c2e7" },
  ];
}

/**
 * Defines font-family presets for the displayed text.
 */
function getFontFamilyOptions() {
  return [
    { id: "arial", label: "Arial", value: "Arial, sans-serif" },
    { id: "georgia", label: "Georgia", value: "Georgia, serif" },
    { id: "mono", label: "Monospace", value: "\"Courier New\", monospace" },
  ];
}

/**
 * Renders the right control column with language and visual style controls.
 */
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
      <p className="control-panel__title">Display Settings</p>
      <div className="control-panel__group">
        <p className="control-panel__label">Language</p>
        <div className="control-panel__buttons">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                language === option.id
                  ? "control-panel__button control-panel__button--active"
                  : "control-panel__button"
              }
              onClick={() => onLanguageChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Font Size</p>
        <div className="control-panel__buttons">
          {fontSizeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                textStyle.fontSize === option.value
                  ? "control-panel__button control-panel__button--active"
                  : "control-panel__button"
              }
              onClick={() => onFontSizeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Color</p>
        <div className="control-panel__buttons">
          {colorOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                textStyle.color === option.value
                  ? "control-panel__button control-panel__button--active"
                  : "control-panel__button"
              }
              onClick={() => onColorChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-panel__group">
        <p className="control-panel__label">Font Family</p>
        <div className="control-panel__buttons">
          {fontFamilyOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                textStyle.fontFamily === option.value
                  ? "control-panel__button control-panel__button--active"
                  : "control-panel__button"
              }
              onClick={() => onFontFamilyChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
