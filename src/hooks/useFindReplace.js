import { useState } from "react";
import {
  countOccurrencesInString,
  segmentsToString,
} from "../utils/segmentText.js";

/**
 * Manages find / replace query strings and the derived match count.
 *
 * @param {Object} activeDoc - The currently-active document (needs `.content`).
 */
export function useFindReplace(activeDoc) {
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");

  const activeMatchCount = countOccurrencesInString(
    segmentsToString(activeDoc.content),
    findQuery
  );

  /** Clear both query fields (used on logout). */
  const resetFindReplace = () => {
    setFindQuery("");
    setReplaceQuery("");
  };

  return {
    findQuery,
    setFindQuery,
    replaceQuery,
    setReplaceQuery,
    activeMatchCount,
    resetFindReplace,
  };
}
