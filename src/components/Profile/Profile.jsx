import React, { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CallIcon from "@mui/icons-material/Call";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import styles from "./profile.module.css";

import LoadingScreen from "../Loading/LoadingScreen";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const {
    commonData,
    setCommonData,
    currentUser: userProfile,
    setCurrentUser: setUserProfile,
    setLoadingContext: setGlobalLoading,
  } = useOutletContext();

  const [stats, setStats] = useState({
    total: 0,
    collisions: 0,
    nearMisses: 0,
    safe: 0,
  });
  const [lastIncident, setLastIncident] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState({
    name: "N/A",
    phone: "N/A",
  });
  const [loading, setLoading] = useState(true);

  const calculateInfo = (incidents) => {
    // 1. Calculate stats
    const collisions = incidents.filter(
      (i) => i.incident_detection === "Collision",
    );
    const nearMisses = incidents.filter(
      (i) => i.incident_detection === "Near Collision",
    );
    const safe = incidents.filter(
      (i) => i.incident_detection === "No Incident",
    );

    setStats({
      total: incidents.length,
      collisions: collisions.length,
      nearMisses: nearMisses.length,
      safe: safe.length,
    });

    // 2. Get last incident for location/time
    if (incidents.length > 0) {
      const sorted = [...incidents].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      setLastIncident(sorted[0]);

      // 3. Find latest collision with emergency info
      // User says: "emergency contact... is in doc incident... take only last collision data"
      const lastCollisionWithData = [...collisions]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .find(
          (c) =>
            c.emergency_name || c.emergency_phone || c.emergency_contact_1_name,
        );

      if (lastCollisionWithData) {
        setEmergencyContact({
          name:
            lastCollisionWithData.emergency_name ||
            lastCollisionWithData.emergency_contact_1_name ||
            "N/A",
          phone:
            lastCollisionWithData.emergency_phone ||
            lastCollisionWithData.emergency_contact_1_phone ||
            "N/A",
        });
      }
    }
  };

  useEffect(() => {
    const processProfileData = async () => {
      // 1. Check if we already have EVERYTHING from Dashboard
      if (userProfile && commonData && commonData.length > 0) {
        calculateInfo(commonData);
        setLoading(false);
        return;
      }

      // 2. Fallback: If data is missing (e.g. direct link or refresh)
      setLoading(true);
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setLoading(false);
          return;
        }

        let currentProfile = userProfile;
        let currentIncidents = commonData;

        // Fetch user profile if missing
        if (!currentProfile) {
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", userEmail));
          const userSnap = await getDocs(userQuery);

          if (!userSnap.empty) {
            currentProfile = userSnap.docs[0].data();
            setUserProfile(currentProfile);
          } else {
            setLoading(false);
            return;
          }
        }

        // Fetch incidents if missing
        if (!currentIncidents || currentIncidents.length === 0) {
          const incidentSnap = await getDocs(collection(db, "incidents"));
          currentIncidents = incidentSnap.docs
            .filter((doc) =>
              doc.id
                .toLowerCase()
                .startsWith(currentProfile.username.toLowerCase()),
            )
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setCommonData(currentIncidents);
        }

        calculateInfo(currentIncidents);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    processProfileData();
  }, [commonData, userProfile, setCommonData, setUserProfile]);

  if (loading) return <LoadingScreen message="Loading profile..." />;
  if (!userProfile)
    return <div className={styles.error}>User profile not found.</div>;

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    const date = new Date(ts);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        {/* Warning Note */}
        <div className={styles.warningNote}>
          <WarningAmberIcon className={styles.warningIcon} />
          <p className={styles.warningText}>
            Please use our mobile app to edit your profile settings
          </p>
        </div>

        {/* Header Profile Card */}
        <div className={styles.headerCard}>
          <div className={styles.avatar}>
            {userProfile.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className={styles.name}>{userProfile.username || "User"}</div>
          <div className={styles.subtitle}>SanketAI User</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.valIncidents}`}>
            {stats.total}
          </div>
          <div className={styles.statLabel}>Total Trips</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.valCollisions}`}>
            {stats.collisions}
          </div>
          <div className={styles.statLabel}>Collisions</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.valSafe}`}>
            {stats.safe}
          </div>
          <div className={styles.statLabel}>Safe</div>
        </div>
      </div>

      {/* User Info Section */}
      <div className={styles.listCard}>
        <div className={styles.listHeader}>User Info</div>

        <div className={styles.listItem}>
          <div className={`${styles.itemIcon} ${styles.iconBlue}`}>
            <PersonIcon className={styles.muiIcon} />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemTitle}>Username</div>
            <div className={styles.itemSubtitle}>{userProfile.username}</div>
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={`${styles.itemIcon} ${styles.iconRed}`}>
            <RoomIcon className={styles.muiIcon} />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemTitle}>Last Location</div>
            <div className={styles.itemSubtitle}>
              {lastIncident?.location_string || "No location data"}
            </div>
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={`${styles.itemIcon} ${styles.iconGray}`}>
            <ScheduleIcon className={styles.muiIcon} />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemTitle}>Last Incident</div>
            <div className={styles.itemSubtitle}>
              {formatTimestamp(lastIncident?.timestamp)}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      {emergencyContact.name !== "N/A" && (
        <div className={styles.listCard}>
          <div className={styles.listHeader}>Emergency Contacts</div>

          <div className={styles.listItem}>
            <div className={`${styles.itemIcon} ${styles.iconBlue}`}>
              <PersonIcon className={styles.muiIcon} />
            </div>
            <div className={styles.itemContent}>
              <div className={styles.itemSubtitle}>{emergencyContact.name}</div>
              <div className={styles.itemTitle}>Contact Name</div>
            </div>
          </div>

          <div className={styles.listItem}>
            <div className={`${styles.itemIcon} ${styles.iconGreen}`}>
              <CallIcon className={styles.muiIcon} />
            </div>
            <div className={styles.itemContent}>
              <div className={styles.itemSubtitle}>
                {emergencyContact.phone}
              </div>
              <div className={styles.itemTitle}>Contact Number</div>
            </div>
          </div>
        </div>
      )}

      {/* App Info Section */}
      <div className={styles.listCard}>
        <div className={styles.listHeader}>App Info</div>

        <div className={styles.listItem}>
          <div className={styles.itemContent}>
            <div className={styles.itemSubtitle}>Version</div>
          </div>
          <div className={styles.itemRight} style={{ color: "#111827" }}>
            1.0.0
          </div>
        </div>

        <div className={styles.listItem}>
          <div className={styles.itemContent}>
            <div className={styles.itemSubtitle}>Firebase</div>
          </div>
          <div className={styles.itemRight}>
            <CheckBoxIcon className={styles.muiIcon} /> Connected
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
