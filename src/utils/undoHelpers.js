import segmentText from "./segmentText.js";
const { cloneSegments } = segmentText;

// adding to the stack after we do some change in the text (add or delete)
function undoMapAfterPush(undoByDocId, docId, contentSnapshot, maxUndo) {
  // "undoByDocId" is the map, looks like it -> {KEY: docId,
  //                                             VALUE: [snapshot1, snapshot2,...]}
  // we add the new snapshot to the end of the stack 
  // if the stack is longer than maxUndo we remove the oldest one (the first one)
  const stack = [
    ...(undoByDocId[docId] || []),
    cloneSegments(contentSnapshot), // copy to avoid reference issues
    ].slice(-maxUndo); 
  return { ...undoByDocId, [docId]: stack }; // return the upadted stack
}

// THE POP FUNCTION!
function undoMapAfterPop(undoByDocId, docId) {
  const stack = undoByDocId[docId] || [];
  if (stack.length === 0) return null;
  const restored = stack[stack.length - 1];
// if text is ABC after we just added C -> in the stack we have [A,AB].
// in "undoByDocId" we have the remaining stack AFTER the pop - [A]
// in the "restored" we have what we popped - AB
  return { 
    undoByDocId: { ...undoByDocId, [docId]: stack.slice(0, -1) },
    restored,    
  };
}

function undoMapWithoutDoc(undoByDocId, docId) { // when we close a doc we want to remove its stack from the map
  const newMap = { ...undoByDocId };
  delete newMap[docId];
    return newMap;
}

export default {
  undoMapAfterPush,
  undoMapAfterPop,
  undoMapWithoutDoc,
};