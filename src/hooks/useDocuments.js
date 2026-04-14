import { useState } from "react";
import { createEmptyDocument } from "../constants/editor.js";
import {
  saveDocumentWithPrompt,
  openDocumentWithPrompt,
} from "../utils/userStorage.js";

/**
 * Manages the open-document tabs: list of docs, active tab,
 * plus create / open / save / close operations.
 */
export function useDocuments() {
  const [docs, setDocs] = useState(() => {
    const first = createEmptyDocument();
    return [first];
  });
  const [activeId, setActiveId] = useState(docs[0].id);

  // Derived
  const activeDoc = docs.find((d) => d.id === activeId) || docs[0];

  /** Create a blank tab and switch to it. */
  const createNewDoc = () => {
    const newDoc = createEmptyDocument();
    setDocs((prev) => [...prev, newDoc]);
    setActiveId(newDoc.id);
  };

  /** Prompt the user and save the active document to localStorage. */
  const saveFile = (currentUser) => {
    saveDocumentWithPrompt(currentUser, activeDoc.content);
  };

  /** Prompt the user, load a document from localStorage, and open it in a new tab. */
  const openFile = (currentUser) => {
    const content = openDocumentWithPrompt(currentUser);
    if (!content) return;
    const newDoc = { id: Date.now(), content };
    setDocs((prev) => [...prev, newDoc]);
    setActiveId(newDoc.id);
  };

  /**
   * Close a tab by id.
   * @param {number} id        - The document id to close.
   * @param {Function} saveFn  - Called when the user elects to save before closing.
   */
  const closeDoc = (id, saveFn) => {
    if (docs.length === 1) return;

    const closing = docs.find((doc) => doc.id === id);
    if (closing?.content.length > 0) {
      if (window.confirm("You want to save before closing?")) {
        saveFn();
      }
    }
    const newDocs = docs.filter((doc) => doc.id !== id);
    setDocs(newDocs);
    if (activeId === id) setActiveId(newDocs[0].id);
  };

  /** Reset to a single empty document (used on logout). */
  const resetDocs = () => {
    const fresh = createEmptyDocument();
    setDocs([fresh]);
    setActiveId(fresh.id);
  };

  return {
    docs,
    setDocs,
    activeId,
    setActiveId,
    activeDoc,
    createNewDoc,
    saveFile,
    openFile,
    closeDoc,
    resetDocs,
  };
}
