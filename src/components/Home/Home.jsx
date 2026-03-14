import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DownloadIcon from "@mui/icons-material/Download";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import styles from "./home.module.css";

import LoadingScreen from "../Loading/LoadingScreen";

const Home = () => {
  const {
    commonData: userData,
    setCommonData: setUserData,
    currentUser,
    setCurrentUser,
    loadingContext: loading,
    setLoadingContext: setLoading,
  } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      // If data is already there, we still fetch to keep it fresh or just use it.
      // For now, let's fetch always on Home mount to ensure dashboard is up to date.
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
        setCurrentUser(userProfile);

        const incidentSnap = await getDocs(collection(db, "incidents"));
        const filteredIncidents = incidentSnap.docs
          .filter((doc) =>
            doc.id.toLowerCase().startsWith(userProfile.username.toLowerCase()),
          )
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setUserData(filteredIncidents);
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUserData, setLoading]);

  if (loading) return <LoadingScreen message="Loading dashboard..." />;

  console.log("Filtered Incidents for", currentUser?.username, ":", userData);

  // total collision
  const totalCollisions = userData.filter(
    (incident) => incident.incident_detection === "Collision",
  ).length;

  // total near miss
  const totalNearMisses = userData.filter(
    (incident) => incident.incident_detection === "Near Collision",
  ).length;

  // total safe trip
  const totalSafeTrips = userData.filter(
    (incident) => incident.incident_detection === "No Incident",
  ).length;

  // Dashboard Stats
  const stats = [
    {
      icon: "💥",
      value: totalCollisions.toString(),
      label: "Collisions",
      valClass: styles.valCollisions,
    },
    {
      icon: "⚠️",
      value: totalNearMisses.toString(),
      label: "Near collision",
      valClass: styles.valNearMisses,
    },
    {
      icon: "✅",
      value: totalSafeTrips.toString(),
      label: "No incident",
      valClass: styles.valSafeTrips,
    },
    {
      icon: "🚗",
      value: userData.length.toString(),
      label: "Total Trips",
      valClass: styles.valVehicles,
    },
  ];

  const totalTrips = totalCollisions + totalNearMisses + totalSafeTrips;

  const distributionData = [
    {
      name: "Collision",
      value:
        totalTrips > 0 ? Math.round((totalCollisions / totalTrips) * 100) : 0,
      color: "#fe4a5a",
    },
    {
      name: "Near Collision",
      value:
        totalTrips > 0 ? Math.round((totalNearMisses / totalTrips) * 100) : 0,
      color: "#facc15",
    },
    {
      name: "Safe",
      value:
        totalTrips > 0 ? Math.round((totalSafeTrips / totalTrips) * 100) : 0,
      color: "#06d6a0",
    },
  ];

  // Individual Incident Status (Show only last 7, most recent first)
  const lastSevenIncidents = userData.slice(-7).reverse();
  const barData = Array.from({ length: 7 }).map((_, i) => {
    const incident = lastSevenIncidents[i];
    const type = incident?.incident_detection;
    return {
      name: `#${i + 1}`,
      Collision: type === "Collision" ? 3 : 0,
      NearMiss: type === "Near Collision" ? 2 : 0,
      Safe: type === "No Incident" ? 1 : 0,
    };
  });

  const CustomYAxisTick = ({ x, y, payload }) => {
    const icons = {
      3: "💥",
      2: "⚠️",
      1: "✅",
    };
    return (
      <text
        x={x - 10}
        y={y + 5}
        textAnchor="end"
        style={{ fontSize: "16px", filter: "grayscale(0)" }}
      >
        {icons[payload.value]}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "12px",
            borderRadius: "8px",
            color: "#1f2937",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{ fontWeight: 600 }}
          >{`${payload[0].name} : ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${s.valClass}`}>
                {s.value}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* Donut Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <BarChartIcon style={{ color: "#4f46e5", fontSize: "22px" }} />
            Incident Distribution
          </div>
          <div
            className={styles.chartContent}
            style={{ display: "flex", alignItems: "center" }}
          >
            <ResponsiveContainer width="65%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend to the right */}
            <div
              style={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "13px",
                }}
              >
                {distributionData.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#4b5563",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: entry.color,
                      }}
                    ></span>
                    {entry.name}{" "}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {entry.value}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <ShowChartIcon style={{ color: "#4f46e5", fontSize: "22px" }} />
            Recent Incidents (Last 7)
          </div>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[1, 2, 3]}
                  tick={<CustomYAxisTick />}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                {/* <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #111827",
                    borderRadius: "8px",
                    color: "#111827",
                    boxShadow: "0 10px 15px -3px #111827",
                  }}
                  itemStyle={{ color: "#111827" }}
                  formatter={(value, name) => {
                    const status =
                      value === 3
                        ? "Collision"
                        : value === 2
                          ? "Near Miss"
                          : "Safe";
                    return [status, name];
                  }}
                /> */}
                <Bar
                  dataKey="Collision"
                  stackId="a"
                  fill="#fe4a5a"
                  radius={[4, 4, 0, 0]}
                  barSize={45}
                />
                <Bar
                  dataKey="NearMiss"
                  stackId="a"
                  fill="#facc15"
                  radius={[4, 4, 0, 0]}
                  barSize={45}
                />
                <Bar
                  dataKey="Safe"
                  stackId="a"
                  fill="#06d6a0"
                  radius={[4, 4, 0, 0]}
                  barSize={45}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend for Bar Chart at bottom */}
            <div
              style={{
                height: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingBottom: "5px",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  gap: "24px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#4b5563",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#fe4a5a",
                    }}
                  ></span>{" "}
                  Collision
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#4b5563",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#facc15",
                    }}
                  ></span>{" "}
                  Near Collision
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#4b5563",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#06d6a0",
                    }}
                  ></span>{" "}
                  Safe
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Banner */}
      <div className={styles.downloadBanner}>
        <div className={styles.bannerInfo}>
          <div className={styles.bannerTitle}>
            <PhoneIphoneIcon style={{ fontSize: "22px" }} />
            Download Our Mobile App
          </div>
          <p className={styles.bannerDesc}>
            Get real-time alerts, detailed trip histories, and seamless driver
            tracking right from your pocket. Available on iOS and Android.
          </p>
        </div>
        <a
          href="https://drive.google.com/file/d/1tgJ_5mjRK9zhAfNlhKZlv2QnIxYsrwx8/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.downloadButton}
          style={{ textDecoration: "none" }}
        >
          <DownloadIcon style={{ fontSize: "20px" }} /> Get the App
        </a>
      </div>
    </div>
  );
};

export default Home;
