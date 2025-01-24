// src/api.js
import Axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

export const login = (userCredentials) => {
  return Axios.post(`${API_URL}/login`, userCredentials);
};

export const register = (userDetails) => {
  return Axios.post(`${API_URL}/register`, userDetails);
};

export const getJobs = () => {
  return Axios.get(`${API_URL}/jobs`);
};

export const getJobById = (jobId) => {
  return Axios.get(`${API_URL}/jobs/${jobId}`);
};

export const submitApplication = (applicationData) => {
  return Axios.post(`${API_URL}/applications`, applicationData);
};