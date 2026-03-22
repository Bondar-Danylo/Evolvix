import { useRef, useState, useEffect, useMemo } from "react";
import styles from "./ProfilePageLayout.module.scss";
import userImg from "@/assets/user.png";
import UploadIcon from "@/assets/upload_icon.svg?react";
import checkedIcon from "@/assets/check_icon.svg";
import attentionIcon from "@/assets/attention-triangle_icon.svg";
import ContactInput from "@/components/ContactInput/ContactInput";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import adIcon from "@/assets/ad_icon.svg";
import phoneIcon from "@/assets/padlock_icon.svg";
import padlockIcon from "@/assets/phone_icon.svg";
import type { IRole } from "@/components/Menu/IRole.types";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage/EmployeeProfilePage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";

const ProfilePageLayout = ({ role }: IRole) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    name: "Loading...",
    position: "",
    startDate: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
  });

  const [originalData, setOriginalData] = useState<typeof userData | null>(
    null,
  );
  const [pendingUpdate, setPendingUpdate] = useState<{
    field: string;
    value: string;
    label: string;
  } | null>(null);

  const userId: string | null = sessionStorage.getItem("userID");
  const API_URL: string = import.meta.env.VITE_API_URL;

  const onboarding = useMemo(() => {
    if (!userData.startDate || userData.startDate === "Not started") {
      return { isCompleted: false, label: "Onboarding" };
    }

    const start: Date = new Date(userData.startDate);
    const now: Date = new Date();

    const diffTime: number = now.getTime() - start.getTime();
    const diffDays: number = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 7
      ? { isCompleted: true, label: "Completed Onboarding" }
      : { isCompleted: false, label: "Onboarding" };
  }, [userData.startDate]);

  const fetchProfile = async (): Promise<void> => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/get_user_profile.php?id=${userId}`);
      const result = await res.json();

      if (result.success) {
        const u = result.user;
        const avatarPath = u.avatar ? `${API_URL}/${u.avatar}` : "";
        const loadedData = {
          name:
            `${u.first_name || ""} ${u.last_name || ""}`.trim() || "No Name",
          position: u.position || "Employee",
          startDate: u.start_date || "Not started",
          email: u.email || "",
          phone: u.phone || "",
          password: "********",
          avatar: avatarPath,
        };
        setUserData(loadedData);
        setOriginalData(loadedData);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect((): void => {
    fetchProfile();
  }, [userId]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("id", userId);
    formData.append("avatar", file);

    try {
      const res = await fetch(`${API_URL}/upload_avatar.php`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          avatar: `${API_URL}/${result.avatar_url}`,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const requestUpdate = (
    field: string,
    newValue: string,
    label: string,
  ): void => {
    if (!originalData) return;
    const isChanged = (originalData as any)[field] !== newValue;
    if (isChanged && newValue !== "********" && newValue.trim() !== "") {
      setPendingUpdate({ field, value: newValue, label });
    } else if (newValue === "" || newValue === "********") {
      setUserData({ ...userData, [field]: (originalData as any)[field] });
    }
  };

  const confirmUpdate = async (): Promise<void> => {
    if (!pendingUpdate || !userId) return;
    try {
      const response = await fetch(`${API_URL}/update_user_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          field: pendingUpdate.field,
          value: pendingUpdate.value,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setOriginalData({ ...userData });
      } else if (originalData) {
        setUserData(originalData);
      }
    } catch (error) {
      console.error("Update error:", error);
      if (originalData) setUserData(originalData);
    } finally {
      setPendingUpdate(null);
    }
  };

  const cancelUpdate = (): void => {
    if (originalData) setUserData(originalData);
    setPendingUpdate(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.photo}>
          <img
            src={preview || userData.avatar || userImg}
            alt="User avatar"
            className={styles.photo__image}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            className={styles.photo__upload}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon /> <span>Upload Photo</span>
          </button>
        </div>

        <div className={styles.info}>
          <h3 className={styles.info__name}>{userData.name}</h3>
          <p className={styles.info__position}>{userData.position}</p>
          <p className={styles.info__started}>
            Worked from {userData.startDate}
          </p>

          <div className={styles.info__status}>
            <img
              src={onboarding.isCompleted ? checkedIcon : attentionIcon}
              alt="Status"
            />
            <span
              style={{ color: onboarding.isCompleted ? "#27AE60" : "#F2994A" }}
            >
              {onboarding.label}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contacts}>
        <ContactInput
          type="email"
          value={userData.email}
          icon={adIcon}
          onChange={(val) => setUserData({ ...userData, email: val })}
          onBlur={() => requestUpdate("email", userData.email, "Email")}
        />
        <ContactInput
          type="phone"
          value={userData.phone}
          icon={phoneIcon}
          onChange={(val) => setUserData({ ...userData, phone: val })}
          onBlur={() => requestUpdate("phone", userData.phone, "Phone Number")}
        />
        <ContactInput
          type="password"
          value={userData.password}
          icon={padlockIcon}
          onChange={(val) => setUserData({ ...userData, password: val })}
          onBlur={() =>
            requestUpdate("password", userData.password, "Password")
          }
        />
      </div>

      {pendingUpdate && (
        <SmallPopup
          icon={attentionIcon}
          title={`Update ${pendingUpdate.label}`}
          subtitle={`Are you sure you want to change your ${pendingUpdate.label.toLowerCase()}?`}
          text="You may need to use new credentials to log in."
          closePopup={cancelUpdate}
          onConfirm={confirmUpdate}
        />
      )}

      {role === "user" ? <EmployeeProfilePage /> : <ProfilePage />}
    </div>
  );
};

export default ProfilePageLayout;
