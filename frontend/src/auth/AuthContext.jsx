import { createContext, useContext, useEffect, useState } from "react";

/**
 * Auth Context
 */
const AuthContext = createContext(null);

/**
 * Decode JWT payload safely
 */
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Check token expiry
 */
function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(decodeToken(storedToken));
    } else {
      localStorage.removeItem("access_token");
    }

    setAuthLoading(false);
  }, []);

  /**
   * Login handler
   */
  const login = (accessToken, persist = true) => {
    setToken(accessToken);
    setUser(decodeToken(accessToken));

    if (persist) {
      localStorage.setItem("access_token", accessToken);
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  /**
   * Auto logout on token expiry
   */
  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const timeout = decoded.exp * 1000 - Date.now();

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(logout, timeout);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook for consuming auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}