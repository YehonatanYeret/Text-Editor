import { useState } from "react";
import editor from "../constants/editor.js";
const { MAX_UNDO } = editor; // const { MAX_UNDO } = editor.MAX_UNDO;
import undoHelpers from "../utils/undoHelpers.js";
const { undoMapAfterPush, undoMapAfterPop, undoMapWithoutDoc } = undoHelpers;
import segmentText from "../utils/segmentText.js";
const { cloneSegments } = segmentText; // const cloneSegments  = segmentText.cloneSegments;

/**
 * Manages per-document undo stacks.
 */
export default function useUndoHistory(activeId) {
  const [undoByDocId, setUndoByDocId] = useState({});

  const canUndo = (undoByDocId[activeId] || []).length > 0; //bool var-"is there somthing to undo from activeId's doc?"

  // this function happans everytime we delete or adding somthing!
  //  it adds to the stack and in this way we can undo it later.
  const pushUndoSnapshot = (docId, contentSnapshot) => {
    setUndoByDocId((u) =>
      undoMapAfterPush(u, docId, contentSnapshot, MAX_UNDO) // add to the stack 
    );
  };

  /**
   * Pop the most recent snapshot for the active document.
   */
  const popUndo = () => {
    
    //the POP!
    const popped = undoMapAfterPop(undoByDocId, activeId); // "popped" is a tuple: [stack after pop, what we poped]

    if (!popped) return null;
    setUndoByDocId(popped.undoByDocId); // change the stack to the new stack after the pop
    return cloneSegments(popped.restored); // return what we poped (we clone to avoid mutability issues)
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
