import { useState } from "react";
import editor from "../constants/editor.js";
const { MAX_UNDO } = editor;
import undoHelpers from "../utils/undoHelpers.js";
const { undoMapAfterPush, undoMapAfterPop, undoMapWithoutDoc } = undoHelpers;
import segmentText from "../utils/segmentText.js";
const { cloneSegments } = segmentText;

/**
 * Manages per-document undo stacks.
 */
export default function useUndoHistory(activeId) {
  const [undoByDocId, setUndoByDocId] = useState({});

  const canUndo = (undoByDocId[activeId] || []).length > 0; //if there is a stack for the doc to undo from him

  // this function happans everytime we delete or adding somthing!
  //  it adds to the stack and in this way we can undo it later.
  const pushUndoSnapshot = (docId, contentSnapshot) => {
    setUndoByDocId((u) =>
      undoMapAfterPush(u, docId, contentSnapshot, MAX_UNDO)
    );
  };

  /**
   * Pop the most recent snapshot for the active document.
   * @returns {Array|null} The restored content segments, or null if nothing to undo.
   */
  const popUndo = () => {
    const popped = undoMapAfterPop(undoByDocId, activeId);
    if (!popped) return null;
    setUndoByDocId(popped.undoByDocId);
    return cloneSegments(popped.restored);
  };

  /** Remove the undo stack for a specific document (e.g. when closing a tab). */
  const clearUndoForDoc = (id) => {
    setUndoByDocId((u) => undoMapWithoutDoc(u, id));
  };

  /** Clear all undo history (used on logout). */
  const resetUndo = () => {
    setUndoByDocId({});
  };

  return { canUndo, pushUndoSnapshot, popUndo, clearUndoForDoc, resetUndo };
}
