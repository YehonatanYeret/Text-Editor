import "./DisplayArea.css";

/**
 * Displays the full text output and applies the selected visual style.
 */
function DisplayArea({ text, textStyle }) {
  return (
    <section className="display-area">
      <h2 className="display-area__title">Display</h2>
      <div className="display-area__content" style={textStyle}>
        {text}
      </div>
    </section>
  );
}

export default DisplayArea;
