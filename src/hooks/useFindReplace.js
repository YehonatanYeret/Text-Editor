import { useState } from "react";
import segmentText from "../utils/segmentText.js";
const { countOccurrencesInString, segmentsToString } = segmentText;

/**
 * Manages find / replace query strings and the derived match count.
 */
export default function useFindReplace(activeDoc) {
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");

  const activeMatchCount = countOccurrencesInString(segmentsToString(activeDoc.content) , findQuery);

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
