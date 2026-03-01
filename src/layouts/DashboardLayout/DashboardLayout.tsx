import HorizontalLogo from "@/components/HorizontalLogo/HorizontalLogo";
import styles from "./DashboardLayout.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "@/components/Menu/Menu";
import UserInfo from "@/components/UserInfo/UserInfo";
import Header from "@/components/Header/Header";
import ThemeToggler from "@/components/ThemeToggler/ThemeToggler";

const DashboardLayout = () => {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <div className={styles.aside__header}>
          <HorizontalLogo />
        </div>
        <nav className={styles.navigation}>
          <UserInfo />
          <Menu role={"admin"} />
        </nav>
        <ThemeToggler />
      </aside>
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
