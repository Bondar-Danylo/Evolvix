import styles from "./Aside.module.scss";
import ThemeToggler from "@/components/ThemeToggler/ThemeToggler";
import Menu from "@/components/Menu/Menu";
import UserInfo from "@/components/UserInfo/UserInfo";
import HorizontalLogo from "@/components/HorizontalLogo/HorizontalLogo";
import { useState } from "react";

const Aside = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    setShowMenu((prev: boolean) => !prev);
  };

  return (
    <aside className={`${styles.aside} ${showMenu ? styles.show : ""}`}>
      <div className={styles.aside__header}>
        <HorizontalLogo
          status={showMenu}
          onClickHandler={(e: React.MouseEvent<HTMLElement>) => toggleMenu(e)}
        />
      </div>
      <div className={styles.aside__main}>
        <nav className={styles.navigation}>
          <UserInfo />
          <Menu
            role="admin"
            onClickHandler={(e: React.MouseEvent<HTMLElement>) => toggleMenu(e)}
          />
        </nav>
        <ThemeToggler />
      </div>
    </aside>
  );
};

export default Aside;
