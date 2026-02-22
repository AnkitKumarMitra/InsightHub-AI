import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

/* Pages (we’ll implement them next) */
import Login from "../pages/Login";
import Chat from "../pages/Chat";
import Upload from "../pages/Upload";
import NotFound from "../pages/NotFound";
import AppLayout from "../components/layout/AppLayout";

/**
 * Application Routes
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Chat />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Upload />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;