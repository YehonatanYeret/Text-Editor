function findActiveDoc(docs, activeId) {
  return docs.find((d) => d.id === activeId);
}

function mapActiveDocContent(docs, activeId, nextContent) {
  return docs.map((d) =>
    d.id === activeId ? { ...d, content: nextContent } : d
  );
}

function appendCharToActiveDoc(docs, activeId, char, style) {
  return docs.map((d) =>
    d.id === activeId
      ? { ...d, content: [...d.content, { char, style: { ...style } }] }
      : d
  );
}

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
