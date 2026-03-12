import styles from "./DashboardLayout.module.scss";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import Aside from "@/components/Aside/Aside";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import alertIcon from "@/assets/attention-triangle_icon.svg";
import { useState } from "react";
import ChatBot from "@/components/ChatBot/ChatBot";

const DashboardLayout = ({ role }: any) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  const handleLogout = (): void => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={styles.wrapper}>
      <Aside role={role} />
      <div className={styles.content}>
        <Header
          togglePopup={() => setShowPopup(true)}
          openChatbot={() => setShowChatbot(true)}
        />
        <main className={styles.main}>
          <PageTitle>The Park Tower Knightsbridge</PageTitle>
          <Outlet />

          {showChatbot && (
            <ChatBot closeChatbot={(): void => setShowChatbot(false)} />
          )}
          {showPopup && (
            <SmallPopup
              icon={alertIcon}
              title="Would you like to logout?"
              subtitle="You will need to login again"
              text="This action cannot be undone"
              closePopup={(): void => setShowPopup(false)}
              onConfirm={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
