import styles from "./DashboardLayout.module.scss";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import Aside from "@/components/Aside/Aside";

const DashboardLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Aside />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          <PageTitle>The Park Tower Knightsbridge</PageTitle>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
