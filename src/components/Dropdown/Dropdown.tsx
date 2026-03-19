import { useState, useEffect } from "react";
import styles from "./Dropdown.module.scss";
import type { IDropdown } from "./IDropdown.types";
import ChevronIcon from "@/assets/chevron_icon.svg?react";

const Dropdown = ({ options: initialOptions, value, onChange }: IDropdown) => {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const toggleDropdown = (): void => setIsOpen((prev: boolean) => !prev);

  const selectItem = (itemValue: string): void => {
    onChange(itemValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex !== -1) {
          if (focusedIndex === 0) selectItem("");
          else selectItem(options[focusedIndex - 1]);
        } else {
          toggleDropdown();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        // +1 учитывая пункт "All"
        setFocusedIndex((prev) => (prev < options.length ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length));
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      className={styles.dropdown}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setIsOpen(false)}
    >
      <div className={styles.dropdown__top} onClick={toggleDropdown}>
        <span className={styles.dropdown__selected}>{value || "All"}</span>
        <ChevronIcon
          className={`${styles.dropdown__arrow} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      <div
        className={`${styles.dropdown__body} ${isOpen ? styles.active : ""}`}
      >
        <ul className={styles.dropdown__list}>
          <li
            className={`${styles.dropdown__item} ${focusedIndex === 0 ? styles.isFocused : ""} ${!value ? styles.selected : ""}`}
            onClick={() => selectItem("")}
            onMouseEnter={() => setFocusedIndex(0)}
          >
            <span className={styles.dropdown__option}>All</span>
          </li>

          {options.map((item, index) => {
            const actualIndex = index + 1;
            return (
              <li
                key={`${item}-${index}`}
                className={`${styles.dropdown__item} ${
                  focusedIndex === actualIndex ? styles.isFocused : ""
                } ${value === item ? styles.selected : ""}`}
                onClick={(): void => selectItem(item)}
                onMouseEnter={(): void => setFocusedIndex(actualIndex)}
              >
                <span className={styles.dropdown__option}>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
