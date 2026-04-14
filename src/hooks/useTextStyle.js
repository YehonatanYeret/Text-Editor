import { useState } from "react";
import editor from "../constants/editor.js";
const { DEFAULT_TEXT_STYLE } = editor;

/**
 * Manages the current text-formatting style (font size, color, font family).
 */
export default function useTextStyle() {
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
