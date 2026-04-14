/**
 * Word = last run of non-whitespace segments; `/u` catches unicode spaces, not just ASCII.
 */
function segmentsAfterDeletingLastWord(segments) {
  if (!segments.length) return segments;

  //remove the whitespace at the end
  let end = segments.length - 1;
  while (end >= 0 && /\s/u.test(segments[end].char)) {
    end -= 1;
  }
  if (end < 0) return [];

  // go until the start of the last word
  let start = end;
  while (start >= 0 && !/\s/u.test(segments[start].char)) {
    start -= 1;
  }
  // remove the last word and the whitespace before it, if any and return the rest
  return segments.slice(0, start + 1);
}

// Joins segments into a string  | ({char:a,char:b} -> "ab") 
function segmentsToString(segments) {
  return segments.map((s) => s.char).join("");
}


function cloneSegments(segments) {
  return JSON.parse(JSON.stringify(segments));
}


function segmentsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}


//COUNT how many times does "query" appear in "text"? Non-overlapping
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

// Returns [[start,end],...] for each match of query in text. Non-overlapping, in order.
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

// Gets ranges of query and checks if the segment overlaps with any of them.
function segmentOverlapsHighlightRanges(segStart, segEnd, ranges) {
  return ranges.some(([a, b]) => segEnd > a && segStart < b);
}

/**
 * target of this method: 
 * - find all occurrences of "findStr" in "segments" and replace them with "replaceStr", 
 */
function replaceAllInSegments(segments, findStr, replaceStr, fallbackStyle) {
  if (!findStr) return segments; // nothing to find
  const full = segmentsToString(segments);
  if (!full.includes(findStr)) return segments; // we didn't found the string in "segments"

   // split the full string into chunks that are separated by "findStr".
   // For example, if full = "abcdeabc" and findStr = "bc", then chunks = ["a", "dea", ""]
  const chunks = full.split(findStr);
  const out = [];
  let segCursor = 0;

  // takes letter after letter from the strings in "chunks" and matches them with the segments in "segments".
  // ["a", "dea", ""] -> {char: "a", style: ...}, {char: "d", style: ...}, {char: "e", style: ...}, {char: "a", style: ...}
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
      const baseStyle = segments[segCursor]?.style || fallbackStyle; // takes the style from the other segments
      for (let j = 0; j < replaceStr.length; j++) { // adds the replaceStr with the style
        out.push({
          char: replaceStr[j],
          style: { ...baseStyle },
        });
      }
      // skip the "findStr" in the segments, because we already added "replaceStr" instead of it
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
