import { useState } from "react";
import { MAX_UNDO } from "../constants/editor.js";
import {
  undoMapAfterPush,
  undoMapAfterPop,
  undoMapWithoutDoc,
} from "../utils/undoHelpers.js";
import { cloneSegments } from "../utils/segmentText.js";

/**
 * Manages per-document undo stacks.
 *
 * @param {number} activeId - The currently-active document id (used by canUndo / popUndo).
 */
export function useUndoHistory(activeId) {
  const [undoByDocId, setUndoByDocId] = useState({});

  const canUndo = (undoByDocId[activeId] || []).length > 0;

  /** Push a content snapshot onto the undo stack for `docId`. */
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
