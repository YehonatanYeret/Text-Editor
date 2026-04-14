const USER_RECORD_PREFIX = "user:";

function userRecordKey(username) {
  return `${USER_RECORD_PREFIX}${username}`;
}

function savedFileStorageKey(username, fileName) {
  return `${username}:${fileName}`;
}

function listSavedFileNames(username) {
  const prefix = `${username}:`;
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length));
}

function attemptLogin(username, password) {
  const key = userRecordKey(username);
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ password }));
    return { ok: true };
  }
  try {
    if (JSON.parse(stored).password === password) return { ok: true };
  } catch {
    /* ignore corrupt entry */
  }
  return { ok: false };
}

function saveDocumentWithPrompt(username, documentContent) {

  const names = listSavedFileNames(username); //get all the files the user has already saved from localStroage
  const message =
    names.length === 0
      ? `You don't have any saved files yet.\nEnter a name to save:`
      : `Your files: ${names.join(", ")}\nEnter a name to save:`;

  const name = window.prompt(message);
  if (name == null || name === "") return;

  if (names.includes(name)) {
    if (!window.confirm("A file with that name already exists. Overwrite?")) {
      return;
    }
  }

  localStorage.setItem(
    savedFileStorageKey(username, name),  //saved as "username:filename" in LocalStorage as the KEY
    JSON.stringify(documentContent) //the text we want to save as the VALUE
  );
  window.alert(`File "${name}" saved to your account.`);
}

function openDocumentWithPrompt(username) {
  const names = listSavedFileNames(username); //get all the files the user has already saved from localStroage
  if (names.length === 0) {
    window.alert("You don't have any saved files yet.");
    return null;
  }

  const name = window.prompt(
    `Your files: ${names.join(", ")}\nWhich one to open?`
  );
  if (name == null || name === "") return null;

  const raw = localStorage.getItem(savedFileStorageKey(username, name)); //the VALUE - the TEXT we saved under "username:filename" 
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default {
  userRecordKey,
  savedFileStorageKey,
  listSavedFileNames,
  attemptLogin,
  saveDocumentWithPrompt,
  openDocumentWithPrompt,
};
