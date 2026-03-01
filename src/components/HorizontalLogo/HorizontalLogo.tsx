import { Link } from "react-router-dom";
import styles from "./HorizontalLogo.module.scss";

const HorizontalLogo = () => {
  return (
    <Link to={"/dashboard"} className={styles.logo}>
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
