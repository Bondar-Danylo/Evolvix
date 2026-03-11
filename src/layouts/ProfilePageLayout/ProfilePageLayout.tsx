import { useRef, useState } from "react";
import styles from "./ProfilePageLayout.module.scss";
import userImg from "@/assets/user.png";
import UploadIcon from "@/assets/upload_icon.svg?react";
import checkedIcon from "@/assets/check_icon.svg";
import ContactInput from "@/components/ContactInput/ContactInput";
import adIcon from "@/assets/ad_icon.svg";
import phoneIcon from "@/assets/phone_icon.svg";
import padlockIcon from "@/assets/padlock_icon.svg";
import type { IRole } from "@/components/Menu/IRole.types";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage/EmployeeProfilePage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";

const ProfilePageLayout = ({ role }: IRole) => {
  const data = {
    email: "kateryna@hotel.marriott",
    phone: "07312606268",
    password: "111111111",
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [email, setEmail] = useState<string>(data.email);
  const [phone, setPhone] = useState<string>(data.phone);
  const [password, setPassword] = useState<string>(data.password);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      console.log("File is ready:", file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.photo}>
          <img
            src={preview || userImg}
            alt="User Image"
            className={styles.photo__image}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <button className={styles.photo__upload} onClick={handleButtonClick}>
            <UploadIcon /> <span>Upload Photo</span>
          </button>
        </div>
        <div className={styles.info}>
          <h3 className={`${styles.info__name} ${styles.info__item}`}>
            Kateryna Bondar
          </h3>
          <p className={`${styles.info__position} ${styles.info__item}`}>
            Manager
          </p>
          <p className={`${styles.info__started} ${styles.info__item}`}>
            Worked from 05.02.2025
          </p>
          <div className={`${styles.info__status} ${styles.info__item}`}>
            <img src={checkedIcon} alt="Checkec Green Icon" />
            <span>Completed Onboarding</span>
          </div>
        </div>
      </div>
      <div className={styles.contacts}>
        <ContactInput
          type="email"
          value={email}
          icon={adIcon}
          onChange={setEmail}
        />
        <ContactInput
          type="phone"
          value={phone}
          icon={phoneIcon}
          onChange={setPhone}
        />
        <ContactInput
          type="password"
          value={password}
          icon={padlockIcon}
          onChange={setPassword}
        />
      </div>

      {role === "user" ? <EmployeeProfilePage /> : <ProfilePage />}
    </div>
  );
};

export default ProfilePageLayout;
