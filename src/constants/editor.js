const MAX_UNDO = 40;

const DEFAULT_TEXT_STYLE = {
  fontSize: "26px",
  color: "#e0e0e0",
  fontFamily: "Arial, sans-serif",
};

function createEmptyDocument() {
  return { id: Date.now(), content: [] };
}

export default {
  MAX_UNDO,
  DEFAULT_TEXT_STYLE,
  createEmptyDocument,
};
