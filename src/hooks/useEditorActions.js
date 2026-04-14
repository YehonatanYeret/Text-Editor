import stringEdit from "../utils/stringEdit.js";
const { deleteLastWordInString } = stringEdit;
import keyboardTarget from "../utils/keyboardTarget.js";
const { runForKeyboardTarget } = keyboardTarget;
import segmentText from "../utils/segmentText.js";
const { segmentsAfterDeletingLastWord, replaceAllInSegments, segmentsEqual } = segmentText;
import docList from "../utils/docList.js";
const { findActiveDoc, mapActiveDocContent, appendCharToActiveDoc, removeLastCharFromActiveDoc } = docList;

/**
 * Composes the core editing actions (append, delete, undo, replace-all, …)
 * by orchestrating across documents, undo, find/replace, and keyboard-target hooks.
 *
 * This hook owns no state of its own — it wires together the state from the
 * other hooks and returns ready-to-use action callbacks.
 */
export default function useEditorActions({
  keyboardTarget,
  docs,
  setDocs,
  activeId,
  currentStyle,
  pushUndoSnapshot,
  popUndo,
  setFindQuery,
  setReplaceQuery,
  findQuery,
  replaceQuery,
}) {
  const appendCharacter = (char) => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => q + char),
      onReplace: () => setReplaceQuery((q) => q + char),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (doc) pushUndoSnapshot(activeId, doc.content); // add to the undo stack, now we able to undo this action later
        setDocs((prev) =>
          appendCharToActiveDoc(prev, activeId, char, currentStyle)
        );
      },
    });
  };

  const deleteCharacter = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => q.slice(0, -1)),
      onReplace: () => setReplaceQuery((q) => q.slice(0, -1)),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc || doc.content.length === 0) return;
        pushUndoSnapshot(activeId, doc.content); // add to the undo stack, now we able to undo this action later
        setDocs((prev) => removeLastCharFromActiveDoc(prev, activeId));
      },
    });
  };

  const deleteWord = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery((q) => deleteLastWordInString(q)),
      onReplace: () => setReplaceQuery((q) => deleteLastWordInString(q)),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc) return;
        const next = segmentsAfterDeletingLastWord(doc.content);
        if (next.length === doc.content.length) return;
        pushUndoSnapshot(activeId, doc.content); // add to the undo stack, now we able to undo this action later
        setDocs((prev) => mapActiveDocContent(prev, activeId, next));
      },
    });
  };

  const clearAllText = () => {
    runForKeyboardTarget(keyboardTarget, {
      onFind: () => setFindQuery(""),
      onReplace: () => setReplaceQuery(""),
      onDocument: () => {
        const doc = findActiveDoc(docs, activeId);
        if (!doc || doc.content.length === 0) return;
        pushUndoSnapshot(activeId, doc.content); // add to the undo stack, now we able to undo this action later
        setDocs((prev) => mapActiveDocContent(prev, activeId, []));
      },
    });
  };

  const undo = () => {
    const restored = popUndo();
    if (!restored) return;
    setDocs((prev) => mapActiveDocContent(prev, activeId, restored));
  };

  const replaceAllMatches = () => {
    if (!findQuery) return;
    const doc = findActiveDoc(docs, activeId);
    if (!doc) return;

    const next = replaceAllInSegments(
      doc.content,
      findQuery,
      replaceQuery,
      currentStyle
    );
    if (segmentsEqual(next, doc.content)) return;

    pushUndoSnapshot(activeId, doc.content); // add to the undo stack, now we able to undo this action later
    setDocs((prev) => mapActiveDocContent(prev, activeId, next));
  };

  return {
    appendCharacter,
    deleteCharacter,
    deleteWord,
    clearAllText,
    undo,
    replaceAllMatches,
  };
}
