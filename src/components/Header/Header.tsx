import styles from "./Header.module.scss";
import { useLocation } from "react-router-dom";
import { type Location } from "react-router-dom";
import notificationIcon from "@/assets/notification_icon.svg";
import logoutIcon from "@/assets/logout_icon.svg";

const Header = () => {
  const location: Location = useLocation();

  const path: string = location.pathname.replace("/", "");

  const capitalized: string = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className={styles.header}>
      <span className={styles.breadcrums}>{capitalized}</span>
      <div className={styles.wrapper}>
        <div className={styles.notification}>
          <img
            src={notificationIcon}
            alt="Notification Bell Icon"
            className={styles.notification__icon}
          />
          <span className={styles.notification__count}>3</span>
        </div>
        <img
          src={logoutIcon}
          alt="Logout arrow icon"
          className={styles.logout}
        />
      </div>
    </header>
  );
};

export default Header;
