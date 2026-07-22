// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.novacrest.io/api/admin/",
  headers: {
    Accept: "application/json",
  },
});

// TODO: NOTE: CSRF handling is temporarily disabled.
// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TODO
// Response interceptor to refresh token if expired
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const expiredToken = localStorage.getItem("access_token");
//         const refreshResponse = await axios.post(
//           `${process.env.React_App_Api_Url}refresh-token`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${expiredToken}` },
//           },
//         );

//         const newAccessToken = refreshResponse.data.access_token;
//         localStorage.setItem("access_token", newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Token refresh failed", refreshError);
//         localStorage.removeItem("access_token");
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export const request = async ({
  url,
  method = "GET",
  data = null,
  baseURL = null,
  headers = {},
}) => {
  try {
    const config = {
      url,
      method,
      baseURL: baseURL || api.defaults.baseURL,
      headers: {
        ...headers,
      },
    };

    if (data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    if (method.toUpperCase() === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default api;
