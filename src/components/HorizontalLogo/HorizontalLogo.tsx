import { Link } from "react-router-dom";
import styles from "./HorizontalLogo.module.scss";
import MenuIcon from "@/assets/menu_icon.svg?react";

const HorizontalLogo = ({ status, onClickHandler }: any) => {
  return (
    <Link to={"/dashboard"} className={styles.logo}>
      <MenuIcon
        className={`${styles.menu} ${status ? styles.rotate : ""}`}
        onClick={onClickHandler}
      />
      <img
        src="/logo_white.png"
        alt="Logo Icon"
        className={styles.logo__icon}
      />
      <p className={styles.logo__text}>Evolvix</p>
    </Link>
  );
};

export default HorizontalLogo;
