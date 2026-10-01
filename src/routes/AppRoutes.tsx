import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Requests from "../pages/Requests/Requests";
import CreateRequest from "../pages/Requests/CreateRequest";
import RequestDetails from "../pages/Requests/RequestDetails";
import Wallet from "../pages/Wallet/Wallet";
import Profile from "../pages/Profile/Profile";
import Notifications from "../pages/Notifications/Notifications";
import Report from "../pages/Report/Report";

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/requests" element={<Requests />} />
    <Route path="/requests/create" element={<CreateRequest />} />
    <Route path="/requests/details" element={<RequestDetails />} />
    <Route path="/wallet" element={<Wallet />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/report" element={<Report />} />
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}
export default AppRoutes;