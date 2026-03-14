import React from "react";
import styles from "./loading.module.css";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
