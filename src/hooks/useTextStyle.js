import { useState } from "react";
import editor from "../constants/editor.js";
const { DEFAULT_TEXT_STYLE } = editor; // const DEFAULT_TEXT_STYLE = editor.DEFAULT_TEXT_STYLE;

/**
 * Manages the current text-formatting style (font size, color, font family).
 */
export default function useTextStyle() {
  const [currentStyle, setCurrentStyle] = useState(() => ({
    ...DEFAULT_TEXT_STYLE,
  }));

  // we have something like this -> {fontSize: 16, color: "black", fontFamily: "Arial"}
  // each of these functions updates a specific property of the current style,
  //  while keeping the other properties unchanged.

  const setFontSize = (fontSize) =>
    setCurrentStyle((prev) => ({ ...prev, fontSize }));

  const setColor = (color) =>
    setCurrentStyle((prev) => ({ ...prev, color }));

  const setFontFamily = (fontFamily) =>
    setCurrentStyle((prev) => ({ ...prev, fontFamily }));

  return { currentStyle, setFontSize, setColor, setFontFamily };
}
