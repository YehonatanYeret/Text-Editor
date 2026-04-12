import OptionButtonGroup from "./OptionButtonGroup.jsx";

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

      <OptionButtonGroup
        label="Language"
        options={languageOptions}
        isSelected={(opt) => language === opt.id}
        onSelect={(opt) => onLanguageChange(opt.id)}
      />

      <OptionButtonGroup
        label="Font Size"
        options={fontSizeOptions}
        isSelected={(opt) => textStyle.fontSize === opt.value}
        onSelect={(opt) => onFontSizeChange(opt.value)}
      />

      <OptionButtonGroup
        label="Color"
        options={colorOptions}
        isSelected={(opt) => textStyle.color === opt.value}
        onSelect={(opt) => onColorChange(opt.value)}
      />

      <OptionButtonGroup
        label="Font Family"
        options={fontFamilyOptions}
        isSelected={(opt) => textStyle.fontFamily === opt.value}
        onSelect={(opt) => onFontFamilyChange(opt.value)}
      />
    </div>
  );
}

export default ControlPanel;
