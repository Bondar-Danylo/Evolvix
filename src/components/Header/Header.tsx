import styles from "./Header.module.scss";
import { useLocation } from "react-router-dom";
import { type Location } from "react-router-dom";
import NotificationIcon from "@/assets/notification_icon.svg?react";
import LogoutIcon from "@/assets/logout_icon.svg?react";

const Header = () => {
  const location: Location = useLocation();

  const path: string = location.pathname.replace("/", "");

  const capitalized: string = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className={styles.header}>
      <span className={styles.breadcrums}>{capitalized}</span>
      <div className={styles.wrapper}>
        <div className={styles.notification}>
          <NotificationIcon className={styles.notification__icon} />
          <span className={styles.notification__count}>3</span>
        </div>
        <LogoutIcon className={styles.logout} />
      </div>
    </header>
  );
};

export default Header;
