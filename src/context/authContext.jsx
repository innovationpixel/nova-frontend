import { createContext, useState, useEffect } from "react";
import { request } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    let parsedUser = null;

    if (userData) {
      try {
        parsedUser = JSON.parse(userData);
      } catch (error) {
        parsedUser = null;
      }
    }

    if (token) {
      setUser({ access_token: token, ...(parsedUser || {}) });
    }

    setLoading(false);
  }, []);

  const storeDataInLocalStorage = (response) => {
    const { expires_in, token, user } = response;
    /** Permission Scenario */
    const permissions = Array.isArray(user?.permissions) ? user.permissions.map((p) => p.key) : [];
    localStorage.setItem("permissions", JSON.stringify(permissions));

    /** token Scenario */
    if (token) localStorage.setItem("access_token", token);

    /** Store User*/
    if (user) localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("nova_role", JSON.stringify(user?.role ?? null));
    if (expires_in !== undefined && expires_in !== null) {
      localStorage.setItem("expire", expires_in);
    } else {
      localStorage.removeItem("expire");
    }

    if (token || user) {
      setUser({
        ...(user || {}),
        ...(token ? { access_token: token } : {}),
      });
    }
  };

  const removeDataInLocalStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("expire");
    localStorage.removeItem("nova_role");
    localStorage.removeItem("email");
    setUser(null);
  };

  const verifyOTP = async (code) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("email", localStorage.getItem("email"));
    try {
      const response = await request({
        url: "verify-login",
        method: "POST",
        data: formData,
      });
      storeDataInLocalStorage(response.data);
      return { isError: false, response: response };
    } catch (error) {
      return { isError: true, error: error };
    }
  };

  const getOTP = async () => {
    try {
      const response = await request({
        url: "get-otp",
        method: "GET",
      });
      return { isError: false, response: response };
    } catch (error) {
      return { isError: true, error: error };
    }
  };

  const login = async (email, password) => {
    localStorage.setItem("email", email);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    let response = [];
    try {
      response = await request({
        url: "login",
        method: "POST",
        data: formData,
      });
      return { isError: false, response: response };
    } catch (error) {
      return { isError: true, error: error };
    }
  };

  const logoutUser = async () => {
    let token =  localStorage.getItem("access_token");
    let formData = new FormData();
    formData.append("token", token);
    try {
      await request({
        url: "logout",
        method: "POST",
        data: formData
      });
    } catch (err) { }
  };

  const logout = () => {
    logoutUser();
    removeDataInLocalStorage();
  };

  const isAuthenticated = () => {
    return user && user.access_token;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, verifyOTP, getOTP, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
