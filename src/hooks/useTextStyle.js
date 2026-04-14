import { useState } from "react";
import { DEFAULT_TEXT_STYLE } from "../constants/editor.js";

/**
 * Manages the current text-formatting style (font size, color, font family).
 */
export function useTextStyle() {
  const [currentStyle, setCurrentStyle] = useState(() => ({
    ...DEFAULT_TEXT_STYLE,
  }));

  const setFontSize = (fontSize) =>
    setCurrentStyle((prev) => ({ ...prev, fontSize }));

  const setColor = (color) =>
    setCurrentStyle((prev) => ({ ...prev, color }));

  const setFontFamily = (fontFamily) =>
    setCurrentStyle((prev) => ({ ...prev, fontFamily }));

  return { currentStyle, setFontSize, setColor, setFontFamily };
}
