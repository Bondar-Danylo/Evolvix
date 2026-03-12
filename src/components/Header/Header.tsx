import styles from "./Header.module.scss";
import { useLocation } from "react-router-dom";
import { type Location } from "react-router-dom";
import ChatbotIcon from "@/assets/chatbot_icon.svg?react";
import LogoutIcon from "@/assets/logout_icon.svg?react";
import type { IHeaderProps } from "./IHeader.types";

const Header = ({ togglePopup, openChatbot }: IHeaderProps) => {
  const location: Location = useLocation();

  const path: string = location.pathname.replace("/", "");

  const capitalized: string = path.charAt(0).toUpperCase() + path.slice(1);

  const handleClick = (): void => {
    togglePopup();
  };

  return (
    <header className={styles.header}>
      <span className={styles.breadcrums}>{capitalized}</span>
      <div className={styles.wrapper}>
        <div className={styles.chatbot}>
          <ChatbotIcon className={styles.chatbot__icon} onClick={openChatbot} />
        </div>
        <LogoutIcon className={styles.logout} onClick={handleClick} />
      </div>
    </header>
  );
};

export default Header;
