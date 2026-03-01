import type { JSX } from "react";
import styles from "./VerticalLogo.module.scss";

const VerticalLogo = (): JSX.Element => {
  return (
    <div className={styles.logo}>
      <img className={styles.logo__icon} src="/logo.png" alt="Logo" />
      <p className={styles.logo__text}>Evolvix</p>
    </div>
  );
};

export default VerticalLogo;
