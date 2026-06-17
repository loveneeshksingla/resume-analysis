import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // your backend
});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzE5ZGYyOWY3ODllYjViMWI5NzhlOSIsImlhdCI6MTc4MTYzNjU5NSwiZXhwIjoxNzgyMjQxMzk1fQ.XxF1yI_Cla4IkGIqteAigV00ixtki76N0TC-bsfhSjI";

// Upload resume
export const uploadResume = (formData) =>
  API.post("/v1/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "idempotency-key": Date.now().toString(),
      "Authorization": `Bearer ${token}`
    },
  });

// Get status
export const getResumeStatus = (id) =>
  API.get(`/v1/resume/get-status/${id}`, {
      headers: {
      "Content-Type": "multipart/form-data",
      "idempotency-key": Date.now().toString(),
      "Authorization": `Bearer ${token}`
    },
  });

export const getResumeHistory = () => {
  return API.get("/v1/resume/history", {
    headers: {
      "Content-Type": "multipart/form-data",
      "idempotency-key": Date.now().toString(),
      "Authorization": `Bearer ${token}`
    },
  });
};