import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./adminLayout.module.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const [commonData, setCommonData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.layoutContainer}>
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={styles.mainContent}>
        {/* Mobile Header containing Menu Toggle, Branding, and Profile */}
        <div className={styles.mobileHeader}>
          <button
            className={styles.menuButton}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? (
              <CloseIcon className={styles.menuIcon} />
            ) : (
              <MenuIcon className={styles.menuIcon} />
            )}
          </button>

          <div className={styles.mobileBrand}>
            Admin<span>Panel</span>
          </div>

          <button className={styles.profileButton} aria-label="Profile">
            <AccountCircleIcon className={styles.profileIcon} />
          </button>
        </div>

        {/* Child routes render here */}
        <div className={styles.pageWrapper}>
          <Outlet context={{ commonData, setCommonData, currentUser, setCurrentUser, loadingContext, setLoadingContext }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
