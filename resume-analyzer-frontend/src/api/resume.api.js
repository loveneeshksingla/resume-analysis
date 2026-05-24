import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // your backend
});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTJkYjQxOTRhY2U0MDZiNzdmOGJjMiIsImlhdCI6MTc3OTYyMDY3MywiZXhwIjoxNzgwMjI1NDczfQ.OyH9u-79sy7h5VGhujjLvif88_6UoF0TF886ypO2YdU";

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