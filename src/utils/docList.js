export function findActiveDoc(docs, activeId) {
  return docs.find((d) => d.id === activeId);
}

export function mapActiveDocContent(docs, activeId, nextContent) {
  return docs.map((d) =>
    d.id === activeId ? { ...d, content: nextContent } : d
  );
}

export function appendCharToActiveDoc(docs, activeId, char, style) {
  return docs.map((d) =>
    d.id === activeId
      ? { ...d, content: [...d.content, { char, style: { ...style } }] }
      : d
  );
}

export function removeLastCharFromActiveDoc(docs, activeId) {
  return docs.map((d) =>
    d.id === activeId ? { ...d, content: d.content.slice(0, -1) } : d
  );
}
