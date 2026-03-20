import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_Api,
  headers: { "Content-Type": "application/json" },
});

export default api;
