// this function executes everytime we do an action on the keyboard like add or remove
// it gets a STRING and A FUNCTION to execute for each case of the keyboard target (find, replace, or document)
function runForKeyboardTarget(target, { onFind, onReplace, onDocument }) {
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

export default {
  runForKeyboardTarget,
};
