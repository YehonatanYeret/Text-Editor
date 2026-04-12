export const MAX_UNDO = 40;

export const DEFAULT_TEXT_STYLE = {
  fontSize: "26px",
  color: "#e0e0e0",
  fontFamily: "Arial, sans-serif",
};

export function createEmptyDocument() {
  return { id: Date.now(), content: [] };
}
