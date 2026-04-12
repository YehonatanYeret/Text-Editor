import {
  segmentOverlapsHighlightRanges,
} from "../utils/segmentText.js";

function DisplayArea({
  content,
  isActive,
  showClose,
  onFocus,
  onClose,
  highlightRanges = [],
}) {
  let stringIndex = 0;

  return (
    <section
      className={`display-area ${isActive ? "display-area--active" : ""}`}
      onClick={onFocus}
    >
      <div className="display-area__header">
        <h2 className="display-area__title">
          {isActive ? "● Active" : "Display"}
        </h2>
        {showClose && (
          <button
            type="button"
            className="display-area__close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        )}
      </div>

      <div className="display-area__content">
        {content.map((item, index) => {
          const segStart = stringIndex;
          const len = item.char.length;
          stringIndex += len;
          const segEnd = stringIndex;
          const hit =
            highlightRanges.length > 0 &&
            segmentOverlapsHighlightRanges(segStart, segEnd, highlightRanges);

          return (
            <span
              key={index}
              className={hit ? "display-area__hit" : undefined}
              style={item.style}
            >
              {item.char}
            </span>
          );
        })}
        {content.length === 0 && (
          <span style={{ opacity: 0.5 }}>Start typing...</span>
        )}
      </div>
    </section>
  );
}

export default DisplayArea;
