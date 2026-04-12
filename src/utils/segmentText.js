/**
 * Removes the last “word” as a suffix of segments: skips trailing whitespace, then drops
 * the final run of non-whitespace characters (works for English, Hebrew, and emoji keys).
 */
export function segmentsAfterDeletingLastWord(segments) {
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
