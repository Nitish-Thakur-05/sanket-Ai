import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./history.module.css";
import HistoryDataContainer from "./HistoryDataContainer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";

import LoadingScreen from "../Loading/LoadingScreen";
import IncidentModal from "./IncidentModal";

const History = () => {
  const { commonData, setCommonData } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState("All");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const processIncidents = (rawList) => {
    return rawList
      .map((data) => {
        // Map Firestore fields to UI fields
        let type = "Safe";
        if (data.incident_detection === "Collision") type = "Collision";
        else if (data.incident_detection === "Near Collision")
          type = "Near Collision";

        // Format date
        const dateObj = new Date(data.timestamp);
        const formattedDate = dateObj.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          ...data, // Keep all raw data for modal
          id: data.id,
          type: type,
          title: data.incident_detection,
          description: data.caption || "No description",
          location: data.location_string || "Unknown location",
          date: formattedDate,
          rawDate: data.timestamp,
        };
      })
      .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Try to use common data first
      if (commonData && commonData.length > 0) {
        setIncidents(processIncidents(commonData));
        setLoading(false);
        return;
      }

      // 2. Fallback fetch
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

        setCommonData(filteredRaw);
        setIncidents(processIncidents(filteredRaw));
      } catch (error) {
        console.error("Firestore Fetch Error in History:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [commonData, setCommonData]);

  const filters = ["All", "💥 Collision", "⚠️ Near Collision", "✅ Safe"];

  const getFilterType = (filter) => {
    if (filter === "All") return "All";
    if (filter.includes("Collision")) return "Collision";
    if (filter.includes("Near Collision")) return "Near Collision";
    if (filter.includes("Safe")) return "Safe";
    return "All";
  };

  const filteredData = incidents.filter((item) => {
    if (activeFilter === "All") return true;
    return item.type === getFilterType(activeFilter);
  });

  if (loading) return <LoadingScreen message="Retrieving history..." />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Incidents</h1>
          <span className={styles.totalCount}>{filteredData.length} total</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.filterText}>Filter</span>
          <ArrowDropDownIcon style={{ fontSize: "20px" }} />
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
          filteredData.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              style={{ cursor: "pointer" }}
            >
              <HistoryDataContainer data={incident} />
            </div>
          ))
        ) : (
          <div className={styles.emptyMessage}>No incidents found.</div>
        )}
      </div>

      <IncidentModal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        data={selectedIncident}
      />
    </div>
  );
};

export default History;
