import RoomIcon from "@mui/icons-material/Room";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./alerts.module.css";

const AlertsDataContainer = ({ data }) => {
  const isHigh = data.severity === "HIGH";
  const isCollision = data.type === "Collision";
  const isSafe = data.type === "Safe";

  return (
    <div className={styles.alertCard}>
      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <div className={styles.alertIcon}>
            {isCollision ? "💥" : isSafe ? "✅" : "⚠️"}
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.alertTitle}>{data.title}</div>
            <div className={styles.alertTime}>{data.time}</div>
          </div>
        </div>
        <div
          className={`${styles.severityTag} ${
            data.severity === "High"
              ? styles.severityHigh
              : data.severity === "Safe"
                ? styles.severitySafe
                : styles.severityMedium
          }`}
        >
          {data.severity}
        </div>
      </div>

      <div className={styles.cardMiddle}>{data.description}</div>

      <div className={styles.cardBottom}>
        <div className={styles.infoRow}>
          <RoomIcon className={`${styles.infoIcon} ${styles.iconRed}`} />
          {data.location}
        </div>
        <div className={styles.infoRow}>
          <PersonIcon className={`${styles.infoIcon} ${styles.iconBlue}`} />
          {data.user}
        </div>
      </div>
    </div>
  );
};

export default AlertsDataContainer;
