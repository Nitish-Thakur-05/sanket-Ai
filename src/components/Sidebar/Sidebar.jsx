import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./sidebar.module.css";

const iconMap = {
  home: HomeIcon,
  history: HistoryIcon,
  notifications: NotificationsIcon,
  person: PersonIcon,
};

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Home", path: "/dashboard", icon: "home" },
    { name: "History", path: "/dashboard/history", icon: "history" },
    { name: "Alerts", path: "/dashboard/alerts", icon: "notifications" },
    { name: "Profile", path: "/dashboard/profile", icon: "person" },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.brand}>
        Admin<span>Panel</span>
      </div>
      <nav className={styles.navList}>
        {menuItems.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navItem} ${styles.activeNavItem}`
                  : styles.navItem
              }
            >
              <IconComponent className={styles.navIcon} />
              <span className={styles.navText}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.logoutContainer}>
        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userEmail");
            navigate("/");
          }}
        >
          <LogoutIcon className={styles.navIcon} />
          <span className={styles.navText}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
