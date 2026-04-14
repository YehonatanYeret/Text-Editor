import segmentText from "./segmentText.js";
const { cloneSegments } = segmentText;

function undoMapAfterPush(undoByDocId, docId, contentSnapshot, maxUndo) {
  const stack = [
    ...(undoByDocId[docId] || []),
    cloneSegments(contentSnapshot),
  ].slice(-maxUndo);
  return { ...undoByDocId, [docId]: stack };
}

function undoMapAfterPop(undoByDocId, docId) {
  const stack = undoByDocId[docId] || [];
  if (stack.length === 0) return null;
  const restored = stack[stack.length - 1];
  return {
    undoByDocId: { ...undoByDocId, [docId]: stack.slice(0, -1) },
    restored,
  };
}

function undoMapWithoutDoc(undoByDocId, docId) {
  const { [docId]: _removed, ...rest } = undoByDocId;
  return rest;
}

export default {
  undoMapAfterPush,
  undoMapAfterPop,
  undoMapWithoutDoc,
};