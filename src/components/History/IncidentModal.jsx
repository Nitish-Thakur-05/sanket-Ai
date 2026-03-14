import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./IncidentModal.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RoomIcon from "@mui/icons-material/Room";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import PetsIcon from "@mui/icons-material/Pets";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { toast } from "react-toastify";

const IncidentModal = ({ isOpen, onClose, data }) => {
  const [viewMode, setViewMode] = useState("details"); // 'details' or 'pdf'

  if (!isOpen || !data) return null;

  const pdfUrl = data.report_url || data.pdf_url;

  const handleClose = () => {
    setViewMode("details");
    onClose();
  };

  // Render in #portal
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <ArrowBackIosNewIcon style={{ fontSize: "18px" }} />
        </button>

        {viewMode === "pdf" ? (
          <div className={styles.pdfContainer}>
            <div className={styles.pdfHeader}>
              <h3 className={styles.pdfTitle}>Incident Report PDF</h3>
              <button
                className={styles.backToDetails}
                onClick={() => setViewMode("details")}
              >
                Back to Details
              </button>
            </div>
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title="PDF Report"
              className={styles.pdfFrame}
            ></iframe>
          </div>
        ) : (
          <>
            {/* Top Map Section */}
            <div className={styles.mapSection}>
              <iframe
                title="Incident Location"
                className={styles.mapFrame}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(data.location || "Bhopal, Madhya Pradesh")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              ></iframe>
              <div className={styles.locationLabel}>
                <RoomIcon style={{ fontSize: "14px", color: "#fe4a5a" }} />
                {data.location || "Location not available"}
              </div>
            </div>

            {/* Content Section */}
            <div className={styles.content}>
              <div className={styles.badge}>
                <span role="img" aria-label="boom">
                  💥
                </span>{" "}
                {data.type === "Collision" ? "Collision" : data.type} Detected
              </div>

              <h2 className={styles.title}>Incident Report</h2>
              <p className={styles.subtitle}>
                {data.date} • Frame #
                {data.incident_frame || data.frame_number || "N/A"}
              </p>

              <div className={styles.countsGrid}>
                <div className={styles.countPod}>
                  <DirectionsCarIcon
                    className={styles.countIcon}
                    style={{ color: "#fe4a5a" }}
                  />
                  <div className={styles.countNumber}>
                    {data.vehicles || data.car_count || 0}
                  </div>
                </div>
                <div className={styles.countPod}>
                  <PersonIcon
                    className={styles.countIcon}
                    style={{ color: "#facc15" }}
                  />
                  <div className={styles.countNumber}>
                    {data.pedestrians || data.pedestrian_count || 0}
                  </div>
                </div>
                <div className={styles.countPod}>
                  <PetsIcon
                    className={styles.countIcon}
                    style={{ color: "#3b82f6" }}
                  />
                  <div className={styles.countNumber}>
                    {data.animals || data.animal_count || 0}
                  </div>
                </div>
                <div className={styles.countPod}>
                  <DirectionsBikeIcon
                    className={styles.countIcon}
                    style={{ color: "#06d6a0" }}
                  />
                  <div className={styles.countNumber}>
                    {data.bicyclists || data.bicycle_count || 0}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>Incident Details</div>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Type</span>
                    <span
                      className={styles.detailValue}
                      style={{
                        color:
                          data.type === "Collision"
                            ? "#fe4a5a"
                            : data.type === "Near Miss" ||
                                data.type === "Near Collision"
                              ? "#facc15"
                              : "#06d6a0",
                      }}
                    >
                      {data.type}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ego Car Involved</span>
                    <span className={styles.detailValue}>
                      {data.ego_car_involved ? "yes" : "No"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Incident Frame</span>
                    <span className={styles.detailValue}>
                      {data.incident_frame || data.frame_number || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>Emergency Contacts</div>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <PersonIcon
                        style={{ fontSize: "18px", color: "#4f46e5" }}
                      />
                      <span className={styles.detailLabel}>Contact 1</span>
                    </div>
                    <span className={styles.detailValue}>
                      {data.emergency_name ||
                        data.emergency_contact_1_name ||
                        "N/A"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <PersonIcon
                        style={{ fontSize: "18px", color: "#4f46e5" }}
                      />
                      <span className={styles.detailLabel}>Contact 2</span>
                    </div>
                    <span className={styles.detailValue}>
                      {data.emergency_contact_2_name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>Narrative</div>
                <div className={styles.narrativeText}>
                  {data.caption || data.description || "The system is processing the visual data to provide a detailed narrative of the event."}
                </div>
                {(data.reason || data.incident_reason) && (
                  <div className={styles.reasonSection}>
                    <p className={styles.reasonLabel}>Identified Cause</p>
                    <p className={styles.reasonText}>{data.reason || data.incident_reason}</p>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.pdfButton}
                  onClick={() => {
                    if (pdfUrl) {
                      setViewMode("pdf");
                    } else {
                      toast.warning(
                        "PDF Report not available for this incident.",
                      );
                    }
                  }}
                >
                  <PictureAsPdfIcon style={{ fontSize: "20px" }} />
                  Download PDF Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById("portal"),
  );
};

export default IncidentModal;
