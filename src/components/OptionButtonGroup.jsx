/**
 * One labeled row of toggle-style setting buttons; parent decides what counts as selected.
 */
function OptionButtonGroup({ label, options, isSelected, onSelect }) {
  return (
    <div className="control-panel__group">
      <p className="option-button-group__label">{label}</p>
      <div className="option-button-group__buttons">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={
              isSelected(opt)
                ? "control-panel__button control-panel__button--active"
                : "control-panel__button"
            }
            onClick={() => onSelect(opt)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OptionButtonGroup;
