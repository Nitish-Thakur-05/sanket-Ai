import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import styles from "./alerts.module.css";
import AlertsDataContainer from "./AlertsDataContainer";
import LoadingScreen from "../Loading/LoadingScreen";

const Alerts = () => {
  const { commonData, setCommonData } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState("All");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapAlerts = (dataList) => {
    return dataList
      .map((data) => {
        // Map Firestore fields to UI fields
        let type = "Near Miss";
        if (data.incident_detection === "Collision") type = "Collision";
        if (data.incident_detection === "No Incident") type = "Safe";

        // Mapping severity based on incident type (High, Medium, Safe)
        let severity = "Medium";
        if (data.incident_detection === "Collision") severity = "High";
        if (data.incident_detection === "No Incident") severity = "Safe";

        // Time calculation (Relative time)
        const dateObj = new Date(data.timestamp);
        const now = new Date();
        const diffInHrs = Math.floor((now - dateObj) / (1000 * 60 * 60));
        const diffInMins = Math.floor((now - dateObj) / (1000 * 60));

        let timeStr = "";
        if (diffInHrs >= 24) {
          timeStr = dateObj.toLocaleDateString();
        } else if (diffInHrs >= 1) {
          timeStr = `${diffInHrs}h ago`;
        } else if (diffInMins >= 1) {
          timeStr = `${diffInMins}m ago`;
        } else {
          timeStr = "Just now";
        }

        return {
          id: data.id,
          type: type,
          severity: severity,
          title: data.incident_detection,
          time: timeStr,
          description: data.caption || "Potential safety incident detected.",
          location: data.location_string || "Unknown location",
          user: data.user_full_name || "User",
          rawDate: data.timestamp,
        };
      })
      .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  };

  useEffect(() => {
    const processData = async () => {
      // 1. Check if we already have data from Dashboard (Home)
      if (commonData && commonData.length > 0) {
        setAlerts(mapAlerts(commonData));
        setLoading(false);
        return;
      }

      // 2. Fallback: Fetch if someone lands directly on this page
      setLoading(true);
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setLoading(false);
          return;
        }

        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", userEmail));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          setLoading(false);
          return;
        }
        const userProfile = userSnap.docs[0].data();

        const incidentSnap = await getDocs(collection(db, "incidents"));
        const filteredRaw = incidentSnap.docs
          .filter((doc) =>
            doc.id.toLowerCase().startsWith(userProfile.username.toLowerCase()),
          )
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        // Update common context so other pages don't have to refetch
        setCommonData(filteredRaw);
        setAlerts(mapAlerts(filteredRaw));
      } catch (error) {
        console.error("Alerts Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    processData();
  }, [commonData, setCommonData]);

  const filters = ["All", "🔴 High", "🟠 Medium", "🟢 Safe"];

  const getFilterSeverity = (filter) => {
    if (filter === "All") return "All";
    if (filter.includes("High")) return "High";
    if (filter.includes("Medium")) return "Medium";
    if (filter.includes("Safe")) return "Safe";
    return "All";
  };

  const filteredData = alerts.filter((item) => {
    if (activeFilter === "All") return true;
    return item.severity === getFilterSeverity(activeFilter);
  });

  if (loading) return <LoadingScreen message="Fetching alerts..." />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Alerts</h1>
          <span className={styles.totalCount}>
            {filteredData.length} active
          </span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.liveButton}>LIVE</button>
        </div>
      </div>

      <div className={styles.filtersWrapper}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterChip} ${activeFilter === filter ? styles.activeChip : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.listContainer}>
        {filteredData.length > 0 ? (
          filteredData.map((alert) => (
            <AlertsDataContainer key={alert.id} data={alert} />
          ))
        ) : (
          <div className={styles.emptyMessage}>No active alerts found.</div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
