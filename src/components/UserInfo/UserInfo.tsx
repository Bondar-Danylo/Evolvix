import styles from "./UserInfo.module.scss";
import userImage from "@/assets/user.png";

const UserInfo = () => {
  return (
    <div className={styles.user}>
      <img src={userImage} alt="User Image" className={styles.user__img} />
      <div className={styles.user__info}>
        <p className={styles.user__name}>Kateryna Bondar</p>
        <span className={styles.user__position}>Manager</span>
      </div>
    </div>
  );
};

export default UserInfo;
