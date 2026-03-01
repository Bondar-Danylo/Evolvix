import type { JSX } from "react";
import styles from "./Button.module.scss";
import type { ButtonProps } from "./IButton.types";
import cn from "classnames";

const Button = ({
  type,
  color = "blue",
  size = "medium",
  children,
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={cn(styles.button, styles[size], styles[color])}
      type={type ?? "button"}
    >
      {children}
    </button>
  );
};

export default Button;
