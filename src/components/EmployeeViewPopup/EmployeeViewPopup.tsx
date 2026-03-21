import styles from "./EmployeeViewPopup.module.scss";
import closeIcon from "@/assets/close_icon.svg";
import Button from "@/components/Button/Button";
import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";
import defaultAvatar from "@/assets/user.png";

const EmployeeViewPopup = ({ employee, closePopup }: any) => {
  const dateToUse = employee.start_date;

  const getTenureInfo = (dateString: string | undefined) => {
    if (!dateString)
      return { tenureText: "Not started", status: "N/A", statusClass: "" };

    const start: Date = new Date(dateString);
    const now: Date = new Date();

    if (isNaN(start.getTime()))
      return { tenureText: "Invalid date", status: "Error", statusClass: "" };

    if (start > now)
      return {
        tenureText: "Future hire",
        status: "Upcoming",
        statusClass: styles.upcoming,
      };

    const diffTime: number = Math.abs(now.getTime() - start.getTime());
    const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let status: string = "Senior";
    let statusClass: string = styles.senior;

    if (diffDays <= 7) {
      status = "Onboarding";
      statusClass = styles.onboarding;
    } else if (diffDays <= 180) {
      status = "New Employee";
      statusClass = styles.newbie;
    }

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }

    const yText: string = years > 0 ? `${years}y` : "";
    const mText: string = months > 0 ? `${months}m` : "";
    const tenureText: string = `${yText} ${mText}`.trim() || `${diffDays}d`;

    return { tenureText, status, statusClass };
  };

  const info = getTenureInfo(dateToUse);

  const API_URL: string = import.meta.env.VITE_API_URL;
  const avatarSrc: string = employee.photo_url
    ? `${API_URL}/${employee.photo_url}`
    : defaultAvatar;

  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button onClick={closePopup} className={styles.closeBtn}>
          <img src={closeIcon} alt="close" />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <img src={avatarSrc} alt="profile" />
            <span className={`${styles.statusBadge} ${info.statusClass}`}>
              {info.status}
            </span>
          </div>
          <div className={styles.mainInfo}>
            <h2>
              {employee.first_name} {employee.last_name}
            </h2>
            <p className={styles.position}>{employee.position}</p>
            <span className={styles.tag}>{employee.department}</span>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span>Experience</span>
            <strong>{info.tenureText}</strong>
            <small>
              Joined:{" "}
              {dateToUse ? new Date(dateToUse).toLocaleDateString() : "—"}
            </small>
          </div>

          <div className={styles.card}>
            <span>Training Progress</span>
            <div className={styles.progressBox}>
              <ProgressCircle
                value={Number(employee.trainingsProgress || 0)}
                size={35}
              />
              <strong>{employee.trainingsProgress || 0}%</strong>
            </div>
            <small>Completed tasks</small>
          </div>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <span>Contact Details</span>
            <div className={styles.contactRow}>
              <strong>{employee.phone || "No phone"}</strong>
              <div className={styles.divider} />
              <strong>{employee.email}</strong>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <Button color="light" type="button" onClick={closePopup}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeViewPopup;
