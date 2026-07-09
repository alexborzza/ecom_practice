import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Adjust these to match where your PHP backend is served from
const ME_URL = "http://localhost:8000/me.php";
const LOGIN_URL = "http://localhost:8000/login.php";
const REGISTER_URL = "http://localhost:8000/register.php";
const LOGOUT_URL = "http://localhost:8000/logout.php";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend if a session already exists
  // (e.g. after a page refresh) via the PHP session cookie.
  useEffect(() => {
    fetch(ME_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        setUser(json.user || null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Login failed");
    }
    setUser(json.user);
    return json.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(REGISTER_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Registration failed");
    }
    setUser(json.user);
    return json.user;
  };

  const logout = async () => {
    await fetch(LOGOUT_URL, { method: "POST", credentials: "include" });
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
