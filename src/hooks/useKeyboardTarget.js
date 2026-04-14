import { useState } from "react";

/**
 * Manages which input field receives virtual-keyboard input:
 * "document" | "find" | "replace".
 */
export default function useKeyboardTarget() {
  const [keyboardTarget, setKeyboardTarget] = useState("document");

  // this functions are used as 'onFocus' in FindReplacePanel to change the target to the right one.
  const setTargetDocument = () => setKeyboardTarget("document");
  const setTargetFind = () => setKeyboardTarget("find");
  const setTargetReplace = () => setKeyboardTarget("replace");

  /** Reset to "document" (used on logout / new doc / open). */
  const resetKeyboardTarget = () => setKeyboardTarget("document");

  return {
    keyboardTarget,
    setTargetDocument,
    setTargetFind,
    setTargetReplace,
    resetKeyboardTarget,
  };
}
