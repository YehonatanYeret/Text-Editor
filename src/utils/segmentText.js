/**
 * Word = last run of non-whitespace segments; `/u` catches unicode spaces, not just ASCII.
 */
function segmentsAfterDeletingLastWord(segments) {
  if (!segments.length) return segments;

  let end = segments.length - 1;
  while (end >= 0 && /\s/u.test(segments[end].char)) {
    end -= 1;
  }
  if (end < 0) return [];

  let start = end;
  while (start >= 0 && !/\s/u.test(segments[start].char)) {
    start -= 1;
  }
  return segments.slice(0, start + 1);
}

function segmentsToString(segments) {
  return segments.map((s) => s.char).join("");
}

function cloneSegments(segments) {
  return JSON.parse(JSON.stringify(segments));
}

function segmentsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Non-overlapping left-to-right scan (same rule as replace). */
function countOccurrencesInString(text, query) {
  if (!query) return 0;
  let n = 0;
  let i = 0;
  while (i <= text.length - query.length) {
    if (text.slice(i, i + query.length) === query) {
      n++;
      i += query.length;
    } else {
      i++;
    }
  }
  return n;
}

/** [start, end) string indices for highlighting the active document. */
function highlightRangesForQuery(text, query) {
  if (!query) return [];
  const ranges = [];
  let i = 0;
  while (i <= text.length - query.length) {
    if (text.slice(i, i + query.length) === query) {
      ranges.push([i, i + query.length]);
      i += query.length;
    } else {
      i++;
    }
  }
  return ranges;
}

function segmentOverlapsHighlightRanges(segStart, segEnd, ranges) {
  return ranges.some(([a, b]) => segEnd > a && segStart < b);
}

/**
 * Walks segments in lockstep with split pieces so emoji / multi-code-unit keys stay aligned.
 * Inserted characters copy the style of the first segment inside each match (fallback if empty).
 */
function replaceAllInSegments(segments, findStr, replaceStr, fallbackStyle) {
  if (!findStr) return segments;
  const full = segmentsToString(segments);
  if (!full.includes(findStr)) return segments;

  const chunks = full.split(findStr);
  const out = [];
  let segCursor = 0;

  for (let c = 0; c < chunks.length; c++) {
    const piece = chunks[c];
    let taken = 0;
    while (taken < piece.length) {
      const seg = segments[segCursor];
      if (!seg) return segments;
      const s = seg.char;
      if (!piece.startsWith(s, taken)) return segments;
      out.push({ char: seg.char, style: { ...seg.style } });
      taken += s.length;
      segCursor++;
    }

    if (c < chunks.length - 1) {
      const baseStyle = segments[segCursor]?.style || fallbackStyle;
      for (let j = 0; j < replaceStr.length; j++) {
        out.push({
          char: replaceStr[j],
          style: { ...baseStyle },
        });
      }
      let skip = findStr.length;
      while (skip > 0) {
        const seg = segments[segCursor];
        if (!seg) return segments;
        skip -= seg.char.length;
        segCursor++;
      }
    }
  }

  return out;
}

export default {
  segmentsAfterDeletingLastWord,
  segmentsToString,
  cloneSegments,
  segmentsEqual,
  countOccurrencesInString,
  highlightRangesForQuery,
  segmentOverlapsHighlightRanges,
  replaceAllInSegments,
};
