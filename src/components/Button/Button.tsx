import type { JSX } from "react";
import styles from "./Button.module.scss";
import type { ButtonProps } from "./IButton.types";
import cn from "classnames";

const Button = ({
  type,
  color = "blue",
  size = "medium",
  textSize = "upper",
  children,
  onClick,
}: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={cn(
        styles.button,
        styles[size],
        styles[color],
        styles[textSize],
      )}
      type={type ?? "button"}
    >
      {children}
    </button>
  );
};

export default Button;
