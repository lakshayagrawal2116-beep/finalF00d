import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

export const recommendFood = async (payload) => {
  const response = await API.post("/recommend", payload);
  return response.data;
};