/**
 * Focus on a field routes the on-screen keyboard into Find or Replace (see App keyboardTarget).
 */
function FindReplacePanel({
  findQuery,
  replaceQuery,
  onFindChange,
  onReplaceChange,
  matchCount,
  onReplaceAll,
  keyboardTarget,
  onKeyboardTargetFind,
  onKeyboardTargetReplace,
}) {
  return (
    <div className="find-replace">
      <p className="find-replace__label">Find &amp; replace</p>
      <p className="find-replace__hint">
        Tap a field, then use the keyboard below (same as the document).
      </p>
      <div className="find-replace__row">
        <input
          type="text"
          className={
            keyboardTarget === "find"
              ? "find-replace__input find-replace__input--active"
              : "find-replace__input"
          }
          placeholder="Find…"
          value={findQuery}
          onChange={(e) => onFindChange(e.target.value)}
          onFocus={onKeyboardTargetFind}
          aria-label="Find text"
        />
        <input
          type="text"
          className={
            keyboardTarget === "replace"
              ? "find-replace__input find-replace__input--active"
              : "find-replace__input"
          }
          placeholder="Replace with…"
          value={replaceQuery}
          onChange={(e) => onReplaceChange(e.target.value)}
          onFocus={onKeyboardTargetReplace}
          aria-label="Replace with"
        />
        <button
          type="button"
          className="find-replace__btn"
          onClick={onReplaceAll}
          disabled={!findQuery}
        >
          Replace all
        </button>
      </div>
      <p className="find-replace__meta">
        {findQuery
          ? `${matchCount} match${matchCount === 1 ? "" : "es"} in active document`
          : "Type above to search the active document"}
      </p>
    </div>
  );
}

export default FindReplacePanel;
