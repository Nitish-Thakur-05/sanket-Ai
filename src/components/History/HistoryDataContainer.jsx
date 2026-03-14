import RoomIcon from "@mui/icons-material/Room";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "./history.module.css";

const HistoryDataContainer = ({ data }) => {
  const isCollision = data.type === "Collision";
  const isNearCollision = data.type === "Near Miss";
  const isSafe = data.type === "Safe";

  return (
    <div className={styles.dataContainer}>
      <div
        className={styles.leftBar}
        style={{
          backgroundColor: isCollision
            ? "#fe4a5a"
            : isNearCollision
              ? "#facc15"
              : "#06d6a0",
        }}
      ></div>
      <div className={styles.iconWrapper}>
        {isCollision ? "💥" : isSafe ? "✅" : "⚠️"}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.description}>{data.description}</div>
        <div className={styles.location}>
          <RoomIcon
            style={{
              fontSize: "16px",
              color: "#ef4444",
              marginRight: "4px",
              verticalAlign: "middle",
            }}
          />
          {data.location}
        </div>
        <div className={styles.date}>{data.date}</div>
      </div>
      <div className={styles.arrowIcon}>
        <ChevronRightIcon />
      </div>
    </div>
  );
};

export default HistoryDataContainer;
