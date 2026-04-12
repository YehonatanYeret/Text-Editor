import "./DisplayArea.css";

function DisplayArea({ content, isActive, showClose, onFocus, onClose }) {
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
            className="display-area__close-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onClose(); // coming from App.jsx, this will remove the doc from state and thus unmount this component
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {/* Display content is rendered as styled segments; empty state shows a placeholder. */}
      <div className="display-area__content">
        {content.map((item, index) => (
          <span key={index} style={item.style}>
            {item.char}
          </span>
        ))}
        {content.length === 0 && <span style={{opacity: 0.5}}>Start typing...</span>}
      </div>
    </section>
  );
}

export default DisplayArea;