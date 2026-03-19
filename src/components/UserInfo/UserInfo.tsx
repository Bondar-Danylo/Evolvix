import { useState, useEffect } from "react";
import styles from "./UserInfo.module.scss";
import userImage from "@/assets/user.png";

const UserInfo = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    position: "",
    avatar: "",
  });

  const userId: string | null = sessionStorage.getItem("userID");
  const API_URL: string = import.meta.env.VITE_API_URL;

  useEffect((): void => {
    if (!userId) return;

    const fetchShortInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/get_user_profile.php?id=${userId}`);
        const result = await res.json();

        if (result.success) {
          const u = result.user;
          setUserData({
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "User",
            position: u.position || "Employee",
            avatar: u.avatar ? `${API_URL}/${u.avatar}` : "",
          });
        }
      } catch (error) {
        console.error("Error fetching user info for menu:", error);
      }
    };

    fetchShortInfo();
  }, [userId, API_URL]);

  return (
    <div className={styles.user}>
      <img
        src={userData.avatar || userImage}
        alt="User"
        className={styles.user__img}
      />
      <div className={styles.user__info}>
        <p className={styles.user__name}>{userData.name}</p>
        <span className={styles.user__position}>{userData.position}</span>
      </div>
    </div>
  );
};

export default UserInfo;
