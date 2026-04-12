export function runForKeyboardTarget(target, { onFind, onReplace, onDocument }) {
  if (target === "find") {
    onFind();
    return;
  }
  if (target === "replace") {
    onReplace();
    return;
  }
  onDocument();
}
