import AppNavbar from "./AppNavbar";

/**
 * Main application layout (after login)
 */
function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top navigation */}
      <AppNavbar />

      {/* Page content */}
      <main className="flex-grow-1 bg-light">
        <div className="container-fluid py-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;