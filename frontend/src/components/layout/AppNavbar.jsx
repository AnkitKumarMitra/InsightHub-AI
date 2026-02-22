import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import AddUserModal from "../users/AddUserModal";

function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddUser, setShowAddUser] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-3">
          {/* Brand */}
          <NavLink className="navbar-brand fw-bold" to="/chat">
            InsightHub AI
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#appNavbar"
            aria-controls="appNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav links */}
          <div className="collapse navbar-collapse" id="appNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Chat
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/upload"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Upload Documents
                </NavLink>
              </li>
            </ul>

            <button
              className="btn btn-outline-primary btn-sm me-3"
              onClick={() => setShowAddUser(true)}
            >
              Add User
            </button>

            {/* User & logout */}
            <div className="d-flex align-items-center gap-3">
              {user?.sub && (
                <span className="text-muted small d-none d-lg-inline">
                  {user.sub}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AddUserModal
        show={showAddUser}
        onClose={() => setShowAddUser(false)}
      />
    </>
  );
}

export default AppNavbar;