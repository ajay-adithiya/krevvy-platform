import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  console.log("document.cookie:", document.cookie);
  console.log("Cookies.get():", Cookies.get());
  console.log(
    "Cookies.get(accessToken):",
    Cookies.get("accessToken"),
  );

  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.set(
      "Authorization",
      `Bearer ${token}`,
    );

    console.log(
      "Final Authorization:",
      config.headers.get("Authorization"),
    );

    console.log("Authorization header added");
  } else {
    console.log("NO ACCESS TOKEN FOUND");
  }

  return config;
});

export default api;