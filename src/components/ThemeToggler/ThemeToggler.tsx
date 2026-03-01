import { useState } from "react";
import styles from "./ThemeToggler.module.scss";
import sunIcon from "@/assets/sun_icon.png";
import moonIcon from "@/assets/moon_icon.png";
import clsx from "clsx";

const ThemeToggler = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const themeIcons = {
    dark: moonIcon,
    light: sunIcon,
  };

  const handleClick = (): void => {
    setTheme((prev) => {
      return prev === "dark" ? "light" : "dark";
    });
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        styles.toggler,
        theme === "dark" ? styles.toggler__dark : styles.toggler__light,
      )}
    >
      <div
        className={clsx(
          styles.toggler__circle,
          theme === "dark" ? styles.toggler__light : styles.toggler__dark,
        )}
      >
        <img
          src={themeIcons[theme]}
          alt="Theme Icon"
          className={styles.toggler__icon}
        />
      </div>
    </button>
  );
};

export default ThemeToggler;
