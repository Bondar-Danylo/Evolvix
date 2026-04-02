import { useState, useEffect } from "react";

export const useTableNavigation = (dataLength: number, onEnter?: (index: number) => void) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dataLength === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev < dataLength - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : dataLength - 1));
          break;
        case "Escape":
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dataLength, focusedIndex, onEnter]);

  return { focusedIndex, setFocusedIndex };
};