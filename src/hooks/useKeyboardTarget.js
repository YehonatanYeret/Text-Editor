import { useState } from "react";

/**
 * Manages which input field receives virtual-keyboard input:
 * "document" | "find" | "replace".
 */
export default function useKeyboardTarget() {
  const [keyboardTarget, setKeyboardTarget] = useState("document");

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
