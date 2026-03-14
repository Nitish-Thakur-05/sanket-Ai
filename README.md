# 🛡️ Sanket AI - Advanced Road Safety & Incident Analytics

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)

**Sanket AI** is a state-of-the-art AI-driven web application designed to enhance road safety through real-time incident monitoring, predictive analytics, and detailed event reporting. It provides a comprehensive dashboard for tracking vehicle collisions, near-collisions, and safe driving patterns.

---

## ✨ Key Features

### 📊 Dynamic Analytics Dashboard
*   **Real-time Stats**: Track total collisions, near collisions, and safe trips at a glance.
*   **Visual Insights**: Interactive distribution donut charts and dynamic bar charts representing recent driving trends.
*   **Mobile Connectivity**: Quick-access banner to download the companion mobile app for on-the-go tracking.

### 📜 Incident History & Intelligence
*   **Comprehensive Log**: A searchable and filterable history of all detected incidents.
*   **Deep-Dive Analysis**: Detailed information for every incident, including vehicle counts, pedestrian involved, and AI-generated narratives.
*   **Integrated Mapping**: View the exact location of incidents with embedded Google Maps.

### 📄 Professional Reporting
*   **In-Modal PDF Viewer**: View detailed incident reports without leaving the application.
*   **PDF Generation**: Access and download formal PDF reports for insurance or safety audits.

### 🔒 Secure & Personalized
*   **User Authentication**: Secure login system with role-based access.
*   **Personalized Profiles**: Tracks incidents specific to individual users and vehicles.
*   **Protected Routing**: Ensures data privacy through secure navigation guards.

---

## 🛠️ Technology Stack

| Category | technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (Vite) |
| **State & Database** | Firebase Firestore |
| **Styling** | Vanilla CSS (CSS Modules) & Material UI |
| **Navigation** | React Router 7 |
| **Visualizations** | Recharts |
| **Notifications** | React Toastify |
| **Icons** | MUI Icons Material |

---

## 📂 Project Structure

```text
sanket-ai/
├── src/
│   ├── components/       # Reusable UI components (Sidebar, Modals, Layouts)
│   ├── firebase/         # Firebase initialization and database config
│   ├── pages/            # Page-level components (Login, Home, Error)
│   ├── assets/           # Static assets, images, and brand logos
│   ├── App.jsx           # Root application entry
│   ├── Router.jsx        # Routing configuration
│   └── index.css         # Global styles and design tokens
├── public/               # Public assets
└── vite.config.js        # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/)

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/sanket-ai.git
    cd sanket-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📱 Mobile App
The Sanket AI ecosystem includes a mobile application for real-time driver assistance. You can find the latest distribution here: [Get the App](https://drive.google.com/file/d/1tgJ_5mjRK9zhAfNlhKZlv2QnIxYsrwx8/view?usp=sharing)

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is private and proprietary. Copyright © 2026 Sanket AI.
