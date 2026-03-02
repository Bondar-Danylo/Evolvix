import { useState } from "react";
import styles from "./Dropdown.module.scss";
import type { IDropdown } from "./IDropdown.types";
import ChevronIcon from "@/assets/chevron_icon.svg?react";
import DeleteIcon from "@/assets/delete_icon.svg?react";

const Dropdown = ({ options: initialOptions, editable }: IDropdown) => {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [selectedValue, setSelectedValue] = useState<string>(options[0] || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const toggleDropdown = (): void => setIsOpen((prev: boolean) => !prev);

  const selectItem = (value: string): void => {
    setSelectedValue(value);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // Delete Feature
  const deleteItem = (e: React.MouseEvent, indexToDelete: number): void => {
    e.stopPropagation();

    const itemToDelete = options[indexToDelete];
    const newOptions = options.filter((_, index) => index !== indexToDelete);

    setOptions(newOptions);

    if (selectedValue === itemToDelete) {
      setSelectedValue(newOptions.length > 0 ? newOptions[0] : "");
    }
    setFocusedIndex(-1);
  };

  //   Keyboard navigation Feature
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex !== -1) {
          selectItem(options[focusedIndex]);
        } else {
          toggleDropdown();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
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
        <span className={styles.dropdown__selected}>
          {selectedValue || "Select Value"}
        </span>
        <ChevronIcon
          className={`${styles.dropdown__arrow} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      <div
        className={`${styles.dropdown__body} ${isOpen ? styles.active : ""}`}
      >
        <ul className={styles.dropdown__list}>
          {options.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className={`${styles.dropdown__item} ${
                focusedIndex === index ? styles.focused : ""
              }`}
              onClick={(): void => selectItem(item)}
              onMouseEnter={(): void => setFocusedIndex(index)}
            >
              <span className={styles.dropdown__option}>{item}</span>

              {editable && (
                <DeleteIcon
                  className={styles.dropdown__delete}
                  onClick={(e: React.MouseEvent<SVGSVGElement>): void =>
                    deleteItem(e, index)
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
