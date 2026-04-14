// return doc with activeId
function findActiveDoc(docs, activeId) {
  return docs.find((d) => d.id === activeId);
}

// changes the ActiveId doc's content to nextContent, returns the full new docs array
function mapActiveDocContent(docs, activeId, nextContent) {
  return docs.map((d) =>
    d.id === activeId ? { ...d, content: nextContent } : d
  );
}

// changes the ActiveId doc's content to be with the new char appended in the given style.
function appendCharToActiveDoc(docs, activeId, char, style) {
  return docs.map((d) =>
    d.id === activeId
      ? { ...d, content: [...d.content, { char, style: { ...style } }] }
      : d
  );
}

// changes the ActiveId doc's content to be with the last char removed.
function removeLastCharFromActiveDoc(docs, activeId) {
  return docs.map((d) =>
    d.id === activeId ? { ...d, content: d.content.slice(0, -1) } : d
  );
}

export default {
  findActiveDoc,
  mapActiveDocContent,
  appendCharToActiveDoc,
  removeLastCharFromActiveDoc,
};
