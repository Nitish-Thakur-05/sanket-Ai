import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./pages/error/Error";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./components/Home/Home";
import Login from "./pages/login/Login";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile/Profile";
import History from "./components/History/History";
import Alerts from "./components/Alerts/Alerts";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="history" element={<History />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
