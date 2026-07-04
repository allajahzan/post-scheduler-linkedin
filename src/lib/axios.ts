import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle 401 globally, e.g. redirect to login
    const isUnauthorized = error.response?.status === 401;
    const isUserNotFound =
      error.response?.status === 404 && error.config?.url === "/user/me";

    if (isUnauthorized || isUserNotFound) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/signup")
      ) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
