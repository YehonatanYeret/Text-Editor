/**
 * One primitive for both character keys and fat action keys—variant only swaps CSS hooks.
 */
function Key({ label, onPress, variant = "default", disabled = false }) {
  const classNameMap = {
    default: "key-button",
    action: "key-button key-button--action",
    space: "key-button key-button--space",
  };
  const className = classNameMap[variant] || classNameMap.default;
  const stateClass = disabled ? " key-button--disabled" : "";

  return (
    <button
      type="button"
      className={className + stateClass}
      onClick={onPress}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Key;
