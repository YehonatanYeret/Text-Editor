import Key from "./Key.jsx";

/**
 * Builds three keyboard layouts grouped by rows for a realistic visual structure.
 */
function getLanguageLayouts() {
  // Keyboard layouts are defined as arrays of rows, which are arrays of characters.
  const englishRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  const hebrewRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
    ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
    ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
    ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"],
  ];
  const emojiRows = [
    ["😀", "😂", "😍", "🤖", "🔥", "🎉", "💡", "✨", "👍", "🚀"],
    ["😎", "🥳", "😴", "🤩", "🤯", "🫡", "😇", "🤝"],
    ["❤️", "🧠", "🎯", "📚", "✅", "⚡", "🛠️", "🌈"],
  ];

  return {
    english: englishRows,
    hebrew: hebrewRows,
    emojis: emojiRows,
  };
}

/**
 * Returns a stable React key for each rendered keyboard key.
 */
function getRenderKey(char, rowIndex, keyIndex) {
  return `${char}-${rowIndex}-${keyIndex}`;
}

/**
 * Renders keys in keyboard rows with a wider bottom space key.
 */
function Keyboard({ language, onKeyPress }) {
  const layouts = getLanguageLayouts();
  const rows = layouts[language];

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="keyboard__row">
          {row.map((char, keyIndex) => (
            <Key
              key={getRenderKey(char, rowIndex, keyIndex)}
              label={char}
              onPress={() => onKeyPress(char)}
            />
          ))}
        </div>
      ))}
      <div className="keyboard__row keyboard__row--space">
        <Key label="Space" variant="space" onPress={() => onKeyPress(" ")} />
      </div>
    </div>
  );
}

export default Keyboard;
