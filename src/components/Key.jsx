/**
 * Renders one reusable keyboard-style button with optional visual variants.
 */
function Key({ label, onPress, variant = "default" }) {
  const classNameMap = {
    default: "key-button",
    action: "key-button key-button--action",
    space: "key-button key-button--space",
  };
  const className = classNameMap[variant] || classNameMap.default;

  return (
    <button type="button" className={className} onClick={onPress}>
      {label}
    </button>
  );
}

export default Key;
