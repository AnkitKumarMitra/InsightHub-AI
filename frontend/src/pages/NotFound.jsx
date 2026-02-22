import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="fw-bold">404</h1>
        <p className="text-muted">Page not found</p>
        <Link to="/chat" className="btn btn-primary btn-sm">
          Go to Chat
        </Link>
      </div>
    </div>
  );
}

export default NotFound;