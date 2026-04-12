export function deleteLastWordInString(s) {
  return s.trimEnd().replace(/\S+\s*$/, "");
}
